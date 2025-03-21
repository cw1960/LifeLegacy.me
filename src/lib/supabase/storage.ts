import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

/**
 * Storage buckets used in the application
 */
export const storageBuckets = {
  PROFILE_IMAGES: 'profile_images',
  DOCUMENTS: 'documents',
  DIGITAL_ASSETS: 'digital_assets',
  ORGANIZATION_LOGOS: 'organization_logos',
};

/**
 * Creates a signed URL for the given file path in the specified bucket
 * @param bucketName The storage bucket name
 * @param filePath The path to the file in the bucket
 * @param expiresIn Number of seconds until the signed URL expires (default: 3600 = 1 hour)
 * @returns A signed URL or null if there was an error
 */
export async function getSignedUrl(bucketName: string, filePath: string, expiresIn = 3600) {
  const supabase = createClientComponentClient<Database>();
  
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .createSignedUrl(filePath, expiresIn);
  
  if (error) {
    console.error(`Error getting signed URL for ${filePath}:`, error);
    return null;
  }
  
  return data.signedUrl;
}

/**
 * Uploads a file to the specified bucket
 * @param bucketName The storage bucket name
 * @param filePath The path where the file will be stored
 * @param file The file to upload
 * @param options Upload options (cacheControl, upsert, contentType)
 * @returns The upload result with path and error (if any)
 */
export async function uploadFile(
  bucketName: string, 
  filePath: string, 
  file: File,
  options?: { 
    cacheControl?: string;
    upsert?: boolean;
    contentType?: string;
  }
) {
  const supabase = createClientComponentClient<Database>();
  
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert || false,
      contentType: options?.contentType
    });
  
  return { data, error };
}

/**
 * Deletes a file from the specified bucket
 * @param bucketName The storage bucket name
 * @param filePath The path to the file to delete
 * @returns Success status and any error
 */
export async function deleteFile(bucketName: string, filePath: string) {
  const supabase = createClientComponentClient<Database>();
  
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .remove([filePath]);
  
  return { success: !error && !!data, error };
}

/**
 * Gets the public URL for a file (no authentication required)
 * @param bucketName The storage bucket name
 * @param filePath The path to the file
 * @returns The public URL for the file
 */
export function getPublicUrl(bucketName: string, filePath: string) {
  const supabase = createClientComponentClient<Database>();
  
  const { data } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}

/**
 * Lists all files in a bucket or folder
 * @param bucketName The storage bucket name
 * @param folderPath Optional folder path to list contents of
 * @returns Array of files or null if there was an error
 */
export async function listFiles(bucketName: string, folderPath?: string) {
  const supabase = createClientComponentClient<Database>();
  
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .list(folderPath || '');
  
  if (error) {
    console.error(`Error listing files in ${bucketName}/${folderPath || ''}:`, error);
    return null;
  }
  
  return data;
} 