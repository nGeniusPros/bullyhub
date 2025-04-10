import { createClient } from '@/lib/supabase-browser';

/**
 * Upload a document to Supabase storage
 * @param file The file to upload
 * @param path The storage path (e.g., 'health-clearances')
 * @param fileName Optional custom file name
 * @returns The URL of the uploaded file
 */
export async function uploadDocument(
  file: File,
  path: string,
  fileName?: string
): Promise<string> {
  const supabase = createClient();
  
  // Generate a unique file name if not provided
  const uniqueFileName = fileName || `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  
  // Upload the file
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(`${path}/${uniqueFileName}`, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Error uploading document:', error);
    throw new Error(`Failed to upload document: ${error.message}`);
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(`${path}/${uniqueFileName}`);
  
  return publicUrl;
}

/**
 * Delete a document from Supabase storage
 * @param url The URL of the document to delete
 */
export async function deleteDocument(url: string): Promise<void> {
  const supabase = createClient();
  
  // Extract the path from the URL
  const urlObj = new URL(url);
  const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/documents\/(.+)/);
  
  if (!pathMatch || !pathMatch[1]) {
    throw new Error('Invalid document URL');
  }
  
  const path = pathMatch[1];
  
  // Delete the file
  const { error } = await supabase.storage
    .from('documents')
    .remove([path]);
  
  if (error) {
    console.error('Error deleting document:', error);
    throw new Error(`Failed to delete document: ${error.message}`);
  }
}

/**
 * Get a signed URL for a document (for temporary access)
 * @param path The path of the document
 * @param expiresIn Expiration time in seconds (default: 60 minutes)
 * @returns The signed URL
 */
export async function getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
  const supabase = createClient();
  
  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(path, expiresIn);
  
  if (error) {
    console.error('Error creating signed URL:', error);
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }
  
  return data.signedUrl;
}
