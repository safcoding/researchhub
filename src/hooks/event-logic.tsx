'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db-connect';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'Conference' | 'Workshop' | 'Seminar' | 'Grant' | 'Competition' | 'Networking';
  organizer: string;
  registration_required: boolean;
  registration_deadline?: string;
  contact_email: string;
  image: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Upcoming' | 'Registration Open' | 'Registration Closed' | 'Completed';
  created_at?: string;
  updated_at?: string;
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

  const addEvent = async (newEvent: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Adding new event:', newEvent);
      
      const { data, error: insertError } = await supabase
        .from('events')
        .insert([{
          ...newEvent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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

  const updateEvent = async (id: number, updatedData: Partial<Event>) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating event:', id, updatedData);
      
      const { error: updateError } = await supabase
        .from('events')
        .update({
          ...updatedData,
          updated_at: new Date().toISOString()
        })
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

  const deleteEvent = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting event:', id);
      
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

  useEffect(() => {
    void fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: fetchEvents
  };
}
