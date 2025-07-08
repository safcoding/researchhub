'use client';

import { useState, useEffect } from 'react';
import { EventLogic, type Event, type EventFilters } from '@/hooks/logic/event-logic';
import { EventModal } from '@/components/admin-components/events/event-form';
import { ConfirmationModal } from '@/components/reusable/confirmation-popup';
import { EventsDataTable } from '@/components/admin-components/events/events-data-table';
import { Button } from '@/components/ui/button';
import { EventFilters as EventFiltersComponent } from "@/components/admin-components/events/event-filters";
import { AdminSidebar } from "@/components/admin-sidebar/sidebar-content";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AnnouncementCRUDPage() {
  const { 
    events, 
    totalCount,
    loading,
    error, 
    fetchEvents,
    addEvent, 
    updateEvent, 
    deleteEvent,
    fetchAvailableYears 
  } = EventLogic();

  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<EventFilters>({
    category: 'all',
    status: 'all',
    priority: 'all',
    searchText: '',
    dateFilter: 'all',
    year: 'all',
    month: 'all',
  });
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Fetch available years on mount
  useEffect(() => {
    let isMounted = true;
    const getYears = async () => {
      const years = await fetchAvailableYears();
      if (!isMounted) return;
      setAvailableYears(years.map(String));
    };
    getYears();
    return () => { isMounted = false; };
  }, [fetchAvailableYears]);

  // Fetch events on filter/page change
  useEffect(() => {
    fetchEvents({ page: currentPage, itemsPerPage, filters });
  }, [currentPage, itemsPerPage, filters, fetchEvents]);

  // CRUD handlers with server-side refresh
  const handleAddEvent = async (newEvent: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    await addEvent(newEvent, { page: currentPage, itemsPerPage, filters });
    setShowEventModal(false);
  };

  const handleUpdateEvent = async (updatedEvent: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedEvent?.id) {
      await updateEvent(selectedEvent.id, updatedEvent, { page: currentPage, itemsPerPage, filters });
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
      await deleteEvent(selectedEvent.id, { page: currentPage, itemsPerPage, filters });
      setShowDeleteModal(false);
      setSelectedEvent(null);
    }
  };

  // Filter change handler
  const handleFiltersChange = (updated: Partial<{
    selectedCategory: string;
    dateFilter: string;
    selectedYear: string;
    selectedMonth: string;
  }>) => {
    const newFilters: EventFilters = {
      category: updated.selectedCategory !== 'all' ? updated.selectedCategory : undefined,
      searchText: filters.searchText,
      dateFilter: updated.dateFilter as any || 'all',
      year: updated.selectedYear !== 'all' ? updated.selectedYear : undefined,
      month: updated.selectedMonth !== 'all' ? updated.selectedMonth : undefined,
    };
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

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

            {/* Filters */}
            <EventFiltersComponent
              filters={{
                selectedCategory: filters.category || 'all',
                dateFilter: filters.dateFilter || 'all',
                selectedYear: filters.year || 'all',
                selectedMonth: filters.month || 'all',
              }}
              events={events}
              onFiltersChange={handleFiltersChange}
            />

            {/* Data Table */}
            <EventsDataTable
              data={events}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              totalCount={totalCount}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              searchValue={filters.searchText || ''}
              onSearchChange={(value) => setFilters(prev => ({ ...prev, searchText: value }))}
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