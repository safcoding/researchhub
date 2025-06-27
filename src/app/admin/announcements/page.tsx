'use client';

import { useState } from 'react';
import { EventLogic, type Event } from '@/hooks/logic/event-logic';
import { EventModal } from '@/components/admin-components/events/event-form';
import { ConfirmationModal } from '@/components/reusable/confirmation-popup';
import { EventsDataTable } from '@/components/admin-components/events/events-data-table';
import { Button } from '@/components/ui/button';
import { EventFilters } from "@/components/admin-components/events/event-filters";
import { AdminSidebar } from "@/components/admin-sidebar/sidebar-content";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AnnouncementCRUDPage() {
  const { events, error, addEvent, updateEvent, deleteEvent } = EventLogic();
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past' | 'thisMonth' | 'nextMonth'>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

    //State Management
  const handleAddEvent = async (newEvent: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    await addEvent(newEvent);
    setShowEventModal(false);
  };
  const handleUpdateEvent = async (updatedEvent: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedEvent?.id) {
      await updateEvent(selectedEvent.id, updatedEvent);
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };
  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
    if (selectedEvent?.id) {
      await deleteEvent(selectedEvent.id);
      setShowDeleteModal(false);
      setSelectedEvent(null);
    }
  };

  // Filtering logic
  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;


    const eventDate = new Date(event.date);
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    let matchesDate = true;
    switch (dateFilter) {
      case 'upcoming':
        matchesDate = eventDate >= today;
        break;
      case 'past':
        matchesDate = eventDate < today;
        break;
      case 'thisMonth':
        matchesDate = eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
        break;
      case 'nextMonth':
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        matchesDate = eventDate.getMonth() === nextMonth && eventDate.getFullYear() === nextMonthYear;
        break;
      default:
        matchesDate = true;
    }

    const matchesYear = selectedYear === 'all' || eventDate.getFullYear().toString() === selectedYear;
    const matchesMonth = selectedMonth === 'all' || eventDate.getMonth().toString() === selectedMonth;
    return matchesCategory && matchesDate && matchesYear && matchesMonth;
  });

  return (
    <SidebarProvider style={{ "--sidebar-width": "19rem" } as React.CSSProperties}>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </header>

        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Admin: Manage Announcements</h1>
              <Button
                onClick={() => {
                  setSelectedEvent(null);
                  setShowEventModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Announcement
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                Error: {error}
              </div>
            )}

            <EventFilters
              filters={{
                selectedCategory,
                dateFilter,
                selectedYear,
                selectedMonth,
              }}
              events={events}
              onFiltersChange={updated => {
                if (updated.selectedCategory !== undefined) setSelectedCategory(updated.selectedCategory);
                if (updated.dateFilter !== undefined) setDateFilter(updated.dateFilter as typeof dateFilter);
                if (updated.selectedYear !== undefined) setSelectedYear(updated.selectedYear);
                if (updated.selectedMonth !== undefined) setSelectedMonth(updated.selectedMonth);
              }}
            />

            <EventsDataTable
              data={filteredEvents}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />

            {/* Modals */}
            {showEventModal && (
              <EventModal
                event={selectedEvent ?? undefined}
                onSave={selectedEvent
                  ? (data) => handleUpdateEvent(data as Omit<Event, 'id' | 'created_at' | 'updated_at'>)
                  : (data) => handleAddEvent(data as Omit<Event, 'id' | 'created_at' | 'updated_at'>)
                }
                onClose={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
              />
            )}

            {showDeleteModal && selectedEvent && (
              <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Event"
                message={`Are you sure you want to delete "${selectedEvent.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                  setShowDeleteModal(false);
                  setSelectedEvent(null);
                }}
              />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}