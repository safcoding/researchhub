'use client';

import { useState, useCallback } from 'react';
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

export interface PublicationStats {
  monthly: number;
  quarterly: number;
  yearly: number;
}

export interface TimelineData {
  month: string;
  publications: number;
}

export interface TypeData {
  name: string;
  value: number;
  percentage: number;
  count: number;
}

export function PublicationLogic() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [analyticsData, setAnalyticsData] = useState<{
    years: { date: string }[];
    types: { type: string; category: string }[];
  }>({ years: [], types: [] });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dashboard analytics function - uses aggregated queries for efficiency
  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      // Get total count efficiently without fetching all data
      const { count: totalPublications, error: countError } = await supabase
        .from('publications')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      
      console.log(`📊 Total publications in database: ${totalPublications}`);
      setTotalCount(totalPublications || 0);
      
      // For analytics functions, fetch minimal data efficiently
      console.log('📊 Fetching year data for timeline analytics...');
      const { data: yearData, error: yearError } = await supabase
        .from('publications')
        .select('date')
        .order('date', { ascending: false })
        .limit(50000); // Override default 1000 limit

      if (yearError) throw yearError;
      
      console.log('📊 Fetching type/category data for chart analytics...');
      const { data: typeData, error: typeError } = await supabase
        .from('publications')
        .select('type, category')
        .order('date', { ascending: false })
        .limit(50000); // Override default 1000 limit

      if (typeError) throw typeError;
      
      console.log(`📊 Analytics data: ${yearData?.length} year records, ${typeData?.length} type/category records`);
      
      // Store analytics data separately from paginated publications
      setAnalyticsData({
        years: yearData || [],
        types: typeData || []
      });
      
      setAnalyticsLoaded(true);
      console.log(`✅ Analytics data loaded successfully`);
      
    } catch (e) {
      console.error('Error fetching dashboard stats:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Analytics functions that work with the analyticsData
  const getPublicationStats = (): PublicationStats => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentQuarter = Math.floor(currentMonth / 3);

    const monthly = analyticsData.years
      .filter(pub => {
        const pubDate = new Date(pub.date);
        return pubDate.getMonth() === currentMonth && 
               pubDate.getFullYear() === currentYear;
      }).length;

    const quarterly = analyticsData.years
      .filter(pub => {
        const pubDate = new Date(pub.date);
        const pubQuarter = Math.floor(pubDate.getMonth() / 3);
        return pubQuarter === currentQuarter && 
               pubDate.getFullYear() === currentYear;
      }).length;

    const yearly = analyticsData.years
      .filter(pub => {
        const pubDate = new Date(pub.date);
        return pubDate.getFullYear() === currentYear;
      }).length;

    return { monthly, quarterly, yearly };
  };

  const getTimelineData = (): TimelineData[] => {
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Create monthly data for current year
    const monthlyAmounts: number[] = new Array(12).fill(0);
    
    // Aggregate publications by month for current year only using analyticsData
    analyticsData.years.forEach(pub => {
      const date = new Date(pub.date);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11
      
      if (year === currentYear && month >= 0 && month < 12) {
        monthlyAmounts[month] = (monthlyAmounts[month] || 0) + 1;
      }
    });

    // Convert to cumulative timeline
    let cumulative = 0;
    return months.map((month, index) => {
      cumulative += monthlyAmounts[index] || 0;
      return {
        month,
        publications: cumulative
      };
    });
  };

  const getPublicationTypeData = (): TypeData[] => {
    const typeCounts: Record<string, number> = {};
    
    analyticsData.types.forEach(pub => {
      const type = pub.type || 'Unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const total = analyticsData.types.length;
    return Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      count
    }));
  };

  const getCategoryCounts = (): TypeData[] => {
    const categoryCounts: Record<string, number> = {};
    
    analyticsData.types.forEach(pub => {
      const category = pub.category || 'Unknown';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const total = analyticsData.types.length;
    return Object.entries(categoryCounts).map(([category, count]) => ({
      name: category,
      value: count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      count
    }));
  };

  const getTotalPublications = (): number => {
    return totalCount; // Use the efficient count from the database
  };

  // Original functions for pagination and admin (keep for backward compatibility)
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
      await fetchPublications(fetchArgs);
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
      const { data, error } = await supabase
        .from('publications')
        .update(updatedData)
        .eq('id', id)
        .select();

      if (error) throw error;
      await fetchPublications(fetchArgs);
      return data;
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

  const fetchPublicationTypeCounts = useCallback(
    async (filters: PublicationFilters = {}): Promise<Array<{ name: string; value: number }>> => {
      const supabase = createClient();

      let query = supabase
        .from('publications')
        .select('type');

      // Apply same filters as main query for consistency
      if (filters.searchText && filters.searchText.trim() !== '') {
        query = query.or(
          `title.ilike.%${filters.searchText}%,author_name.ilike.%${filters.searchText}%`
        );
      }

      if (filters.category && filters.category !== 'all' && filters.category !== '') {
        query = query.eq('category', filters.category);
      }

      if (filters.type && filters.type !== 'all' && filters.type !== '') {
        if (filters.type === 'Others') {
          const excludedTypes = PUBLICATION_TYPES.filter(t => t !== 'Others');
          query = query.not('type', 'in', `(${excludedTypes.map(t => `'${t}'`).join(',')})`);
        } else {
          query = query.eq('type', filters.type);
        }
      }

      if (filters.year && filters.year !== 'all' && filters.year !== '') {
        query = query.gte('date', `${filters.year}-01-01`).lte('date', `${filters.year}-12-31`);
      }

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

      const { data, error } = await query;
      if (error) {
        setError(error.message);
        return [];
      }

      // Count types manually from the data
      const canonicalTypes = PUBLICATION_TYPES.map(t => t.toLowerCase());
      const typeCounts: Record<string, number> = {};
      
      (data || []).forEach((row: { type: string }) => {
        const rawType = row.type || 'Unknown';
        const type = rawType.toLowerCase();
        const normalizedType = canonicalTypes.includes(type)
          ? PUBLICATION_TYPES.find(t => t.toLowerCase() === type) || rawType
          : 'Others';
        typeCounts[normalizedType] = (typeCounts[normalizedType] || 0) + 1;
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
    analyticsLoaded,
    // Admin functions
    addPublication,
    updatePublication,
    deletePublication,
    refreshPublications: fetchPublications,
    fetchPublicationTypeCounts,
    // Dashboard analytics functions
    fetchDashboardStats,
    getPublicationStats,
    getPublicationTypeData,
    getCategoryCounts,
    getTimelineData,
    getTotalPublications
  };
}

