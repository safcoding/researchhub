import { supabase } from '@/lib/db-connect';

// Use the bucket name that you just created in Supabase dashboard
const DEFAULT_BUCKET = 'grants';

// This function will be used directly by components
export async function uploadFile(file: File): Promise<{datapath:string,status:string}> {
  try {
    console.log(`Attempting to upload file: ${file.name} to bucket: ${DEFAULT_BUCKET}`);
    
    // Create a unique filename
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name}`;
    
    // Directly try to upload the file
    const { data, error } = await supabase.storage
      .from(DEFAULT_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error('Upload failed:', error);
      throw new Error(`Error uploading file: ${error.message}`);
    }
    
    if (!data?.path) {
      throw new Error('Upload succeeded but no file path was returned');
    }
    
    console.log('File uploaded successfully:', data.path);
    return  {datapath :data.path, status:"Success"}; //return an object

  } catch (err) {
    console.error('Error in uploadFile:', err);
    throw err;
  }
}
