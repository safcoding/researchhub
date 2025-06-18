// Test script for CRUD operations
import { supabase } from '@/lib/db-connect';

// Test function to verify Supabase connection and API key
export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Try to get a row count from the grants table to test connection
    const { count, error } = await supabase
      .from('grant')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log(`Connection successful! Found ${count} grants in the database.`);
    return { success: true, count };
  } catch (err) {
    console.error('Error during connection test:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Test function to verify file uploads to Supabase Storage
export async function testStorageConnection() {
  console.log('Testing Supabase Storage connection...');
  
  try {
    // Try to list buckets
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Storage connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log(`Storage connection successful! Found ${data.length} buckets.`);
    console.log('Bucket names:', data.map(bucket => bucket.name).join(', '));
    return { success: true, buckets: data };
  } catch (err) {
    console.error('Error during storage connection test:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Run the tests if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('CRUD testing script loaded. Call testSupabaseConnection() or testStorageConnection() to run tests.');
}
