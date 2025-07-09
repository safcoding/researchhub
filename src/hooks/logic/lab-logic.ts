'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export type Lab = {
    LABID: string;
    LAB_NAME: string;
    LAB_HEAD: string;
    LAB_HEAD_EMAIL: string;
    RESEARCH_AREA?: string;
    LAB_DESCRIPTION: string;
    LOCATION: string;
    LAB_STATUS: string;
    LAB_TYPE: string;
    CONTACT_PHONE: string;
    EQUIPMENT_LIST?: string;
}

export interface LabFilters {
  searchText: string;
  labType: string;
}

export const LabLogic = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLabs = useCallback(async ({
    page = 1,
    itemsPerPage = 20, 
    filters = {}
  }: {
    page?: number;
    itemsPerPage?: number;
    filters?: Partial<LabFilters>;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      let query = supabase
        .from('labs')
        .select('*', { count: 'exact' })
        .order('LAB_NAME', { ascending: true });

      // Add search functionality
      if (filters.searchText) {
        query = query.or(
          `LAB_NAME.ilike.%${filters.searchText}%,LAB_HEAD.ilike.%${filters.searchText}%,RESEARCH_AREA.ilike.%${filters.searchText}%`
        );
      }

      // Add filtering
      if (filters.labType && filters.labType !== 'all') {
        query = query.eq('LAB_TYPE', filters.labType);
      }

      // Apply pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      setLabs(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching labs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

    const refreshLabs = fetchLabs;

    const addLab = useCallback(async (labData: Omit<Lab, 'LABID'>, currentFilters?: Partial<LabFilters>, currentPage?: number, currentItemsPerPage?: number) => {
        const supabase = createClient();
        const { data, error } = await supabase
        .from('labs')
        .insert([labData])
        .select();

        if (error) throw error;
        
        // Refresh the current page/filters after adding
        if (currentFilters !== undefined && currentPage !== undefined && currentItemsPerPage !== undefined) {
          await fetchLabs({ page: currentPage, itemsPerPage: currentItemsPerPage, filters: currentFilters });
        }
        
        return data?.[0];
    }, [fetchLabs]);

    const updateLab = useCallback(async (id: string, labData: Partial<Lab>, currentFilters?: Partial<LabFilters>, currentPage?: number, currentItemsPerPage?: number) => {
        const supabase = createClient();
        const { data, error } = await supabase
        .from('labs')
        .update(labData)
        .eq('LABID', id)
        .select();

        if (error) throw error;
        
        // Refresh the current page/filters after updating
        if (currentFilters !== undefined && currentPage !== undefined && currentItemsPerPage !== undefined) {
          await fetchLabs({ page: currentPage, itemsPerPage: currentItemsPerPage, filters: currentFilters });
        }
        
        return data?.[0];
    }, [fetchLabs]);

    const deleteLab = useCallback(async (id: string, currentFilters?: Partial<LabFilters>, currentPage?: number, currentItemsPerPage?: number) => {
        const supabase = createClient();
        const { error } = await supabase
        .from('labs')
        .delete()
        .eq('LABID', id);

        if (error) throw error;
        
        // Refresh the current page/filters after deleting
        if (currentFilters !== undefined && currentPage !== undefined && currentItemsPerPage !== undefined) {
          await fetchLabs({ page: currentPage, itemsPerPage: currentItemsPerPage, filters: currentFilters });
        }
    }, [fetchLabs]);

    useEffect(() => {
    }, []);

    return {
        labs,
        loading,
        error,
        totalCount,
        fetchLabs,
        addLab,
        updateLab,
        deleteLab,
        refetch: fetchLabs
    };
}