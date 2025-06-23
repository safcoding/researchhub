'use client';

import { useState, useEffect } from 'react';
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

export function EventLogic() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching events from database...');
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
     if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      console.log(`Successfully fetched ${data?.length || 0} events`);
      setEvents(data || []);
    } catch (e) {
      console.error('Error in fetchEvents:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (newEvent: Partial<Event>) => {
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
      await fetchEvents();
      return data;
    } catch (e) {
      console.error('Error in addEvent:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

 const updateEvent = async (id: string, updatedData: Partial<Event>) => {
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
      await fetchEvents();
    } catch (e) {
      console.error('Error in updateEvent:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
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
      await fetchEvents();
    } catch (e) {
      console.error('Error in deleteEvent:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
const getEventById = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };

  const getEventsByStatus = (status: Event['status']): Event[] => {
    return events.filter(event => event.status === status);
  };

  const getUpcomingEvents = (): Event[] => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date >= today);
  };

  useEffect(() => {
    void fetchEvents();
  }, []);

  return {
    // State
    events,
    loading,
    error,
    
    // CRUD Operations
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: fetchEvents,
    
    // Business Logic Utilities
    getEventById,
    getEventsByStatus,
    getUpcomingEvents
  };
}

// Export helper types
export type CreateEventData = Partial<Event>;
export type UpdateEventData = Partial<Event>;