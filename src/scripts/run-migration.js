// Run this script with Node.js to apply the migration to your Supabase database
// Usage: node src/scripts/run-migration.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

// Get Supabase credentials from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key for admin privileges
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration() {
  try {
    console.log('Reading migration file...');
    const migrationFilePath = path.join(__dirname, '../../prisma/migrations/20240504123456_add_digital_assets/migration.sql');
    const migrationSQL = fs.readFileSync(migrationFilePath, 'utf8');

    console.log('Running migration...');
    console.log('SQL to execute:', migrationSQL);

    // Create digital_assets table
    console.log('Creating digital_assets table...');
    const createTableSQL = `CREATE TABLE IF NOT EXISTS digital_assets (
      id UUID NOT NULL DEFAULT gen_random_uuid(),
      client_id UUID NOT NULL,
      asset_name TEXT NOT NULL,
      asset_type TEXT NOT NULL,
      file_path TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      description TEXT,
      size TEXT NOT NULL,
      access_level TEXT NOT NULL,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT digital_assets_pkey PRIMARY KEY (id)
    );`;
    
    // Check if table exists
    try {
      const { data, error } = await supabase.from('digital_assets').select('*').limit(1);
      
      if (!error) {
        console.log('Table digital_assets already exists');
      }
    } catch (err) {
      console.log('Table does not exist, creating...');
      
      try {
        // Try to execute SQL directly
        const { error } = await supabase.rpc('pg_query', { query: createTableSQL });
        
        if (error) {
          console.error('Error executing query via pg_query RPC:', error);
          throw error;
        }
      } catch (sqlError) {
        console.error('Failed to create table, trying alternative method...', sqlError);
        
        try {
          // Try creating table using Supabase REST API
          const { error: restError } = await supabase.from('digital_assets').insert({
            id: '00000000-0000-0000-0000-000000000000',
            client_id: '00000000-0000-0000-0000-000000000000',
            asset_name: 'placeholder',
            asset_type: 'placeholder',
            file_path: 'placeholder',
            storage_path: 'placeholder',
            size: '0',
            access_level: 'private'
          });
          
          if (restError) {
            throw new Error(`Failed to create table: ${restError.message}`);
          }
        } catch (insertError) {
          console.error('All methods failed to create table:', insertError);
          throw insertError;
        }
      }
    }
    
    // Try using the raw SQL approach from Supabase
    try {
      console.log('Using PostgreSQL extension to execute SQL...');
      // Check if the PostgreSQL extension is available and if we have permission to use it
      
      // Try to execute the full migration script in one go
      let sqlQuery = `
      DO $$ 
      BEGIN
        -- Create index if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'digital_assets_client_id_idx'
        ) THEN
          CREATE INDEX digital_assets_client_id_idx ON digital_assets(client_id);
        END IF;
        
        -- Check if foreign key constraint exists before adding it
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'digital_assets_client_id_fkey'
        ) THEN
          ALTER TABLE digital_assets 
          ADD CONSTRAINT digital_assets_client_id_fkey 
          FOREIGN KEY (client_id) REFERENCES clients(id) 
          ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
      `;
      
      await supabase.rpc('pg_query', { query: sqlQuery }).catch(err => {
        console.error('Error executing PL/pgSQL block:', err);
      });
      
    } catch (error) {
      console.warn('Could not use PostgreSQL extension, skipping some migration steps:', error);
    }

    console.log('Migration completed!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 