-- CreateTable
CREATE TABLE "digital_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "client_id" UUID NOT NULL,
    "asset_name" TEXT NOT NULL,
    "asset_type" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "description" TEXT,
    "size" TEXT NOT NULL,
    "access_level" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "digital_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "digital_assets_client_id_idx" ON "digital_assets"("client_id");

-- AddForeignKey
ALTER TABLE "digital_assets" ADD CONSTRAINT "digital_assets_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE; 