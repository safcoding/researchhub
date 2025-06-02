'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import { supabase } from '@/lib/db-connect';

type Event = {
  id?: number;
  title: string;
  date: string;
  location: string;
  time: string;
  registration_link: string;
  image_url?: string;
  details: string;
  category: string;
  deadline?: string;
};

const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Event>({
    title: '',
    date: '',
    location: '',
    time: '',
    registration_link: '',
    image_url: '',
    details: '',
    category: '',
    deadline: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fetch events
  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      location: '',
      time: '',
      registration_link: '',
      image_url: '',
      details: '',
      category: '',
      deadline: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('events')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        alert('Event updated successfully!');
      } else {
        const { error } = await supabase
          .from('events')
          .insert(formData);
        
        if (error) throw error;
        alert('Event created successfully!');
      }
      
      await fetchEvents();
      resetForm();
    } catch (error) {
      console.error('Error handling event:', error);
      alert('An error occurred while saving the event');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        alert('Event deleted successfully!');
        await fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('An error occurred while deleting the event');
      }
    }
  };

  const handleEdit = (event: Event) => {
    setFormData(event);
    setEditingId(event.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin: Manage Events</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="Event">Event</option>
              <option value="Available Grant">Available Grant</option>
            </select>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="p-2 border rounded"
              required
            />

            {formData.category === 'Event' ? (
              <>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
              </>
            ) : formData.category === 'Available Grant' ? (
              <input
                type="date"
                name="deadline"
                value={formData.deadline || ''}
                onChange={handleInputChange}
                placeholder="Application Deadline"
                className="p-2 border rounded"
                required
              />
            ) : null}

            <input
              type="url"
              name="registration_link"
              value={formData.registration_link}
              onChange={handleInputChange}
              placeholder={formData.category === 'Available Grant' ? 'Application Link' : 'Registration Link'}
              className="p-2 border rounded"
              required
            />

            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              placeholder="Details"
              className="p-2 border rounded col-span-2"
              rows={4}
              required
            />
          </div>

          <div className="mt-4 flex justify-between">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">All Events</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Category</th>
                  <th className="text-left px-4 py-2">Title</th>
                  <th className="text-left px-4 py-2">Date/Deadline</th>
                  <th className="text-left px-4 py-2">Location</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{event.category}</td>
                    <td className="px-4 py-2">{event.title}</td>
                    <td className="px-4 py-2">
                      {event.category === 'Available Grant' ? event.deadline : event.date}
                    </td>
                    <td className="px-4 py-2">
                      {event.category === 'Available Grant' ? 'N/A' : event.location}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id!)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventsPage;