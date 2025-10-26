-- ============================================================================
-- MULTI-TENANCY MIGRATION - PHASE 1: Foundation (FIXED AMBIGUOUS COLUMNS)
-- ============================================================================

-- Step 1: Create tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'professional', 'enterprise')),
  is_active BOOLEAN DEFAULT true,
  suspended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Step 2: Create tenant_members table
CREATE TABLE public.tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  invited_by UUID REFERENCES public.user_profiles(id),
  joined_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_profile_id)
);

ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;

-- Step 3: Create security definer functions
CREATE OR REPLACE FUNCTION public.user_belongs_to_tenant(_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM tenant_members tm
    JOIN user_profiles up ON up.id = tm.user_profile_id
    WHERE up.user_id = auth.uid()
      AND tm.tenant_id = _tenant_id
      AND tm.is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_current_tenant()
RETURNS UUID
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tm.tenant_id
  FROM tenant_members tm
  JOIN user_profiles up ON up.id = tm.user_profile_id
  WHERE up.user_id = auth.uid()
    AND tm.is_active = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.user_has_tenant_role(_tenant_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM tenant_members tm
    JOIN user_profiles up ON up.id = tm.user_profile_id
    WHERE up.user_id = auth.uid()
      AND tm.tenant_id = _tenant_id
      AND tm.role = _role
      AND tm.is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_profile_id()
RETURNS UUID
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT up.id
  FROM user_profiles up
  WHERE up.user_id = auth.uid();
$$;

-- Step 4: Create default tenant
INSERT INTO public.tenants (id, name, slug, subscription_tier, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Legacy Organization',
  'legacy-org',
  'enterprise',
  true
);

-- Step 5: Add tenant_id to all tables
ALTER TABLE public.user_profiles ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.case_silos ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.appointments ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.case_notes ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.assessments ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.case_documents ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.reports ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.info_requests ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.timeline_items ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.external_contributors ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- Step 6: Migrate data
UPDATE public.user_profiles SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE public.case_silos SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE public.appointments SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE public.case_notes SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE public.assessments SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE public.case_documents SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE public.reports SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE public.info_requests SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE public.timeline_items SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE public.external_contributors SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- Step 7: Make NOT NULL
ALTER TABLE public.user_profiles ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.case_silos ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.appointments ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.case_notes ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.assessments ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.case_documents ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.reports ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.info_requests ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.timeline_items ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.external_contributors ALTER COLUMN tenant_id SET NOT NULL;

-- Step 8: Create indexes
CREATE INDEX idx_user_profiles_tenant ON public.user_profiles(tenant_id);
CREATE INDEX idx_case_silos_tenant ON public.case_silos(tenant_id);
CREATE INDEX idx_appointments_tenant ON public.appointments(tenant_id);
CREATE INDEX idx_case_notes_tenant ON public.case_notes(tenant_id);
CREATE INDEX idx_assessments_tenant ON public.assessments(tenant_id);
CREATE INDEX idx_case_documents_tenant ON public.case_documents(tenant_id);
CREATE INDEX idx_reports_tenant ON public.reports(tenant_id);
CREATE INDEX idx_info_requests_tenant ON public.info_requests(tenant_id);
CREATE INDEX idx_timeline_items_tenant ON public.timeline_items(tenant_id);
CREATE INDEX idx_external_contributors_tenant ON public.external_contributors(tenant_id);
CREATE INDEX idx_tenant_members_tenant ON public.tenant_members(tenant_id);
CREATE INDEX idx_tenant_members_user_profile ON public.tenant_members(user_profile_id);

-- Step 9: Composite indexes
CREATE INDEX idx_case_silos_tenant_status ON public.case_silos(tenant_id, status);
CREATE INDEX idx_appointments_tenant_start ON public.appointments(tenant_id, start_time);
CREATE INDEX idx_case_notes_tenant_case ON public.case_notes(tenant_id, case_silo_id);

-- Step 10: Migrate users to tenant_members
INSERT INTO public.tenant_members (tenant_id, user_profile_id, role, is_active)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  id,
  CASE 
    WHEN role = 'admin' THEN 'owner'
    WHEN role IN ('psychologist', 'counsellor', 'social_worker') THEN 'admin'
    ELSE 'member'
  END,
  true
FROM public.user_profiles
ON CONFLICT (tenant_id, user_profile_id) DO NOTHING;

-- Step 11: Triggers
CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON public.tenants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_members_updated_at
BEFORE UPDATE ON public.tenant_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- RLS POLICIES - TENANTS
-- ============================================================================

CREATE POLICY "Users can view their tenants"
ON public.tenants
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT tm.tenant_id 
    FROM tenant_members tm
    JOIN user_profiles up ON up.id = tm.user_profile_id
    WHERE up.user_id = auth.uid() AND tm.is_active = true
  )
);

CREATE POLICY "Tenant owners can update tenant"
ON public.tenants
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM tenant_members tm
    JOIN user_profiles up ON up.id = tm.user_profile_id
    WHERE up.user_id = auth.uid() 
      AND tm.tenant_id = tenants.id 
      AND tm.role = 'owner'
      AND tm.is_active = true
  )
);

-- ============================================================================
-- RLS POLICIES - TENANT_MEMBERS
-- ============================================================================

CREATE POLICY "Users can view tenant members"
ON public.tenant_members
FOR SELECT
TO authenticated
USING (
  tenant_id IN (
    SELECT tm.tenant_id 
    FROM tenant_members tm
    JOIN user_profiles up ON up.id = tm.user_profile_id
    WHERE up.user_id = auth.uid() AND tm.is_active = true
  )
);

CREATE POLICY "Tenant admins can invite members"
ON public.tenant_members
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM tenant_members tm
    JOIN user_profiles up ON up.id = tm.user_profile_id
    WHERE up.user_id = auth.uid() 
      AND tm.tenant_id = tenant_members.tenant_id 
      AND tm.role IN ('owner', 'admin')
      AND tm.is_active = true
  )
);

CREATE POLICY "Tenant admins can update members"
ON public.tenant_members
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM tenant_members tm
    JOIN user_profiles up ON up.id = tm.user_profile_id
    WHERE up.user_id = auth.uid() 
      AND tm.tenant_id = tenant_members.tenant_id 
      AND tm.role IN ('owner', 'admin')
      AND tm.is_active = true
  )
);

-- ============================================================================
-- UPDATED RLS POLICIES
-- ============================================================================

-- USER_PROFILES
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Practitioners and admins can create profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Practitioners and admins can view other practitioners" ON public.user_profiles;
DROP POLICY IF EXISTS "Practitioners can view their assigned clients" ON public.user_profiles;
DROP POLICY IF EXISTS "Practitioners can update their assigned clients" ON public.user_profiles;

CREATE POLICY "Users can view profiles in their tenant"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Tenant admins can create profiles"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  public.user_has_tenant_role(tenant_id, 'admin') OR 
  public.user_has_tenant_role(tenant_id, 'owner')
);

-- CASE_SILOS
DROP POLICY IF EXISTS "Users can view cases they're involved in" ON public.case_silos;
DROP POLICY IF EXISTS "Users can update cases they're involved in" ON public.case_silos;
DROP POLICY IF EXISTS "Lawyers and psychologists can create cases" ON public.case_silos;

CREATE POLICY "Users can view cases in their tenant"
ON public.case_silos
FOR SELECT
TO authenticated
USING (
  public.user_belongs_to_tenant(tenant_id) AND
  (
    created_by = public.get_user_profile_id() OR
    assigned_lawyer_id = public.get_user_profile_id() OR
    assigned_psychologist_id = public.get_user_profile_id()
  )
);

CREATE POLICY "Practitioners can create cases in their tenant"
ON public.case_silos
FOR INSERT
TO authenticated
WITH CHECK (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can update cases in their tenant"
ON public.case_silos
FOR UPDATE
TO authenticated
USING (
  public.user_belongs_to_tenant(tenant_id) AND
  (
    created_by = public.get_user_profile_id() OR
    assigned_lawyer_id = public.get_user_profile_id() OR
    assigned_psychologist_id = public.get_user_profile_id()
  )
);

-- APPOINTMENTS
DROP POLICY IF EXISTS "Users can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update appointments" ON public.appointments;

CREATE POLICY "Users can view appointments in their tenant"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  public.user_belongs_to_tenant(tenant_id) AND
  (
    case_silo_id IN (
      SELECT cs.id FROM case_silos cs
      WHERE cs.tenant_id = appointments.tenant_id
        AND (
          cs.created_by = public.get_user_profile_id() OR
          cs.assigned_lawyer_id = public.get_user_profile_id() OR
          cs.assigned_psychologist_id = public.get_user_profile_id()
        )
    ) OR case_silo_id IS NULL
  )
);

CREATE POLICY "Users can create appointments in their tenant"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can update appointments in their tenant"
ON public.appointments
FOR UPDATE
TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

-- CASE_NOTES
DROP POLICY IF EXISTS "Users can view case notes" ON public.case_notes;
DROP POLICY IF EXISTS "Users can create case notes" ON public.case_notes;
DROP POLICY IF EXISTS "Users can update case notes" ON public.case_notes;

CREATE POLICY "Users can view case notes in their tenant"
ON public.case_notes
FOR SELECT
TO authenticated
USING (
  public.user_belongs_to_tenant(tenant_id) AND
  case_silo_id IN (
    SELECT cs.id FROM case_silos cs
    WHERE cs.tenant_id = case_notes.tenant_id
      AND (
        cs.created_by = public.get_user_profile_id() OR
        cs.assigned_lawyer_id = public.get_user_profile_id() OR
        cs.assigned_psychologist_id = public.get_user_profile_id()
      )
  )
);

CREATE POLICY "Users can create case notes in their tenant"
ON public.case_notes
FOR INSERT
TO authenticated
WITH CHECK (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can update case notes in their tenant"
ON public.case_notes
FOR UPDATE
TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

-- ASSESSMENTS
DROP POLICY IF EXISTS "Users can view assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can create assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can update assessments" ON public.assessments;

CREATE POLICY "Users can view assessments in their tenant"
ON public.assessments
FOR SELECT
TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can create assessments in their tenant"
ON public.assessments
FOR INSERT
TO authenticated
WITH CHECK (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can update assessments in their tenant"
ON public.assessments
FOR UPDATE
TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

-- REMAINING TABLES
DROP POLICY IF EXISTS "Users can view documents for their cases" ON public.case_documents;
DROP POLICY IF EXISTS "Users can upload documents for their cases" ON public.case_documents;
DROP POLICY IF EXISTS "Users can update case documents" ON public.case_documents;

CREATE POLICY "Users can view documents in their tenant"
ON public.case_documents FOR SELECT TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can upload documents in their tenant"
ON public.case_documents FOR INSERT TO authenticated
WITH CHECK (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can update documents in their tenant"
ON public.case_documents FOR UPDATE TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

DROP POLICY IF EXISTS "Users can view reports" ON public.reports;
DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update reports" ON public.reports;

CREATE POLICY "Users can view reports in their tenant"
ON public.reports FOR SELECT TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can create reports in their tenant"
ON public.reports FOR INSERT TO authenticated
WITH CHECK (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can update reports in their tenant"
ON public.reports FOR UPDATE TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

DROP POLICY IF EXISTS "Users can view info requests" ON public.info_requests;
DROP POLICY IF EXISTS "Users can create info requests" ON public.info_requests;
DROP POLICY IF EXISTS "Users can update info requests" ON public.info_requests;

CREATE POLICY "Users can view info requests in their tenant"
ON public.info_requests FOR SELECT TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can create info requests in their tenant"
ON public.info_requests FOR INSERT TO authenticated
WITH CHECK (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can update info requests in their tenant"
ON public.info_requests FOR UPDATE TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

DROP POLICY IF EXISTS "Users can view timeline items" ON public.timeline_items;
DROP POLICY IF EXISTS "Users can create timeline items" ON public.timeline_items;

CREATE POLICY "Users can view timeline items in their tenant"
ON public.timeline_items FOR SELECT TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can create timeline items in their tenant"
ON public.timeline_items FOR INSERT TO authenticated
WITH CHECK (public.user_belongs_to_tenant(tenant_id));

DROP POLICY IF EXISTS "Users can view external contributors" ON public.external_contributors;
DROP POLICY IF EXISTS "Users can create external contributors" ON public.external_contributors;
DROP POLICY IF EXISTS "Users can update external contributors" ON public.external_contributors;

CREATE POLICY "Users can view external contributors in their tenant"
ON public.external_contributors FOR SELECT TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can create external contributors in their tenant"
ON public.external_contributors FOR INSERT TO authenticated
WITH CHECK (public.user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can update external contributors in their tenant"
ON public.external_contributors FOR UPDATE TO authenticated
USING (public.user_belongs_to_tenant(tenant_id));