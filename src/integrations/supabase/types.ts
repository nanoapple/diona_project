export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_type: string
          attendees: string[] | null
          case_silo_id: string | null
          created_at: string
          created_by: string
          description: string | null
          end_time: string
          id: string
          location: string | null
          notes: string | null
          start_time: string
          status: string
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          appointment_type: string
          attendees?: string[] | null
          case_silo_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          notes?: string | null
          start_time: string
          status?: string
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          appointment_type?: string
          attendees?: string[] | null
          case_silo_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          notes?: string | null
          start_time?: string
          status?: string
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_case_silo_id_fkey"
            columns: ["case_silo_id"]
            isOneToOne: false
            referencedRelation: "case_silos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          assigned_by: string
          assigned_to: string | null
          case_silo_id: string
          completed_date: string | null
          created_at: string
          due_date: string | null
          id: string
          interpretation: string | null
          results: Json | null
          score: number | null
          status: string
          tenant_id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          assigned_by: string
          assigned_to?: string | null
          case_silo_id: string
          completed_date?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          interpretation?: string | null
          results?: Json | null
          score?: number | null
          status?: string
          tenant_id: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string | null
          case_silo_id?: string
          completed_date?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          interpretation?: string | null
          results?: Json | null
          score?: number | null
          status?: string
          tenant_id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_case_silo_id_fkey"
            columns: ["case_silo_id"]
            isOneToOne: false
            referencedRelation: "case_silos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      case_documents: {
        Row: {
          case_silo_id: string
          category: string | null
          created_at: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_verified: boolean | null
          tenant_id: string
          title: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          case_silo_id: string
          category?: string | null
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_verified?: boolean | null
          tenant_id: string
          title: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          case_silo_id?: string
          category?: string | null
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_verified?: boolean | null
          tenant_id?: string
          title?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_documents_case_silo_id_fkey"
            columns: ["case_silo_id"]
            isOneToOne: false
            referencedRelation: "case_silos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      case_notes: {
        Row: {
          case_silo_id: string
          content: string
          created_at: string
          created_by: string
          id: string
          is_private: boolean | null
          note_type: string | null
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          case_silo_id: string
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_private?: boolean | null
          note_type?: string | null
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          case_silo_id?: string
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_private?: boolean | null
          note_type?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_notes_case_silo_id_fkey"
            columns: ["case_silo_id"]
            isOneToOne: false
            referencedRelation: "case_silos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_notes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      case_silos: {
        Row: {
          assigned_lawyer_id: string | null
          assigned_psychologist_id: string | null
          case_number: string | null
          case_type: string
          claim_stage: string | null
          claimant_name: string
          created_at: string
          created_by: string
          id: string
          incident_date: string | null
          priority: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          assigned_lawyer_id?: string | null
          assigned_psychologist_id?: string | null
          case_number?: string | null
          case_type: string
          claim_stage?: string | null
          claimant_name: string
          created_at?: string
          created_by: string
          id?: string
          incident_date?: string | null
          priority?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          assigned_lawyer_id?: string | null
          assigned_psychologist_id?: string | null
          case_number?: string | null
          case_type?: string
          claim_stage?: string | null
          claimant_name?: string
          created_at?: string
          created_by?: string
          id?: string
          incident_date?: string | null
          priority?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_silos_assigned_lawyer_id_fkey"
            columns: ["assigned_lawyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_silos_assigned_psychologist_id_fkey"
            columns: ["assigned_psychologist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_silos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_silos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      external_contributors: {
        Row: {
          access_level: string | null
          added_by: string
          case_silo_id: string
          contact_details: Json | null
          created_at: string
          email: string | null
          id: string
          name: string
          organization: string | null
          role: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          access_level?: string | null
          added_by: string
          case_silo_id: string
          contact_details?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          organization?: string | null
          role: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          access_level?: string | null
          added_by?: string
          case_silo_id?: string
          contact_details?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          organization?: string | null
          role?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_contributors_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_contributors_case_silo_id_fkey"
            columns: ["case_silo_id"]
            isOneToOne: false
            referencedRelation: "case_silos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_contributors_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      info_requests: {
        Row: {
          assigned_to: string | null
          case_silo_id: string
          completed_date: string | null
          created_at: string
          description: string
          due_date: string | null
          id: string
          priority: string | null
          request_type: string | null
          requested_by: string
          response: string | null
          status: string
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          case_silo_id: string
          completed_date?: string | null
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          priority?: string | null
          request_type?: string | null
          requested_by: string
          response?: string | null
          status?: string
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          case_silo_id?: string
          completed_date?: string | null
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          priority?: string | null
          request_type?: string | null
          requested_by?: string
          response?: string | null
          status?: string
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "info_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "info_requests_case_silo_id_fkey"
            columns: ["case_silo_id"]
            isOneToOne: false
            referencedRelation: "case_silos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "info_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "info_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          id: string
          name: string
          role: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          name: string
          role?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          name?: string
          role?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          author_id: string
          case_silo_id: string
          completed_date: string | null
          content: Json | null
          created_at: string
          due_date: string | null
          file_url: string | null
          id: string
          progress: number | null
          reviewer_id: string | null
          sections: Json | null
          status: string
          tenant_id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          author_id: string
          case_silo_id: string
          completed_date?: string | null
          content?: Json | null
          created_at?: string
          due_date?: string | null
          file_url?: string | null
          id?: string
          progress?: number | null
          reviewer_id?: string | null
          sections?: Json | null
          status?: string
          tenant_id: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          case_silo_id?: string
          completed_date?: string | null
          content?: Json | null
          created_at?: string
          due_date?: string | null
          file_url?: string | null
          id?: string
          progress?: number | null
          reviewer_id?: string | null
          sections?: Json | null
          status?: string
          tenant_id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_case_silo_id_fkey"
            columns: ["case_silo_id"]
            isOneToOne: false
            referencedRelation: "case_silos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      security_questions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          question: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          question: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          question?: string
        }
        Relationships: []
      }
      tenant_members: {
        Row: {
          created_at: string
          id: string
          invited_by: string | null
          is_active: boolean | null
          joined_at: string | null
          role: string
          tenant_id: string
          updated_at: string
          user_profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          role?: string
          tenant_id: string
          updated_at?: string
          user_profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          role?: string
          tenant_id?: string
          updated_at?: string
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_members_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          is_active: boolean | null
          name: string
          settings: Json | null
          slug: string
          subscription_tier: string | null
          suspended_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json | null
          slug: string
          subscription_tier?: string | null
          suspended_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json | null
          slug?: string
          subscription_tier?: string | null
          suspended_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      timeline_items: {
        Row: {
          case_silo_id: string
          created_at: string
          created_by: string
          date: string
          description: string | null
          id: string
          item_type: string
          metadata: Json | null
          related_id: string | null
          tenant_id: string
          title: string
        }
        Insert: {
          case_silo_id: string
          created_at?: string
          created_by: string
          date: string
          description?: string | null
          id?: string
          item_type: string
          metadata?: Json | null
          related_id?: string | null
          tenant_id: string
          title: string
        }
        Update: {
          case_silo_id?: string
          created_at?: string
          created_by?: string
          date?: string
          description?: string | null
          id?: string
          item_type?: string
          metadata?: Json | null
          related_id?: string | null
          tenant_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_items_case_silo_id_fkey"
            columns: ["case_silo_id"]
            isOneToOne: false
            referencedRelation: "case_silos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: Json | null
          apple_id: string | null
          assigned_practitioner_id: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          email: string
          email_verified: boolean | null
          emergency_contact: Json | null
          full_name: string
          google_id: string | null
          id: string
          is_active: boolean
          is_password_assigned: boolean | null
          last_login: string | null
          license_number: string | null
          microsoft_id: string | null
          organization: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          security_answer_1: string | null
          security_answer_2: string | null
          security_question_1_id: string | null
          security_question_2_id: string | null
          specializations: string[] | null
          tenant_id: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          address?: Json | null
          apple_id?: string | null
          assigned_practitioner_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          email: string
          email_verified?: boolean | null
          emergency_contact?: Json | null
          full_name: string
          google_id?: string | null
          id?: string
          is_active?: boolean
          is_password_assigned?: boolean | null
          last_login?: string | null
          license_number?: string | null
          microsoft_id?: string | null
          organization?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          security_answer_1?: string | null
          security_answer_2?: string | null
          security_question_1_id?: string | null
          security_question_2_id?: string | null
          specializations?: string[] | null
          tenant_id: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          address?: Json | null
          apple_id?: string | null
          assigned_practitioner_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          email?: string
          email_verified?: boolean | null
          emergency_contact?: Json | null
          full_name?: string
          google_id?: string | null
          id?: string
          is_active?: boolean
          is_password_assigned?: boolean | null
          last_login?: string | null
          license_number?: string | null
          microsoft_id?: string | null
          organization?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          security_answer_1?: string | null
          security_answer_2?: string | null
          security_question_1_id?: string | null
          security_question_2_id?: string | null
          specializations?: string[] | null
          tenant_id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_assigned_practitioner_id_fkey"
            columns: ["assigned_practitioner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_security_question_1_id_fkey"
            columns: ["security_question_1_id"]
            isOneToOne: false
            referencedRelation: "security_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_security_question_2_id_fkey"
            columns: ["security_question_2_id"]
            isOneToOne: false
            referencedRelation: "security_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_client_data: {
        Args: { client_profile_id: string }
        Returns: boolean
      }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_current_tenant: { Args: never; Returns: string }
      get_user_profile_id: { Args: never; Returns: string }
      user_belongs_to_tenant: { Args: { _tenant_id: string }; Returns: boolean }
      user_has_tenant_role: {
        Args: { _role: string; _tenant_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role:
        | "client"
        | "psychologist"
        | "counsellor"
        | "social_worker"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "client",
        "psychologist",
        "counsellor",
        "social_worker",
        "admin",
      ],
    },
  },
} as const
