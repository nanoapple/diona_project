-- Fix security issues by setting search_path for functions

-- Update the session notes count function with proper security
CREATE OR REPLACE FUNCTION public.update_session_notes_count()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increase count when new note is added
    IF NEW.appointment_id IS NOT NULL THEN
      UPDATE public.appointments 
      SET session_notes_count = session_notes_count + 1 
      WHERE id = NEW.appointment_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrease count when note is deleted
    IF OLD.appointment_id IS NOT NULL THEN
      UPDATE public.appointments 
      SET session_notes_count = GREATEST(session_notes_count - 1, 0) 
      WHERE id = OLD.appointment_id;
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle appointment_id changes
    IF OLD.appointment_id IS DISTINCT FROM NEW.appointment_id THEN
      -- Decrease count for old appointment
      IF OLD.appointment_id IS NOT NULL THEN
        UPDATE public.appointments 
        SET session_notes_count = GREATEST(session_notes_count - 1, 0) 
        WHERE id = OLD.appointment_id;
      END IF;
      -- Increase count for new appointment
      IF NEW.appointment_id IS NOT NULL THEN
        UPDATE public.appointments 
        SET session_notes_count = session_notes_count + 1 
        WHERE id = NEW.appointment_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Update existing functions with proper security settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 'claimant');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;