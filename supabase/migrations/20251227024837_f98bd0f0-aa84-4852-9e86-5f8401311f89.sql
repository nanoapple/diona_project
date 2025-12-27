-- Fix clients table RLS policy to be more restrictive
-- The clients_belongs_to_user() function already exists, but let's update it to be more secure
-- by checking if the user created the client, not just tenant membership

-- Drop and recreate the clients_belongs_to_user function with proper access control
CREATE OR REPLACE FUNCTION public.clients_belongs_to_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM clients c
    JOIN user_profiles up ON up.tenant_id = c.tenant_id
    WHERE up.user_id = auth.uid()
      AND c.created_by = up.id
  )
  OR EXISTS (
    -- Allow admins and owners to view all clients in their tenant
    SELECT 1
    FROM tenant_members tm
    JOIN user_profiles up ON up.id = tm.user_profile_id
    WHERE up.user_id = auth.uid()
      AND tm.is_active = true
      AND tm.role IN ('owner', 'admin')
  );
$$;

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view clients in their tenant" ON public.clients;

-- Create a more restrictive policy that uses the fixed function
CREATE POLICY "Users can view clients they created or as admin"
  ON public.clients FOR SELECT
  USING (
    -- User created the client
    created_by = get_user_profile_id()
    OR
    -- User is an admin/owner in the same tenant
    (
      user_belongs_to_tenant(tenant_id) 
      AND user_has_tenant_role(tenant_id, 'admin')
    )
    OR
    (
      user_belongs_to_tenant(tenant_id) 
      AND user_has_tenant_role(tenant_id, 'owner')
    )
  );