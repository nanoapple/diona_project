-- Create user_roles table for secure role management (if not exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Drop all existing triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_comprehensive ON auth.users;

-- Drop and recreate the function
DROP FUNCTION IF EXISTS public.handle_new_user_comprehensive() CASCADE;

-- Create new comprehensive user creation trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user_comprehensive()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _tenant_id uuid;
  _user_profile_id uuid;
  _user_role user_role;
BEGIN
  -- Get role from metadata, default to 'client'
  _user_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client');

  -- Get or create default tenant (legacy-org)
  SELECT id INTO _tenant_id FROM tenants WHERE slug = 'legacy-org' LIMIT 1;
  
  IF _tenant_id IS NULL THEN
    INSERT INTO tenants (name, slug) VALUES ('Legacy Organization', 'legacy-org')
    RETURNING id INTO _tenant_id;
  END IF;

  -- Create user profile (only if it doesn't exist)
  INSERT INTO user_profiles (
    user_id,
    tenant_id,
    full_name,
    email,
    role,
    email_verified
  ) VALUES (
    NEW.id,
    _tenant_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    _user_role,
    NEW.email_confirmed_at IS NOT NULL
  )
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO _user_profile_id;

  -- If profile already existed, get its ID
  IF _user_profile_id IS NULL THEN
    SELECT id INTO _user_profile_id FROM user_profiles WHERE user_id = NEW.id;
  END IF;

  -- Add role to user_roles table (if not exists)
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, _user_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Add to tenant_members (if not exists)
  INSERT INTO tenant_members (
    tenant_id,
    user_profile_id,
    role,
    is_active
  ) VALUES (
    _tenant_id,
    _user_profile_id,
    CASE 
      WHEN _user_role = 'admin' THEN 'admin'
      ELSE 'member'
    END,
    true
  )
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created_comprehensive
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_comprehensive();