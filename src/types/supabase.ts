export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          subdomain: string
          created_at: string
          updated_at: string
          description: string | null
          website: string | null
          active: boolean
        }
        Insert: {
          id?: string
          name: string
          subdomain: string
          created_at?: string
          updated_at?: string
          description?: string | null
          website?: string | null
          active?: boolean
        }
        Update: {
          id?: string
          name?: string
          subdomain?: string
          created_at?: string
          updated_at?: string
          description?: string | null
          website?: string | null
          active?: boolean
        }
      }
      organization_brandings: {
        Row: {
          id: string
          organization_id: string
          logo_url: string | null
          primary_color: string | null
          accent_color: string | null
          created_at: string
          updated_at: string
          logo_square_url: string | null
          favicon: string | null
          bio_html: string | null
          profile_image_url: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          logo_url?: string | null
          primary_color?: string | null
          accent_color?: string | null
          created_at?: string
          updated_at?: string
          logo_square_url?: string | null
          favicon?: string | null
          bio_html?: string | null
          profile_image_url?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          logo_url?: string | null
          primary_color?: string | null
          accent_color?: string | null
          created_at?: string
          updated_at?: string
          logo_square_url?: string | null
          favicon?: string | null
          bio_html?: string | null
          profile_image_url?: string | null
        }
      }
      professionals: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          organization_id: string
          role: string
          created_at: string
          updated_at: string
          last_login_at: string | null
          auth_user_id: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          organization_id: string
          role?: string
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          auth_user_id: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          organization_id?: string
          role?: string
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          auth_user_id?: string
        }
      }
      clients: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          organization_id: string
          professional_id: string | null
          created_at: string
          updated_at: string
          active: boolean
          last_login_at: string | null
          auth_user_id: string | null
          phone: string | null
          date_of_birth: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          country: string
          profile_complete: boolean
          docs_uploaded: number
          primary_professional_id: string | null
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          organization_id: string
          professional_id?: string | null
          created_at?: string
          updated_at?: string
          active?: boolean
          last_login_at?: string | null
          auth_user_id?: string | null
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string
          profile_complete?: boolean
          docs_uploaded?: number
          primary_professional_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          organization_id?: string
          professional_id?: string | null
          created_at?: string
          updated_at?: string
          active?: boolean
          last_login_at?: string | null
          auth_user_id?: string | null
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string
          profile_complete?: boolean
          docs_uploaded?: number
          primary_professional_id?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          client_id: string
          document_type: string
          title: string
          description: string | null
          file_path: string
          file_size: number
          uploaded_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          document_type: string
          title: string
          description?: string | null
          file_path: string
          file_size: number
          uploaded_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          document_type?: string
          title?: string
          description?: string | null
          file_path?: string
          file_size?: number
          uploaded_at?: string
          updated_at?: string
        }
      }
      client_activities: {
        Row: {
          id: string
          client_id: string
          activity_type: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          activity_type: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          activity_type?: string
          description?: string
          created_at?: string
        }
      }
      client_invitations: {
        Row: {
          id: string
          email: string
          token: string
          first_name: string
          last_name: string
          client_id: string | null
          organization_id: string
          status: string
          notes: string | null
          created_at: string
          expires_at: string
          accepted_at: string | null
        }
        Insert: {
          id?: string
          email: string
          token: string
          first_name: string
          last_name: string
          client_id?: string | null
          organization_id: string
          status?: string
          notes?: string | null
          created_at?: string
          expires_at: string
          accepted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          token?: string
          first_name?: string
          last_name?: string
          client_id?: string | null
          organization_id?: string
          status?: string
          notes?: string | null
          created_at?: string
          expires_at?: string
          accepted_at?: string | null
        }
      }
      digital_assets: {
        Row: {
          id: string
          client_id: string
          asset_name: string
          asset_type: string
          file_path: string
          storage_path: string
          description: string | null
          size: string
          access_level: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          asset_name: string
          asset_type: string
          file_path: string
          storage_path: string
          description?: string | null
          size: string
          access_level: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          asset_name?: string
          asset_type?: string
          file_path?: string
          storage_path?: string
          description?: string | null
          size?: string
          access_level?: string
          created_at?: string
          updated_at?: string
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