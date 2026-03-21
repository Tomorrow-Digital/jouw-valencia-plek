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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blocked_dates: {
        Row: {
          created_at: string
          end_date: string
          id: string
          reason: string | null
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          arrival_time: string | null
          check_in: string
          check_out: string
          created_at: string
          email: string
          first_name: string
          guests: number
          id: string
          last_name: string
          message: string | null
          phone: string | null
          status: string
          total_price: number | null
        }
        Insert: {
          arrival_time?: string | null
          check_in: string
          check_out: string
          created_at?: string
          email: string
          first_name: string
          guests?: number
          id?: string
          last_name: string
          message?: string | null
          phone?: string | null
          status?: string
          total_price?: number | null
        }
        Update: {
          arrival_time?: string | null
          check_in?: string
          check_out?: string
          created_at?: string
          email?: string
          first_name?: string
          guests?: number
          id?: string
          last_name?: string
          message?: string | null
          phone?: string | null
          status?: string
          total_price?: number | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      crm_conversations: {
        Row: {
          channel: string
          created_at: string | null
          csw_expires_at: string | null
          guest_id: string
          id: string
          last_message_at: string | null
          status: string
          unread_count: number | null
        }
        Insert: {
          channel?: string
          created_at?: string | null
          csw_expires_at?: string | null
          guest_id: string
          id?: string
          last_message_at?: string | null
          status?: string
          unread_count?: number | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          csw_expires_at?: string | null
          guest_id?: string
          id?: string
          last_message_at?: string | null
          status?: string
          unread_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_conversations_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "crm_guests"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_guests: {
        Row: {
          booking_id: string | null
          created_at: string | null
          email: string | null
          id: string
          language: string | null
          name: string
          notes: string | null
          opted_in_at: string | null
          opted_in_marketing: boolean | null
          phone_e164: string
          updated_at: string | null
          wa_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          language?: string | null
          name: string
          notes?: string | null
          opted_in_at?: string | null
          opted_in_marketing?: boolean | null
          phone_e164: string
          updated_at?: string | null
          wa_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          language?: string | null
          name?: string
          notes?: string | null
          opted_in_at?: string | null
          opted_in_marketing?: boolean | null
          phone_e164?: string
          updated_at?: string | null
          wa_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_guests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_messages: {
        Row: {
          content: string | null
          conversation_id: string
          delivered_at: string | null
          direction: string
          id: string
          message_type: string
          metadata: Json | null
          read_at: string | null
          sent_at: string | null
          status: string | null
          wamid: string | null
        }
        Insert: {
          content?: string | null
          conversation_id: string
          delivered_at?: string | null
          direction: string
          id?: string
          message_type?: string
          metadata?: Json | null
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
          wamid?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string
          delivered_at?: string | null
          direction?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
          wamid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "crm_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_templates: {
        Row: {
          body_text: string | null
          buttons: Json | null
          category: string
          created_at: string | null
          header_type: string | null
          id: string
          language: string
          last_synced_at: string | null
          status: string | null
          template_name: string
        }
        Insert: {
          body_text?: string | null
          buttons?: Json | null
          category: string
          created_at?: string | null
          header_type?: string | null
          id?: string
          language?: string
          last_synced_at?: string | null
          status?: string | null
          template_name: string
        }
        Update: {
          body_text?: string | null
          buttons?: Json | null
          category?: string
          created_at?: string | null
          header_type?: string | null
          id?: string
          language?: string
          last_synced_at?: string | null
          status?: string | null
          template_name?: string
        }
        Relationships: []
      }
      custom_pricing: {
        Row: {
          created_at: string
          end_date: string
          id: string
          label: string
          price_per_night: number
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          label: string
          price_per_night: number
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          label?: string
          price_per_night?: number
          start_date?: string
        }
        Relationships: []
      }
      deletion_requests: {
        Row: {
          completed_at: string | null
          confirmation_code: string | null
          created_at: string | null
          details: string | null
          email: string | null
          id: string
          language: string | null
          meta_user_id: string | null
          name: string | null
          phone: string | null
          request_type: string
          source: string
          status: string
          updated_at: string | null
          verification_token: string | null
          verified_at: string | null
        }
        Insert: {
          completed_at?: string | null
          confirmation_code?: string | null
          created_at?: string | null
          details?: string | null
          email?: string | null
          id?: string
          language?: string | null
          meta_user_id?: string | null
          name?: string | null
          phone?: string | null
          request_type?: string
          source?: string
          status?: string
          updated_at?: string | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Update: {
          completed_at?: string | null
          confirmation_code?: string | null
          created_at?: string | null
          details?: string | null
          email?: string | null
          id?: string
          language?: string | null
          meta_user_id?: string | null
          name?: string | null
          phone?: string | null
          request_type?: string
          source?: string
          status?: string
          updated_at?: string | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      integration_configs: {
        Row: {
          config: Json | null
          created_at: string | null
          display_name: string
          id: string
          integration_type: string
          last_error: string | null
          last_health_check: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          display_name: string
          id?: string
          integration_type: string
          last_error?: string | null
          last_health_check?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          display_name?: string
          id?: string
          integration_type?: string
          last_error?: string | null
          last_health_check?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      invite_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          token: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      page_blocks: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          is_visible: boolean | null
          page_id: string
          position: number
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json
          id?: string
          is_visible?: boolean | null
          page_id: string
          position?: number
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          is_visible?: boolean | null
          page_id?: string
          position?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string | null
          id: string
          meta_description: string | null
          owner_id: string | null
          slug: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          meta_description?: string | null
          owner_id?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          meta_description?: string | null
          owner_id?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pricing_config: {
        Row: {
          cleaning_fee: number
          default_price_per_night: number
          id: string
          maximum_stay: number
          minimum_stay: number
          monthly_discount: number
          updated_at: string
          weekly_discount: number
        }
        Insert: {
          cleaning_fee?: number
          default_price_per_night?: number
          id?: string
          maximum_stay?: number
          minimum_stay?: number
          monthly_discount?: number
          updated_at?: string
          weekly_discount?: number
        }
        Update: {
          cleaning_fee?: number
          default_price_per_night?: number
          id?: string
          maximum_stay?: number
          minimum_stay?: number
          monthly_discount?: number
          updated_at?: string
          weekly_discount?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seasonal_pricing: {
        Row: {
          created_at: string
          end_date: string
          id: string
          label: string
          label_en: string
          price_per_night: number
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          label: string
          label_en?: string
          price_per_night: number
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          label?: string
          label_en?: string
          price_per_night?: number
          start_date?: string
        }
        Relationships: []
      }
      site_photos: {
        Row: {
          category: string
          created_at: string
          id: string
          is_primary: boolean
          sort_order: number
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_primary?: boolean
          sort_order?: number
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_deletion_status: {
        Args: { request_code: string; request_id: string }
        Returns: {
          completed_at: string
          confirmation_code: string
          created_at: string
          status: string
        }[]
      }
      increment_unread: { Args: { conv_id: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
