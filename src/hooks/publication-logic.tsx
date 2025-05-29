'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db-connect';

export type Publication = {
  id: number;
  title: string;
  author: string;
  type: string;
  category: string;
  date: string;
  file_url?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function PublicationLogic() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      setPublications(data || []);
    } catch (e) {
      console.error('Error fetching publications:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

const uploadPDF = async (file: File, publicationId: number) => {
  try {
    setError(null);
    
    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 5MB limit');
    }
    if (!file.type.includes('pdf')) {
      throw new Error('Only PDF files are allowed');
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${publicationId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('publications')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('publications')
      .getPublicUrl(filePath);

    if (!data.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    // Update publication with file URL
    await updatePublication(publicationId, { file_url: data.publicUrl });
    
    return data.publicUrl;
  } catch (e) {
    console.error('Error uploading PDF:', e);
    setError(e instanceof Error ? e.message : 'Unknown error');
    throw e;
  }
};

  const addPublication = async (newPublication: Omit<Publication, 'id'>, file?: File) => {
    try {
      setError(null);
      const { data, error: insertError } = await supabase
        .from('publications')
        .insert([{
          title: newPublication.title,
          author: newPublication.author,
          type: newPublication.type,
          category: newPublication.category,
          date: newPublication.date,
          file_url: null // Initialize with null, will update after upload
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      if (file && data) {
        await uploadPDF(file, data.id);
      }

      await fetchPublications();
      return data;
    } catch (e) {
      console.error('Error adding publication:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    }
  };

  const updatePublication = async (id: number, updatedData: Partial<Publication>) => {
    try {
      setError(null);
      const { error: updateError } = await supabase
        .from('publications')
        .update({
          ...updatedData
        })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchPublications();
    } catch (e) {
      console.error('Error updating publication:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    }
  };

  const deletePublication = async (id: number) => {
    try {
      setError(null);
      // First, get the publication to check if it has a file
      const { data: pub } = await supabase
        .from('publications')
        .select('file_url')
        .eq('id', id)
        .single();

      if (pub?.file_url) {
        // Extract file path from URL
        const filePath = pub.file_url.split('/').pop();
        if (filePath) {
          // Delete file from storage
          const { error: storageError } = await supabase
            .storage
            .from('publications')
            .remove([`publications/${filePath}`]);

          if (storageError) throw storageError;
        }
      }

      // Then delete the publication record
      const { error: deleteError } = await supabase
        .from('publications')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchPublications();
    } catch (e) {
      console.error('Error deleting publication:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    }
  };

  useEffect(() => {
    void fetchPublications();
  }, []);

  return {
    publications,
    loading,
    error,
    addPublication,
    updatePublication,
    deletePublication,
    uploadPDF,
    refreshPublications: fetchPublications
  };
}