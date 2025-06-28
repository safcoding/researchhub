'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PUBLICATION_TYPES, PUBLICATION_CATEGORIES } from '@/constants/publication-options';

export type Publication = {
  id?: number;
  pub_refno: string;
  status: string;
  type: typeof PUBLICATION_TYPES[number];
  category: typeof PUBLICATION_CATEGORIES[number];
  journal: string;
  title: string;
  impact: number;
  date: string;
  level: string;
  author_name: string;
  author_id: number 
  research_alliance: string;
  rg_name: string;
};

export interface PublicationFilters {
  searchText?: string;
  category?: string;
  type?: string;
  year?: string;
  month?: string;
  dateFrom?: string;
  dateTo?: string; 
}

export function PublicationLogic() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublications = useCallback(
    async ({
      page = 1,
      itemsPerPage = 10,
      filters = {},
    }: {
      page?: number;
      itemsPerPage?: number;
      filters?: PublicationFilters;
    }) => {
      setLoading(true);
      setError(null);
      const supabase = createClient();

      let query = supabase
        .from('publications')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false });

      // Search by title or author_name
      if (filters.searchText && filters.searchText.trim() !== '') {
        query = query.or(
          `title.ilike.%${filters.searchText}%,author_name.ilike.%${filters.searchText}%`
        );
      }

      // Filter by category
      if (filters.category && filters.category !== 'all' && filters.category !== '') {
        query = query.eq('category', filters.category);
      }

      // Filter by type
      if (filters.type && filters.type !== 'all' && filters.type !== '') {
        if (filters.type === 'Others') {
          // Exclude all other types except 'Others'
          const excludedTypes = PUBLICATION_TYPES.filter(t => t !== 'Others');
          query = query.not('type', 'in', `(${excludedTypes.map(t => `'${t}'`).join(',')})`);
        } else {
          query = query.eq('type', filters.type);
        }
      }

      // Filter by year
      if (filters.year && filters.year !== 'all' && filters.year !== '') {
        query = query.gte('date', `${filters.year}-01-01`).lte('date', `${filters.year}-12-31`);
      }

      // Filter by month (must also have year)
      if (
        filters.month &&
        filters.month !== 'all' &&
        filters.month !== '' &&
        filters.year &&
        filters.year !== 'all' &&
        filters.year !== ''
      ) {
        // Pad month to 2 digits
        const month = filters.month.padStart(2, '0');
        query = query.gte('date', `${filters.year}-${month}-01`).lte('date', `${filters.year}-${month}-31`);
      }

      // Filter by date range
      if (filters.dateFrom && filters.dateTo) {
        query = query.gte('date', filters.dateFrom).lte('date', filters.dateTo);
      } else if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom);
      } else if (filters.dateTo) {
        query = query.lte('date', filters.dateTo);
      }

      // Pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      const { data, error, count } = await query.range(from, to);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setPublications(data || []);
      setTotalCount(count || 0);
      setLoading(false);
    },
    []
  );
  
const addPublication = async (
  newPublication: Omit<Publication, 'id'>,
  fetchArgs: { page?: number; itemsPerPage?: number; filters?: PublicationFilters }
) => {
  try {
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('publications')
      .insert([newPublication])
      .select();

    if (error) throw error;
    await fetchPublications(fetchArgs); // Pass current page/filters
    return data;
  } catch (e) {
    console.error('Error adding publication!', e);
    setError(e instanceof Error ? e.message : 'Unknown error');
    throw e;
  }
};

const updatePublication = async (
  id: number,
  updatedData: Partial<Publication>,
  fetchArgs: { page?: number; itemsPerPage?: number; filters?: PublicationFilters }
) => {
  try {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from('publications')
      .update(updatedData)
      .eq('id', id);

    if (error) throw error;
    await fetchPublications(fetchArgs);
  } catch (e) {
    console.error('Error updating publication!', e);
    setError(e instanceof Error ? e.message : 'Unknown error');
    throw e;
  }
};

const deletePublication = async (
  id: number,
  fetchArgs: { page?: number; itemsPerPage?: number; filters?: PublicationFilters }
) => {
  try {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchPublications(fetchArgs);
  } catch (e) {
    console.error('Error deleting publication!', e);
    setError(e instanceof Error ? e.message : 'Unknown error');
    throw e;
  }
};


  // Server-side aggregation for pie chart: counts by type, with filters
  const fetchPublicationTypeCounts = useCallback(
    async (filters: PublicationFilters = {}) => {
      const supabase = createClient();
      let query = supabase
        .from('publications')
        .select('type, count:id');

      // Filter by category
      if (filters.category && filters.category !== 'all' && filters.category !== '') {
        query = query.eq('category', filters.category);
      }
      // Filter by type (single type or 'OTHERS')
      if (filters.type && filters.type !== 'all' && filters.type !== '') {
        if (filters.type === 'Others') {
          // Exclude all canonical types except 'Others'
          const excludedTypes = PUBLICATION_TYPES.filter(t => t !== 'Others');
          query = query.not('type', 'in', `(${excludedTypes.map(t => `'${t}'`).join(',')})`);
        } else {
          query = query.eq('type', filters.type);
        }
      }
      // Filter by year
      if (filters.year && filters.year !== 'all' && filters.year !== '') {
        query = query.gte('date', `${filters.year}-01-01`).lte('date', `${filters.year}-12-31`);
      }
      // Filter by month (must also have year)
      if (
        filters.month &&
        filters.month !== 'all' &&
        filters.month !== '' &&
        filters.year &&
        filters.year !== 'all' &&
        filters.year !== ''
      ) {
        const month = filters.month.padStart(2, '0');
        query = query.gte('date', `${filters.year}-${month}-01`).lte('date', `${filters.year}-${month}-31`);
      }
      // Filter by author name (partial match)
      if (filters.searchText && filters.searchText.trim() !== '') {
        query = query.ilike('author_name', `%${filters.searchText}%`);
      }

      const { data, error } = await query;
      if (error) {
        setError(error.message);
        return [];
      }
      // Normalize types: group non-canonical types as 'Others' (capital O)
      const canonicalTypes = PUBLICATION_TYPES.map(t => t.toLowerCase());
      const typeCounts: Record<string, number> = {};
      (data || []).forEach((row: { type: string; count: number }) => {
        const rawType = row.type || 'Unknown';
        const type = rawType.toLowerCase();
        const normalizedType = canonicalTypes.includes(type)
          ? PUBLICATION_TYPES.find(t => t.toLowerCase() === type) || rawType
          : 'Others';
        typeCounts[normalizedType] = (typeCounts[normalizedType] || 0) + Number(row.count);
      });
      return Object.entries(typeCounts).map(([type, count]) => ({ name: type, value: count }));
    },
    []
  );

  return {
    publications,
    loading,
    error,
    totalCount,
    addPublication,
    updatePublication,
    deletePublication,
    refreshPublications: fetchPublications,
    fetchPublicationTypeCounts, // <-- new aggregate fetch
  };
}

