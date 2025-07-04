'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

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
  author_name: string;//added this
  author_id: number 
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
      const supabase = createClient();
      const { data, error } = await supabase
        .from('publications')
        .select('*') //changed back 
        .order('date', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (e) {
      console.error('Error fetching publications!', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  const addPublication = async (newPublication: Omit<Publication, 'id'>) => {
    try {
      setError(null);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('publications')
        .insert([newPublication])
        .select();

      if (error) throw error;
      await fetchPublications();
      return data;
    } catch (e) {
      console.error('Error adding publication!', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    }
  };
  const updatePublication = async (id: number, updatedData: Partial<Publication>) => {
    try {
      setError(null);
      const supabase = createClient();
      const { error } = await supabase
        .from('publications')
        .update(updatedData)
        .eq('id', id);

      if (error) throw error;
      await fetchPublications();
    } catch (e) {
      console.error('Error updating publication!', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    }
  };
  const deletePublication = async (id: number) => {
    try {
      setError(null);
      const supabase = createClient();
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPublications();
    } catch (e) {
      console.error('Error deleting publication!', e);
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
    refreshPublications: fetchPublications,
  };
}

