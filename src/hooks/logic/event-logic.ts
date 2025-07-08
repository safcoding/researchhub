'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface Event {
  id: string;                 
  title: string;
  description: string;
  date: string;
  time?: string;              
  location?: string;          
  category: 'Conference' | 'Workshop' | 'Seminar' | 'Grant' | 'Competition' | 'Networking' | 'Others';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Upcoming' | 'Registration Open' | 'Registration Closed' | 'Completed';
  organizer?: string;        
  registration_required: boolean;
  registration_deadline?: string;
  contact_email?: string;        
  image?: string;             
}

export interface EventFilters {
  category?: string;
  status?: string;
  priority?: string;
  searchText?: string;
  dateFrom?: string;
  dateTo?: string;
  dateFilter?: 'all' | 'upcoming' | 'past' | 'thisMonth' | 'nextMonth';
  year?: string;
  month?: string;
}

export function EventLogic() {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Server-side pagination, filtering, searching
  const fetchEvents = useCallback(async ({
    page = 1,
    itemsPerPage = 10,
    filters = {},
  }: {
    page?: number;
    itemsPerPage?: number;
    filters?: EventFilters;
  } = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching events from database with filters:', filters);
      
      const supabase = createClient();
      let query = supabase
        .from('events')
        .select('*', { count: 'exact' })
        .order('date', { ascending: true });

      // Search by title, description, or organizer
      if (filters.searchText && filters.searchText.trim() !== '') {
        query = query.or(
          `title.ilike.%${filters.searchText}%,description.ilike.%${filters.searchText}%,organizer.ilike.%${filters.searchText}%`
        );
      }

      // Filter by category
      if (filters.category && filters.category !== 'all' && filters.category !== '') {
        query = query.eq('category', filters.category);
      }

      // Filter by status
      if (filters.status && filters.status !== 'all' && filters.status !== '') {
        query = query.eq('status', filters.status);
      }

      // Filter by priority
      if (filters.priority && filters.priority !== 'all' && filters.priority !== '') {
        query = query.eq('priority', filters.priority);
      }

      // Date filters
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      if (filters.dateFilter) {
        switch (filters.dateFilter) {
          case 'upcoming':
            query = query.gte('date', today.toISOString().split('T')[0]);
            break;
          case 'past':
            query = query.lt('date', today.toISOString().split('T')[0]);
            break;
          case 'thisMonth':
            const thisMonthStart = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
            const thisMonthEnd = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
            query = query.gte('date', thisMonthStart).lte('date', thisMonthEnd);
            break;
          case 'nextMonth':
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
            const nextMonthStart = new Date(nextMonthYear, nextMonth, 1).toISOString().split('T')[0];
            const nextMonthEnd = new Date(nextMonthYear, nextMonth + 1, 0).toISOString().split('T')[0];
            query = query.gte('date', nextMonthStart).lte('date', nextMonthEnd);
            break;
        }
      }

      // Filter by specific year
      if (filters.year && filters.year !== 'all' && filters.year !== '') {
        query = query.gte('date', `${filters.year}-01-01`).lte('date', `${filters.year}-12-31`);
      }

      // Filter by specific month (requires year to be set)
      if (filters.month && filters.month !== 'all' && filters.month !== '' && filters.year && filters.year !== 'all') {
        const monthStart = new Date(Number(filters.year), Number(filters.month), 1).toISOString().split('T')[0];
        const monthEnd = new Date(Number(filters.year), Number(filters.month) + 1, 0).toISOString().split('T')[0];
        query = query.gte('date', monthStart).lte('date', monthEnd);
      }

      // Custom date range
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
        console.error('Error fetching events:', error);
        throw error;
      }

      console.log(`Successfully fetched ${data?.length || 0} events (${count} total)`);
      setEvents(data || []);
      setTotalCount(count || 0);
    } catch (e) {
      console.error('Error in fetchEvents:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = async (newEvent: Partial<Event>, fetchArgs: { page?: number; itemsPerPage?: number; filters?: EventFilters } = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Adding new event:', newEvent);
      
      const supabase = createClient();
      const { data, error: insertError } = await supabase
        .from('events')
        .insert([{
          ...newEvent,
          registration_required: newEvent.registration_required ?? false,
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error adding event:', insertError);
        throw insertError;
      }

      console.log('Event added successfully:', data);
      await fetchEvents(fetchArgs);
      
      return data;

    } catch (e) {
      console.error('Error in addEvent:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

 const updateEvent = async (id: string, updatedData: Partial<Event>, fetchArgs: { page?: number; itemsPerPage?: number; filters?: EventFilters } = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating event:', id, updatedData);
      
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('events')
        .update(updatedData)
        .eq('id', id);

      if (updateError) {
        console.error('Error updating event:', updateError);
        throw updateError;
      }

      console.log('Event updated successfully');
      await fetchEvents(fetchArgs);
    } catch (e) {
      console.error('Error in updateEvent:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string, fetchArgs: { page?: number; itemsPerPage?: number; filters?: EventFilters } = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting event:', id);
      
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting event:', deleteError);
        throw deleteError;
      }

      console.log('Event deleted successfully');
      await fetchEvents(fetchArgs);
    } catch (e) {
      console.error('Error in deleteEvent:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Optimized method for homepage - get next few upcoming events
  const getUpcomingEventsForHomepage = useCallback(async (limit: number = 3) => {
    try {
      const supabase = createClient();
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error('Error fetching upcoming events for homepage:', e);
      return [];
    }
  }, []);

  // Get available years for filter dropdown
  const fetchAvailableYears = useCallback(async (): Promise<number[]> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('events')
        .select('date')
        .order('date', { ascending: false })
        .limit(1000); // Should cover all events

      if (error) return [];

      const years = data
        ?.map(event => new Date(event.date).getFullYear())
        .filter((year, index, arr) => arr.indexOf(year) === index) // unique years
        .sort((a, b) => b - a) || [];

      return years;
    } catch (e) {
      console.error('Error fetching available years:', e);
      return [];
    }
  }, []);
  
const getEventById = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };

  const getEventsByStatus = (status: Event['status']): Event[] => {
    return events.filter(event => event.status === status);
  };

  // Legacy method for backward compatibility (deprecated)
  const getUpcomingEvents = (): Event[] => {
    console.warn('getUpcomingEvents is deprecated. Use getUpcomingEventsForHomepage instead.');
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date >= today);
  };

  // Remove auto-fetch - let parent components control when to fetch

  return {
    // State
    events,
    totalCount,
    loading,
    error,
    
    // CRUD Operations
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: fetchEvents, // Alias for consistency
    
    // Optimized fetching methods
    getUpcomingEventsForHomepage,
    fetchAvailableYears,
    
    // Business Logic Utilities (deprecated - work with current loaded data only)
    getEventById,
    getEventsByStatus,
    getUpcomingEvents
  };
}

// Export helper types
export type CreateEventData = Partial<Event>;
export type UpdateEventData = Partial<Event>;