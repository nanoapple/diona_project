-- Create clients table with comprehensive fields
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  user_profile_id UUID REFERENCES public.user_profiles(id),
  created_by UUID NOT NULL,
  
  -- Personal Details
  title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  preferred_first_name TEXT,
  date_of_birth DATE NOT NULL,
  sex TEXT NOT NULL,
  gender_identity TEXT,
  pronouns TEXT,
  cultural_identity TEXT,
  
  -- Contact Information
  email TEXT,
  mobile_phone TEXT NOT NULL,
  alternate_phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  suburb TEXT,
  state TEXT,
  postcode TEXT,
  country TEXT DEFAULT 'Australia',
  time_zone TEXT DEFAULT 'Australia/Sydney',
  
  -- Communication Preferences
  communication_preferences JSONB DEFAULT '{"appointmentReminders": [], "marketingMessages": false}'::jsonb,
  
  -- NDIS Plan Details
  ndis_participant_number TEXT,
  ndis_funding_type TEXT,
  ndis_start_date DATE,
  ndis_end_date DATE,
  ndis_amount_remaining TEXT,
  
  -- Clinical & Case Info
  date_of_injury DATE,
  injury_type TEXT,
  primary_reason TEXT,
  concession_type TEXT,
  insurer TEXT,
  lawyer_solicitor TEXT,
  
  -- Legal Issues
  has_legal_issues BOOLEAN DEFAULT false,
  legal_details JSONB,
  
  -- Billing & Invoicing
  billing_details JSONB,
  
  -- Emergency Contact
  emergency_contact JSONB,
  
  -- Referral Information
  referral_details JSONB,
  
  -- Additional
  notes TEXT,
  engagement_enabled BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view clients in their tenant"
ON public.clients FOR SELECT
USING (user_belongs_to_tenant(tenant_id));

CREATE POLICY "Practitioners can create clients in their tenant"
ON public.clients FOR INSERT
WITH CHECK (user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can update clients in their tenant"
ON public.clients FOR UPDATE
USING (user_belongs_to_tenant(tenant_id));

CREATE POLICY "Users can delete clients in their tenant"
ON public.clients FOR DELETE
USING (user_belongs_to_tenant(tenant_id));

-- Indexes for performance
CREATE INDEX idx_clients_tenant_id ON public.clients(tenant_id);
CREATE INDEX idx_clients_created_by ON public.clients(created_by);
CREATE INDEX idx_clients_last_name ON public.clients(last_name);
CREATE INDEX idx_clients_first_name ON public.clients(first_name);
CREATE INDEX idx_clients_email ON public.clients(email);
CREATE INDEX idx_clients_mobile_phone ON public.clients(mobile_phone);

-- Trigger for updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();