-- Create profiles table for users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  company TEXT,
  title TEXT,
  role TEXT NOT NULL DEFAULT 'claimant' CHECK (role IN ('admin', 'lawyer', 'psychologist', 'claimant')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create case_silos table
CREATE TABLE public.case_silos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claimant_name TEXT NOT NULL,
  case_type TEXT NOT NULL,
  case_number TEXT UNIQUE,
  incident_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'closed', 'pending', 'expiring_soon', 'expired')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  claim_stage TEXT DEFAULT 'intake',
  assigned_lawyer_id UUID REFERENCES public.profiles(id),
  assigned_psychologist_id UUID REFERENCES public.profiles(id),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create case_documents table
CREATE TABLE public.case_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_silo_id UUID NOT NULL REFERENCES public.case_silos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT DEFAULT 'general' CHECK (category IN ('medical', 'legal', 'incident', 'assessment', 'report', 'general')),
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create case_notes table
CREATE TABLE public.case_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_silo_id UUID NOT NULL REFERENCES public.case_silos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'clinical', 'legal', 'appointment', 'assessment')),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessments table
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_silo_id UUID NOT NULL REFERENCES public.case_silos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('DASS-21', 'PCL-5', 'PHQ-9', 'GAD-7', 'custom')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES public.profiles(id),
  assigned_by UUID NOT NULL REFERENCES public.profiles(id),
  due_date DATE,
  completed_date DATE,
  results JSONB,
  score INTEGER,
  interpretation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_silo_id UUID NOT NULL REFERENCES public.case_silos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('psychological', 'capacity', 'vocational', 'legal', 'medical')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'review', 'completed', 'finalized')),
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  reviewer_id UUID REFERENCES public.profiles(id),
  content JSONB,
  sections JSONB,
  progress INTEGER DEFAULT 0,
  due_date DATE,
  completed_date DATE,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create timeline_items table
CREATE TABLE public.timeline_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_silo_id UUID NOT NULL REFERENCES public.case_silos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL CHECK (item_type IN ('milestone', 'document', 'assessment', 'report', 'note', 'appointment')),
  date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  related_id UUID, -- Reference to related document, assessment, report, etc.
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create info_requests table
CREATE TABLE public.info_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_silo_id UUID NOT NULL REFERENCES public.case_silos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  request_type TEXT DEFAULT 'document' CHECK (request_type IN ('document', 'information', 'appointment', 'medical_records')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  requested_by UUID NOT NULL REFERENCES public.profiles(id),
  assigned_to UUID REFERENCES public.profiles(id),
  due_date DATE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  response TEXT,
  completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create external_contributors table
CREATE TABLE public.external_contributors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_silo_id UUID NOT NULL REFERENCES public.case_silos(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL,
  organization TEXT,
  contact_details JSONB,
  access_level TEXT DEFAULT 'view' CHECK (access_level IN ('view', 'comment', 'edit')),
  added_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_silo_id UUID REFERENCES public.case_silos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  appointment_type TEXT NOT NULL CHECK (appointment_type IN ('consultation', 'assessment', 'therapy', 'legal_meeting', 'medical_exam')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  attendees UUID[] DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_silos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.info_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for case_silos
CREATE POLICY "Users can view cases they're involved in" ON public.case_silos FOR SELECT USING (
  created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Lawyers and psychologists can create cases" ON public.case_silos FOR INSERT WITH CHECK (
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('lawyer', 'psychologist', 'admin')
);
CREATE POLICY "Users can update cases they're involved in" ON public.case_silos FOR UPDATE USING (
  created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Create RLS policies for case_documents
CREATE POLICY "Users can view documents for their cases" ON public.case_documents FOR SELECT USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Users can upload documents for their cases" ON public.case_documents FOR INSERT WITH CHECK (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Create RLS policies for other tables (similar pattern)
CREATE POLICY "Users can view case notes" ON public.case_notes FOR SELECT USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Users can create case notes" ON public.case_notes FOR INSERT WITH CHECK (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Apply similar policies to all other tables
CREATE POLICY "Users can view assessments" ON public.assessments FOR SELECT USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Users can create assessments" ON public.assessments FOR INSERT WITH CHECK (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Create indexes for better performance
CREATE INDEX idx_case_silos_status ON public.case_silos(status);
CREATE INDEX idx_case_silos_assigned_lawyer ON public.case_silos(assigned_lawyer_id);
CREATE INDEX idx_case_silos_assigned_psychologist ON public.case_silos(assigned_psychologist_id);
CREATE INDEX idx_case_documents_case_silo ON public.case_documents(case_silo_id);
CREATE INDEX idx_case_notes_case_silo ON public.case_notes(case_silo_id);
CREATE INDEX idx_assessments_case_silo ON public.assessments(case_silo_id);
CREATE INDEX idx_reports_case_silo ON public.reports(case_silo_id);
CREATE INDEX idx_timeline_items_case_silo ON public.timeline_items(case_silo_id);
CREATE INDEX idx_timeline_items_date ON public.timeline_items(date);
CREATE INDEX idx_appointments_start_time ON public.appointments(start_time);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 'claimant');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_case_silos_updated_at BEFORE UPDATE ON public.case_silos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_case_documents_updated_at BEFORE UPDATE ON public.case_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_case_notes_updated_at BEFORE UPDATE ON public.case_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON public.assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_info_requests_updated_at BEFORE UPDATE ON public.info_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_external_contributors_updated_at BEFORE UPDATE ON public.external_contributors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();