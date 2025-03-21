export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          subdomain: string
          subscription_tier: string
          max_users: number
          branding: Json | null
          custom_domain: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subdomain: string
          subscription_tier?: string
          max_users?: number
          branding?: Json | null
          custom_domain?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subdomain?: string
          subscription_tier?: string
          max_users?: number
          branding?: Json | null
          custom_domain?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      organization_users: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          first_name: string | null
          last_name: string | null
          email: string
          phone: string | null
          avatar_url: string | null
          bio: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          first_name?: string | null
          last_name?: string | null
          email: string
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          title: string
          description: string | null
          file_url: string
          file_type: string
          file_size: number
          category: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          title: string
          description?: string | null
          file_url: string
          file_type: string
          file_size: number
          category: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          title?: string
          description?: string | null
          file_url?: string
          file_type?: string
          file_size?: number
          category?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      online_accounts: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          account_name: string
          website: string | null
          username: string | null
          email: string | null
          recovery_phone: string | null
          notes: string | null
          category: string
          access_instructions: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          account_name: string
          website?: string | null
          username?: string | null
          email?: string | null
          recovery_phone?: string | null
          notes?: string | null
          category: string
          access_instructions?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          account_name?: string
          website?: string | null
          username?: string | null
          email?: string | null
          recovery_phone?: string | null
          notes?: string | null
          category?: string
          access_instructions?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      digital_assets: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          asset_name: string
          asset_type: string
          value: number | null
          access_instructions: string | null
          notes: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          asset_name: string
          asset_type: string
          value?: number | null
          access_instructions?: string | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          asset_name?: string
          asset_type?: string
          value?: number | null
          access_instructions?: string | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      devices: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          device_name: string
          device_type: string
          manufacturer: string | null
          model: string | null
          serial_number: string | null
          access_instructions: string | null
          notes: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          device_name: string
          device_type: string
          manufacturer?: string | null
          model?: string | null
          serial_number?: string | null
          access_instructions?: string | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          device_name?: string
          device_type?: string
          manufacturer?: string | null
          model?: string | null
          serial_number?: string | null
          access_instructions?: string | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      estate_attorneys: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          name: string
          firm: string | null
          email: string | null
          phone: string | null
          address: string | null
          notes: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          name: string
          firm?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          name?: string
          firm?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      authorized_contacts: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          name: string
          relationship: string
          email: string | null
          phone: string | null
          address: string | null
          access_level: string
          notes: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          name: string
          relationship: string
          email?: string | null
          phone?: string | null
          address?: string | null
          access_level: string
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          name?: string
          relationship?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          access_level?: string
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      healthcare_directives: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          directive_type: string
          content: string
          document_url: string | null
          notes: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          directive_type: string
          content: string
          document_url?: string | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          directive_type?: string
          content?: string
          document_url?: string | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      pet_care_directives: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          pet_name: string
          pet_type: string
          care_instructions: string
          vet_info: string | null
          caretaker_name: string | null
          caretaker_contact: string | null
          notes: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          pet_name: string
          pet_type: string
          care_instructions: string
          vet_info?: string | null
          caretaker_name?: string | null
          caretaker_contact?: string | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          pet_name?: string
          pet_type?: string
          care_instructions?: string
          vet_info?: string | null
          caretaker_name?: string | null
          caretaker_contact?: string | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      legacy_stories: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          title: string
          content: string
          recipients: string[]
          delivery_trigger: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          title: string
          content: string
          recipients: string[]
          delivery_trigger?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          title?: string
          content?: string
          recipients?: string[]
          delivery_trigger?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          name: string
          relationship: string
          email: string | null
          phone: string | null
          address: string | null
          notes: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          name: string
          relationship: string
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          name?: string
          relationship?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      conversation_history: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          session_id: string
          role: string
          content: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          session_id: string
          role: string
          content: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          session_id?: string
          role?: string
          content?: string
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 