-- Fix the function search path issues by properly handling dependencies

-- First drop the trigger that depends on the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Then drop and recreate the function with proper search path
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 'claimant');
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update the other function with proper search path
DROP FUNCTION IF EXISTS public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add missing RLS policies for remaining tables

-- Reports policies
CREATE POLICY "Users can view reports" ON public.reports FOR SELECT USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Users can update reports" ON public.reports FOR UPDATE USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Timeline items policies
CREATE POLICY "Users can view timeline items" ON public.timeline_items FOR SELECT USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Users can create timeline items" ON public.timeline_items FOR INSERT WITH CHECK (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Info requests policies
CREATE POLICY "Users can view info requests" ON public.info_requests FOR SELECT USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Users can create info requests" ON public.info_requests FOR INSERT WITH CHECK (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Users can update info requests" ON public.info_requests FOR UPDATE USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- External contributors policies
CREATE POLICY "Users can view external contributors" ON public.external_contributors FOR SELECT USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Users can create external contributors" ON public.external_contributors FOR INSERT WITH CHECK (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Users can update external contributors" ON public.external_contributors FOR UPDATE USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Appointments policies
CREATE POLICY "Users can view appointments" ON public.appointments FOR SELECT USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) OR case_silo_id IS NULL
);
CREATE POLICY "Users can create appointments" ON public.appointments FOR INSERT WITH CHECK (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) OR case_silo_id IS NULL
);
CREATE POLICY "Users can update appointments" ON public.appointments FOR UPDATE USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) OR case_silo_id IS NULL
);

-- Add missing UPDATE policies for assessments, case notes, and case documents
CREATE POLICY "Users can update assessments" ON public.assessments FOR UPDATE USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Users can update case notes" ON public.case_notes FOR UPDATE USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Users can update case documents" ON public.case_documents FOR UPDATE USING (
  case_silo_id IN (
    SELECT id FROM public.case_silos WHERE 
    created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_lawyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    assigned_psychologist_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);