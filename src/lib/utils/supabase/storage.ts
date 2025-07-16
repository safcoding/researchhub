import { createClient } from './server'

export async function uploadEventImage(file: File): Promise<string> {
  const supabase = await createClient()
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  
  // Upload to Supabase storage
  const { data, error } = await supabase.storage
    .from('event-pics')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }


  const { data: publicUrlData } = supabase.storage
    .from('event-pics')
    .getPublicUrl(data.path)

  return publicUrlData.publicUrl
}

export async function deleteEventImage(imageUrl: string): Promise<void> {
  const supabase = await createClient()
  
  // Extract filename from URL
  const fileName = imageUrl.split('/').pop()
  if (!fileName) return

  const { error } = await supabase.storage
    .from('event-pics')
    .remove([fileName])

  if (error) {
    console.error('Delete error:', error)
  }
}