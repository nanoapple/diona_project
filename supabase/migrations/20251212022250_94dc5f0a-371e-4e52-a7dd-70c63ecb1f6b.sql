-- Add tenant memberships for existing user profiles
INSERT INTO public.tenant_members (tenant_id, user_profile_id, role, is_active)
SELECT 
  up.tenant_id,
  up.id,
  CASE 
    WHEN up.role = 'admin' THEN 'owner'
    ELSE 'member'
  END,
  true
FROM public.user_profiles up
WHERE NOT EXISTS (
  SELECT 1 FROM public.tenant_members tm 
  WHERE tm.user_profile_id = up.id AND tm.tenant_id = up.tenant_id
);