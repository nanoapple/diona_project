-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('client', 'psychologist', 'counsellor', 'social_worker', 'admin');

-- Create security questions table
CREATE TABLE public.security_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default security questions
INSERT INTO public.security_questions (question) VALUES
  ('What was the name of your first pet?'),
  ('What city were you born in?'),
  ('What was your mother''s maiden name?'),
  ('What was the name of your elementary school?'),
  ('What was your favorite food as a child?');

-- Create comprehensive user profiles table (replace the existing simple one)
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  license_number TEXT, -- For practitioners
  specializations TEXT[], -- For practitioners
  
  -- Client-specific fields
  assigned_practitioner_id UUID REFERENCES public.user_profiles(id),
  is_password_assigned BOOLEAN DEFAULT false, -- True for client accounts with practitioner-assigned passwords
  
  -- Security questions
  security_question_1_id UUID REFERENCES public.security_questions(id),
  security_answer_1 TEXT,
  security_question_2_id UUID REFERENCES public.security_questions(id),
  security_answer_2 TEXT,
  
  -- Third-party auth
  google_id TEXT,
  microsoft_id TEXT,
  apple_id TEXT,
  
  -- Profile details
  avatar_url TEXT,
  bio TEXT,
  date_of_birth DATE,
  address JSONB, -- Store address as JSON object
  emergency_contact JSONB, -- Store emergency contact info
  
  -- Account status
  is_active BOOLEAN NOT NULL DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.user_profiles(id),
  
  -- Constraints
  UNIQUE(user_id),
  CHECK (
    -- Ensure clients have assigned practitioners
    (role = 'client' AND assigned_practitioner_id IS NOT NULL) OR 
    (role != 'client')
  ),
  CHECK (
    -- Ensure practitioners have license numbers
    (role IN ('psychologist', 'counsellor', 'social_worker') AND license_number IS NOT NULL) OR 
    (role NOT IN ('psychologist', 'counsellor', 'social_worker'))
  )
);

-- Create index for better performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_assigned_practitioner ON public.user_profiles(assigned_practitioner_id);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_questions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Practitioners can view their assigned clients" 
ON public.user_profiles 
FOR SELECT 
USING (
  role = 'client' AND assigned_practitioner_id IN (
    SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Practitioners and admins can view other practitioners" 
ON public.user_profiles 
FOR SELECT 
USING (
  role IN ('psychologist', 'counsellor', 'social_worker') AND
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('psychologist', 'counsellor', 'social_worker', 'admin')
  )
);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Practitioners can update their assigned clients" 
ON public.user_profiles 
FOR UPDATE 
USING (
  role = 'client' AND assigned_practitioner_id IN (
    SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update all profiles" 
ON public.user_profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Practitioners and admins can create profiles" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('psychologist', 'counsellor', 'social_worker', 'admin')
  )
);

-- RLS policies for security_questions
CREATE POLICY "Anyone can view active security questions" 
ON public.security_questions 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can modify security questions" 
ON public.security_questions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create trigger for updating updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user_comprehensive()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only create profile if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = NEW.id) THEN
    INSERT INTO public.user_profiles (
      user_id, 
      full_name, 
      email,
      role,
      email_verified
    ) VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
      NEW.email,
      COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client'),
      NEW.email_confirmed_at IS NOT NULL
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created_comprehensive
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_comprehensive();

-- Create function to get current user role (for RLS policies)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT role FROM public.user_profiles WHERE user_id = auth.uid();
$$;

-- Create function to check if user can access client data
CREATE OR REPLACE FUNCTION public.can_access_client_data(client_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles current_user
    JOIN public.user_profiles client ON client.id = client_profile_id
    WHERE current_user.user_id = auth.uid() 
    AND (
      -- User is the client themselves
      client.user_id = auth.uid() OR
      -- User is the assigned practitioner
      client.assigned_practitioner_id = current_user.id OR
      -- User is an admin
      current_user.role = 'admin'
    )
  );
$$;