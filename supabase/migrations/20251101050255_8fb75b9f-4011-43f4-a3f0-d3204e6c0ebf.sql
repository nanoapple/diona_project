-- Relax overly strict profile constraints to allow registration
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_check1;
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_check;

-- Optional: add softer validation via partial check (allow nulls at signup)
ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_role_valid CHECK (role IN ('client','psychologist','counsellor','social_worker','admin'));
