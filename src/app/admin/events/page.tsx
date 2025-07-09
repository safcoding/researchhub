'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminSidebar } from "@/components/admin-sidebar/sidebar-content";
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { EventLogic, type Event, type EventFilters } from '@/hooks/logic/event-logic';
import { ConfirmationModal } from '@/components/reusable/confirmation-popup';
import { EventModal } from '@/components/admin-components/events/event-form';
import { EventsDataTable } from '@/components/admin-components/events/events-data-table';
import { EventFilters as EventFiltersComponent } from '@/components/admin-components/events/event-filters';
import { useDebouncedSearch } from '@/hooks/use-debounce';

export default function EventsAdminPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<EventFilters>({
    category: 'all',
    status: 'all',
    priority: 'all',
    dateFilter: 'all',
    searchText: '',
  });

  // Component filters for the filter component
  const [componentFilters, setComponentFilters] = useState({
    selectedCategory: 'all',
    dateFilter: 'all',
    selectedYear: 'all',
    selectedMonth: 'all',
  });

  // Debounced search
  const { searchValue, handleSearchChange } = useDebouncedSearch(
    (value: string) => {
      setFilters(prev => ({ ...prev, searchText: value }));
      setCurrentPage(1);
    },
    300
  );

  const {
    events,
    loading,
    error,
    totalCount,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents,
  } = EventLogic();

  useEffect(() => {
    refreshEvents({ page: currentPage, itemsPerPage, filters });
  }, [currentPage, itemsPerPage, filters, refreshEvents]);

  // Modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // CRUD handlers
  const handleAddEvent = async (newEvent: Partial<Event>) => {
    await addEvent(newEvent as Omit<Event, 'id'>, { page: currentPage, itemsPerPage, filters });
    setShowEventModal(false);
  };

  const handleUpdateEvent = async (updatedEvent: Partial<Event>) => {
    if (selectedEvent?.id) {
      await updateEvent(selectedEvent.id, updatedEvent, { page: currentPage, itemsPerPage, filters });
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedEvent?.id) {
      await deleteEvent(selectedEvent.id, { page: currentPage, itemsPerPage, filters });
      setShowDeleteModal(false);
      setSelectedEvent(null);
    }
  };

  // Filter change handler
  const handleFiltersChange = (updated: Partial<typeof componentFilters>) => {
    setComponentFilters(prev => ({ ...prev, ...updated }));
    
    // Convert component filters to event filters
    const eventFilters: Partial<EventFilters> = {};
    if (updated.selectedCategory) {
      eventFilters.category = updated.selectedCategory === 'all' ? undefined : updated.selectedCategory;
    }
    if (updated.dateFilter) {
      eventFilters.dateFilter = updated.dateFilter as EventFilters['dateFilter'];
    }
    if (updated.selectedYear) {
      eventFilters.year = updated.selectedYear === 'all' ? undefined : updated.selectedYear;
    }
    if (updated.selectedMonth) {
      eventFilters.month = updated.selectedMonth === 'all' ? undefined : updated.selectedMonth;
    }
    
    setFilters(prev => ({ ...prev, ...eventFilters }));
    setCurrentPage(1);
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
              <h1 className="text-3xl font-bold text-gray-800">Admin: Manage Events</h1>
              <Button
                onClick={() => {
                  setSelectedEvent(null);
                  setShowEventModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Event
              </Button>
            </div>

            <EventFiltersComponent
              filters={componentFilters}
              events={events}
              onFiltersChange={handleFiltersChange}
            />

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading events...</span>
              </div>
            ) : (
              <EventsDataTable
                data={events}
                onEdit={(event: Event) => {
                  setSelectedEvent(event);
                  setShowEventModal(true);
                }}
                onDelete={(event: Event) => {
                  setSelectedEvent(event);
                  setShowDeleteModal(true);
                }}
                totalCount={totalCount}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
              />
            )}

            {showEventModal && (
              <EventModal
                event={selectedEvent || undefined}
                onSave={selectedEvent ? handleUpdateEvent : handleAddEvent}
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
