-- First create a profile entry
INSERT INTO public.profiles (id, user_id, name, role)
SELECT 
  up.id,
  up.user_id,
  COALESCE(up.full_name, 'Test User'),
  'psychologist'
FROM public.user_profiles up
WHERE up.id = '8a31cde5-ea66-4556-8925-9c7ebf64f847'
ON CONFLICT (id) DO NOTHING;

-- Then insert the test appointment
INSERT INTO public.appointments (
  tenant_id,
  created_by,
  title,
  appointment_type,
  start_time,
  end_time,
  status,
  location,
  notes
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '8a31cde5-ea66-4556-8925-9c7ebf64f847',
  'Test Client - Initial Consultation',
  'consultation',
  (date_trunc('week', CURRENT_DATE) + INTERVAL '2 days' + INTERVAL '10 hours')::timestamptz,
  (date_trunc('week', CURRENT_DATE) + INTERVAL '2 days' + INTERVAL '10 hours 45 minutes')::timestamptz,
  'scheduled',
  'Room 1 - In Person',
  'Test appointment to verify database connection'
);