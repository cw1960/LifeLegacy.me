// Run this script with Node.js to create the digital_assets storage bucket
// Usage: node src/scripts/create-storage-bucket.js

const { createClient } = require('@supabase/supabase-js');
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

async function createStorageBucket() {
  try {
    // Create storage bucket for digital assets
    console.log('Creating storage bucket for digital assets...');
    const { data, error } = await supabase.storage.createBucket('digital_assets', { 
      public: false,
      fileSizeLimit: 52428800 // 50MB file size limit
    });
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log('Storage bucket already exists. No changes made.');
      } else {
        console.error('Error creating storage bucket:', error);
        process.exit(1);
      }
    } else {
      console.log('Storage bucket created successfully!', data);
    }

    // Verify bucket exists by listing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing storage buckets:', listError);
    } else {
      console.log('Available storage buckets:');
      buckets.forEach(bucket => {
        console.log(`- ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }
  } catch (error) {
    console.error('Failed to create storage bucket:', error);
    process.exit(1);
  }
}

createStorageBucket(); 