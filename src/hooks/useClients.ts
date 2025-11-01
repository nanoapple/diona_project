import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Client {
  id: string;
  tenant_id: string;
  user_profile_id?: string;
  created_by: string;
  
  // Personal Details
  title?: string;
  first_name: string;
  last_name: string;
  preferred_first_name?: string;
  date_of_birth: string;
  sex: string;
  gender_identity?: string;
  pronouns?: string;
  cultural_identity?: string;
  
  // Contact Information
  email?: string;
  mobile_phone: string;
  alternate_phone?: string;
  address_line1: string;
  address_line2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  time_zone?: string;
  
  // Communication Preferences
  communication_preferences?: {
    appointmentReminders?: string[];
    marketingMessages?: boolean;
    bookingConfirmationEmails?: boolean;
    bookingCancellationEmails?: boolean;
  };
  
  // NDIS Plan Details
  ndis_participant_number?: string;
  ndis_funding_type?: string;
  ndis_start_date?: string;
  ndis_end_date?: string;
  ndis_amount_remaining?: string;
  
  // Clinical & Case Info
  date_of_injury?: string;
  injury_type?: string;
  primary_reason?: string;
  concession_type?: string;
  insurer?: string;
  lawyer_solicitor?: string;
  
  // Legal Issues
  has_legal_issues?: boolean;
  legal_details?: {
    courtOrder?: boolean;
    detention?: boolean;
    communityService?: boolean;
    notes?: string;
  };
  
  // Billing & Invoicing
  billing_details?: {
    invoiceTo?: string;
    emailInvoiceTo?: string;
    extraInfo?: string;
  };
  
  // Emergency Contact
  emergency_contact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
  
  // Referral Information
  referral_details?: {
    source?: string;
    referringPractitioner?: string;
    referralType?: string;
  };
  
  // Additional
  notes?: string;
  engagement_enabled?: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface CreateClientInput {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: string;
  mobile_phone: string;
  address_line1: string;
  preferred_first_name?: string;
  title?: string;
  gender_identity?: string;
  pronouns?: string;
  cultural_identity?: string;
  email?: string;
  alternate_phone?: string;
  address_line2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  time_zone?: string;
  communication_preferences?: any;
  ndis_participant_number?: string;
  ndis_funding_type?: string;
  ndis_start_date?: string;
  ndis_end_date?: string;
  ndis_amount_remaining?: string;
  date_of_injury?: string;
  injury_type?: string;
  primary_reason?: string;
  concession_type?: string;
  insurer?: string;
  lawyer_solicitor?: string;
  has_legal_issues?: boolean;
  legal_details?: any;
  billing_details?: any;
  emergency_contact?: any;
  referral_details?: any;
  notes?: string;
  engagement_enabled?: boolean;
}

export function useClients() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all clients
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Client[];
    },
  });

  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: async (clientData: CreateClientInput) => {
      // Get current session (more reliable than getUser)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Not authenticated. Please log in and try again.');
      }

      // Get user profile to get tenant_id
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, tenant_id')
        .eq('user_id', session.user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error(`Failed to fetch user profile: ${profileError.message}`);
      }
      if (!userProfile) throw new Error('User profile not found');

      // Insert client
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          ...clientData,
          tenant_id: userProfile.tenant_id,
          created_by: userProfile.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client created",
        description: "New client has been added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating client",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client updated",
        description: "Client information has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating client",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client deleted",
        description: "Client has been removed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting client",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    clients,
    isLoading,
    error,
    createClient: createClientMutation.mutateAsync,
    updateClient: updateClientMutation.mutateAsync,
    deleteClient: deleteClientMutation.mutateAsync,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
}
