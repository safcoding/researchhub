import { supabase } from '@/lib/db-connect';

export async function initializeStorage() {
  try {
    console.log('Initializing storage...');
    
    // First check if we can even access Supabase
    const { data: projectData, error: projectError } = await supabase.rpc('get_project_details');
    
    if (projectError) {
      console.error('Cannot connect to Supabase:', projectError.message);
      console.log('Falling back to direct bucket creation...');
      
      // Try direct bucket creation as a fallback
      try {
        console.log('Attempting to create grants bucket directly...');
        
        const { error: createError } = await supabase.storage.createBucket('grants', {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (createError) {
          if (createError.message.includes('already exists')) {
            console.log('Bucket already exists, continuing...');
            return true;
          }
          throw createError;
        }
        
        console.log('Grants bucket created successfully!');
        return true;
      } catch (directError) {
        console.error('Failed to create bucket directly:', directError);
        return false;
      }
    }
    
    console.log('Connected to Supabase project:', projectData);
    
    // Check if the bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking storage buckets:', error.message);
      return false;
    }
    
    console.log('Available buckets:', buckets?.map(b => b.name) || []);
    
    // If grants bucket doesn't exist, create it
    const grantsBucket = buckets?.find(bucket => bucket.name === 'grants');
    
    if (!grantsBucket) {
      console.log('Creating grants storage bucket...');
      const { error: createError } = await supabase.storage.createBucket('grants', {
        public: true,
        fileSizeLimit: 10485760 // 10MB limit
      });
      
      if (createError) {
        console.error('Error creating grants bucket:', createError.message);
        return false;
      }
      
      console.log('Grants bucket created successfully');
    } else {
      console.log('Grants bucket already exists');
      
      // Make sure the bucket is public
      try {
        const { error: updateError } = await supabase.storage.updateBucket('grants', {
          public: true
        });
        
        if (updateError) {
          console.error('Error updating bucket visibility:', updateError.message);
        } else {
          console.log('Bucket visibility updated to public');
        }
      } catch (updateError) {
        console.error('Error during bucket update:', updateError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Storage initialization failed:', error);
    return false;
  }
}
