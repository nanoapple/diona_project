-- Add appointment_id to case_notes to link notes directly to appointments
ALTER TABLE public.case_notes 
ADD COLUMN appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL;

-- Add metadata column to store additional note information
ALTER TABLE public.case_notes 
ADD COLUMN metadata jsonb DEFAULT '{}';

-- Update note_type to support the new note-taking modes
ALTER TABLE public.case_notes 
ALTER COLUMN note_type TYPE text;

-- Add check constraint for valid note types
ALTER TABLE public.case_notes 
ADD CONSTRAINT valid_note_types 
CHECK (note_type IN ('general', 'clinical', 'dictation', 'ocr', 'template', 'freestyle', 'session'));

-- Create index for appointment_id for better query performance
CREATE INDEX idx_case_notes_appointment_id ON public.case_notes(appointment_id);

-- Create index for note_type for filtering
CREATE INDEX idx_case_notes_type ON public.case_notes(note_type);

-- Add session_notes column to appointments table to track if session has notes
ALTER TABLE public.appointments 
ADD COLUMN session_notes_count integer DEFAULT 0;

-- Create function to update session notes count
CREATE OR REPLACE FUNCTION public.update_session_notes_count()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for session notes count
CREATE TRIGGER update_session_notes_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.case_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_session_notes_count();

-- Update existing notes count for appointments (one-time update)
UPDATE public.appointments 
SET session_notes_count = (
  SELECT COUNT(*) 
  FROM public.case_notes 
  WHERE case_notes.appointment_id = appointments.id
);

-- Add template_data column to store template structure for template-based notes
ALTER TABLE public.case_notes 
ADD COLUMN template_data jsonb;

-- Create index for metadata searches
CREATE INDEX idx_case_notes_metadata ON public.case_notes USING GIN(metadata);

-- Add comment to explain the new columns
COMMENT ON COLUMN public.case_notes.appointment_id IS 'Links note directly to an appointment for session-based notes';
COMMENT ON COLUMN public.case_notes.metadata IS 'Stores additional note metadata like dictation confidence, OCR data, etc.';
COMMENT ON COLUMN public.case_notes.template_data IS 'Stores template structure and field data for template-based notes';
COMMENT ON COLUMN public.appointments.session_notes_count IS 'Cached count of notes associated with this appointment session';