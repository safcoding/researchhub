'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db-connect';

export type Publication = {
  id?: number;
  pub_refno: string;
  status: string;
  type: string;
  category: string;
  journal: string;
  title: string;
  impact: number;
  date: string;
  level: string;
  author_id: number;
  research_alliance: string;
  rg_name: string;
};

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

  const addPublication = async (newPublication: Omit<Publication, 'id'>, file?: File) => {
    try {
      setError(null);
      const { data, error: insertError } = await supabase
        .from('publications')
        .insert([newPublication])
        .select()

      if (insertError) throw insertError;
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
        .update(updatedData)
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
    refreshPublications: fetchPublications
  };
}