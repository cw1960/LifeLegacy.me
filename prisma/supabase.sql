-- Supabase SQL initialization script for LifeLegacy.me
-- Generated from Prisma schema

-- Organization table
CREATE TABLE IF NOT EXISTS "Organization" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "subdomain" TEXT NOT NULL UNIQUE,
  "subscriptionTier" TEXT NOT NULL DEFAULT 'basic',
  "maxUsers" INTEGER NOT NULL DEFAULT 10,
  "branding" JSONB,
  "customDomain" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Organization-User relationship table
CREATE TABLE IF NOT EXISTS "OrganizationUser" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "role" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE("organizationId", "userId"),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE
);

-- Profile table
CREATE TABLE IF NOT EXISTS "Profile" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL UNIQUE,
  "organizationId" UUID NOT NULL,
  "firstName" TEXT,
  "lastName" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "avatarUrl" TEXT,
  "bio" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

-- Document table
CREATE TABLE IF NOT EXISTS "Document" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "fileUrl" TEXT NOT NULL,
  "fileType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "category" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

-- Online Account table
CREATE TABLE IF NOT EXISTS "OnlineAccount" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "accountName" TEXT NOT NULL,
  "website" TEXT,
  "username" TEXT,
  "email" TEXT,
  "recoveryPhone" TEXT,
  "notes" TEXT,
  "category" TEXT NOT NULL,
  "accessInstructions" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

-- Digital Asset table
CREATE TABLE IF NOT EXISTS "DigitalAsset" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "assetName" TEXT NOT NULL,
  "assetType" TEXT NOT NULL,
  "value" DECIMAL,
  "accessInstructions" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

-- Device table
CREATE TABLE IF NOT EXISTS "Device" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "deviceName" TEXT NOT NULL,
  "deviceType" TEXT NOT NULL,
  "manufacturer" TEXT,
  "model" TEXT,
  "serialNumber" TEXT,
  "accessInstructions" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

-- Estate Attorney table
CREATE TABLE IF NOT EXISTS "EstateAttorney" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "firm" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

-- Authorized Contact table
CREATE TABLE IF NOT EXISTS "AuthorizedContact" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "relationship" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "accessLevel" TEXT NOT NULL,
  "notes" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

-- Healthcare Directive table
CREATE TABLE IF NOT EXISTS "HealthcareDirective" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "directiveType" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "documentUrl" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

-- Pet Care Directive table
CREATE TABLE IF NOT EXISTS "PetCareDirective" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "petName" TEXT NOT NULL,
  "petType" TEXT NOT NULL,
  "careInstructions" TEXT NOT NULL,
  "vetInfo" TEXT,
  "caretakerName" TEXT,
  "caretakerContact" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

-- Legacy Story table
CREATE TABLE IF NOT EXISTS "LegacyStory" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "recipients" TEXT[] NOT NULL,
  "deliveryTrigger" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

-- Family Member table
CREATE TABLE IF NOT EXISTS "FamilyMember" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "relationship" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

-- Conversation History table
CREATE TABLE IF NOT EXISTS "ConversationHistory" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "sessionId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

-- Create updateUpdatedAt function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updatedAt
CREATE TRIGGER update_organization_updated_at
BEFORE UPDATE ON "Organization"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_organization_user_updated_at
BEFORE UPDATE ON "OrganizationUser"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profile_updated_at
BEFORE UPDATE ON "Profile"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_document_updated_at
BEFORE UPDATE ON "Document"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_online_account_updated_at
BEFORE UPDATE ON "OnlineAccount"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_digital_asset_updated_at
BEFORE UPDATE ON "DigitalAsset"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_device_updated_at
BEFORE UPDATE ON "Device"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_estate_attorney_updated_at
BEFORE UPDATE ON "EstateAttorney"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_authorized_contact_updated_at
BEFORE UPDATE ON "AuthorizedContact"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_healthcare_directive_updated_at
BEFORE UPDATE ON "HealthcareDirective"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pet_care_directive_updated_at
BEFORE UPDATE ON "PetCareDirective"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_legacy_story_updated_at
BEFORE UPDATE ON "LegacyStory"
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_family_member_updated_at
BEFORE UPDATE ON "FamilyMember"
FOR EACH ROW EXECUTE FUNCTION update_updated_at(); 