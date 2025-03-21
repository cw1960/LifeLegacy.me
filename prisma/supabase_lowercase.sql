-- Supabase SQL initialization script for LifeLegacy.me
-- Generated from Prisma schema (with lowercase table names for better Supabase compatibility)

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  description TEXT,
  website TEXT,
  active BOOLEAN DEFAULT true NOT NULL
);

-- Enable RLS on organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Organization branding table for white-labeling
CREATE TABLE IF NOT EXISTS organization_brandings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  primary_color TEXT DEFAULT '#4F46E5' NOT NULL,
  secondary_color TEXT DEFAULT '#6B7280' NOT NULL,
  logo_url TEXT,
  logo_square_url TEXT,
  favicon TEXT,
  display_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  bio_html TEXT,
  profile_image_url TEXT,
  organization_id UUID UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
);

-- Enable RLS on organization_brandings
ALTER TABLE organization_brandings ENABLE ROW LEVEL SECURITY;

-- Professionals table
CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT DEFAULT 'member' NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE,
  auth_user_id TEXT UNIQUE NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  professional_type TEXT,
  license_number TEXT,
  specialty TEXT
);

-- Enable RLS on professionals
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

-- Create policies for professionals
CREATE POLICY "Allow professionals to read colleagues in same organization"
ON professionals
FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM professionals
    WHERE auth_user_id = auth.uid()
  )
);

CREATE POLICY "Allow professionals to manage their own profile"
ON professionals
FOR ALL
USING (auth_user_id = auth.uid());

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE,
  auth_user_id TEXT UNIQUE,
  has_logged_in BOOLEAN DEFAULT false NOT NULL,
  onboarding_complete BOOLEAN DEFAULT false NOT NULL,
  profile_complete BOOLEAN DEFAULT false NOT NULL,
  docs_uploaded INTEGER DEFAULT 0 NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  primary_professional_id UUID REFERENCES professionals(id)
);

-- Enable RLS on clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  category TEXT DEFAULT 'other' NOT NULL,
  description TEXT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE
);

-- Enable RLS on documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Client activities table
CREATE TABLE IF NOT EXISTS client_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE
);

-- Enable RLS on client_activities
ALTER TABLE client_activities ENABLE ROW LEVEL SECURITY;

-- Client invitations table
CREATE TABLE IF NOT EXISTS client_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  invited_by_user_id TEXT NOT NULL,
  organization_id UUID NOT NULL,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  email_count INTEGER DEFAULT 0 NOT NULL,
  invitation_token TEXT UNIQUE NOT NULL,
  UNIQUE(email, organization_id)
);

-- Enable RLS on client_invitations
ALTER TABLE client_invitations ENABLE ROW LEVEL SECURITY;

-- Create updated_at triggers for all tables that have updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_organization_brandings_updated_at
BEFORE UPDATE ON organization_brandings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_professionals_updated_at
BEFORE UPDATE ON professionals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_client_invitations_updated_at
BEFORE UPDATE ON client_invitations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create RLS policies

-- Organizations policies
CREATE POLICY "Allow organization access to authenticated professionals"
ON organizations
FOR ALL
TO authenticated
USING (
  id IN (
    SELECT organization_id FROM professionals
    WHERE auth_user_id = auth.uid()
  )
);

-- Organization brandings policies
CREATE POLICY "Allow branding access to authenticated professionals"
ON organization_brandings
FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM professionals
    WHERE auth_user_id = auth.uid()
  )
);

-- Clients policies
CREATE POLICY "Allow professionals to manage clients in their organization"
ON clients
FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM professionals
    WHERE auth_user_id = auth.uid()
  )
);

CREATE POLICY "Allow clients to read their own data"
ON clients
FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

-- Documents policies
CREATE POLICY "Allow professionals to manage documents for their organization's clients"
ON documents
FOR ALL
TO authenticated
USING (
  client_id IN (
    SELECT c.id FROM clients c
    JOIN professionals p ON c.organization_id = p.organization_id
    WHERE p.auth_user_id = auth.uid()
  )
);

CREATE POLICY "Allow clients to manage their own documents"
ON documents
FOR ALL
TO authenticated
USING (
  client_id IN (
    SELECT id FROM clients
    WHERE auth_user_id = auth.uid()
  )
);

-- Client activities policies
CREATE POLICY "Allow professionals to view client activities in their organization"
ON client_activities
FOR SELECT
TO authenticated
USING (
  client_id IN (
    SELECT c.id FROM clients c
    JOIN professionals p ON c.organization_id = p.organization_id
    WHERE p.auth_user_id = auth.uid()
  )
);

-- Client invitation policies
CREATE POLICY "Allow professionals to manage invitations for their organization"
ON client_invitations
FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM professionals
    WHERE auth_user_id = auth.uid()
  )
);

-- Organization table
CREATE TABLE IF NOT EXISTS "organizations" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "subdomain" TEXT NOT NULL UNIQUE,
  "subscription_tier" TEXT NOT NULL DEFAULT 'basic',
  "max_users" INTEGER NOT NULL DEFAULT 10,
  "branding" JSONB,
  "custom_domain" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Organization-User relationship table
CREATE TABLE IF NOT EXISTS "organization_users" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organization_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "role" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE("organization_id", "user_id"),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);

-- Profile table
CREATE TABLE IF NOT EXISTS "profiles" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL UNIQUE,
  "organization_id" UUID NOT NULL,
  "first_name" TEXT,
  "last_name" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "avatar_url" TEXT,
  "bio" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
);

-- Document table
CREATE TABLE IF NOT EXISTS "documents" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organization_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "file_url" TEXT NOT NULL,
  "file_type" TEXT NOT NULL,
  "file_size" INTEGER NOT NULL,
  "category" TEXT NOT NULL,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
);

-- Online Account table
CREATE TABLE IF NOT EXISTS "online_accounts" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organization_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "account_name" TEXT NOT NULL,
  "website" TEXT,
  "username" TEXT,
  "email" TEXT,
  "recovery_phone" TEXT,
  "notes" TEXT,
  "category" TEXT NOT NULL,
  "access_instructions" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
);

-- Digital Asset table
CREATE TABLE IF NOT EXISTS "digital_assets" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organization_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "asset_name" TEXT NOT NULL,
  "asset_type" TEXT NOT NULL,
  "value" DECIMAL,
  "access_instructions" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
);

-- Device table
CREATE TABLE IF NOT EXISTS "devices" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organization_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "device_name" TEXT NOT NULL,
  "device_type" TEXT NOT NULL,
  "manufacturer" TEXT,
  "model" TEXT,
  "serial_number" TEXT,
  "access_instructions" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
);

-- Estate Attorney table
CREATE TABLE IF NOT EXISTS "estate_attorneys" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organization_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "firm" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
);

-- Authorized Contact table
CREATE TABLE IF NOT EXISTS "authorized_contacts" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organization_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "relationship" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "access_level" TEXT NOT NULL,
  "notes" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
);

-- Healthcare Directive table
CREATE TABLE IF NOT EXISTS "healthcare_directives" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organization_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "directive_type" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "document_url" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
);

-- Pet Care Directive table
CREATE TABLE IF NOT EXISTS "pet_care_directives" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organization_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "pet_name" TEXT NOT NULL,
  "pet_type" TEXT NOT NULL,
  "care_instructions" TEXT NOT NULL,
  "vet_info" TEXT,
  "caretaker_name" TEXT,
  "caretaker_contact" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
);

-- Legacy Story table
CREATE TABLE IF NOT EXISTS "legacy_stories" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organization_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "recipients" TEXT[] NOT NULL,
  "delivery_trigger" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
);

-- Family Member table
CREATE TABLE IF NOT EXISTS "family_members" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organization_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "relationship" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
);

-- Conversation History table
CREATE TABLE IF NOT EXISTS "conversation_history" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organization_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "session_id" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
);

-- Create updateUpdatedAt function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON "organizations"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_organization_users_updated_at
BEFORE UPDATE ON "organization_users"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON "profiles"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON "documents"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_online_accounts_updated_at
BEFORE UPDATE ON "online_accounts"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_digital_assets_updated_at
BEFORE UPDATE ON "digital_assets"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_devices_updated_at
BEFORE UPDATE ON "devices"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_estate_attorneys_updated_at
BEFORE UPDATE ON "estate_attorneys"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_authorized_contacts_updated_at
BEFORE UPDATE ON "authorized_contacts"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_healthcare_directives_updated_at
BEFORE UPDATE ON "healthcare_directives"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pet_care_directives_updated_at
BEFORE UPDATE ON "pet_care_directives"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_legacy_stories_updated_at
BEFORE UPDATE ON "legacy_stories"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_family_members_updated_at
BEFORE UPDATE ON "family_members"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create stored procedure for onboarding
CREATE OR REPLACE FUNCTION create_organization_and_professional(
  org_name TEXT,
  org_subdomain TEXT,
  org_description TEXT,
  prof_email TEXT,
  prof_first_name TEXT,
  prof_last_name TEXT,
  prof_auth_user_id TEXT,
  prof_professional_type TEXT,
  prof_license_number TEXT,
  prof_specialty TEXT
) RETURNS JSONB AS $$
DECLARE
  new_org_id UUID;
  new_prof_id UUID;
  result JSONB;
BEGIN
  -- Start transaction
  BEGIN
    -- Create organization
    INSERT INTO organizations (
      name,
      subdomain,
      description,
      active
    ) VALUES (
      org_name,
      org_subdomain,
      org_description,
      true
    ) RETURNING id INTO new_org_id;

    -- Create professional
    INSERT INTO professionals (
      email,
      first_name,
      last_name,
      role,
      active,
      auth_user_id,
      organization_id,
      professional_type,
      license_number,
      specialty
    ) VALUES (
      prof_email,
      prof_first_name,
      prof_last_name,
      'admin',
      true,
      prof_auth_user_id,
      new_org_id,
      prof_professional_type,
      prof_license_number,
      prof_specialty
    ) RETURNING id INTO new_prof_id;

    -- Return success with IDs
    result := jsonb_build_object(
      'success', true,
      'organization_id', new_org_id,
      'professional_id', new_prof_id,
      'error', null
    );
    
    -- Commit transaction
    RETURN result;
  EXCEPTION WHEN OTHERS THEN
    -- Roll back transaction on error
    ROLLBACK;
    result := jsonb_build_object(
      'success', false,
      'organization_id', null,
      'professional_id', null,
      'error', SQLERRM
    );
    RETURN result;
  END;
END;
$$ LANGUAGE plpgsql; 