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
import { PublicationLogic, type Publication, type PublicationFilters } from '@/hooks/logic/publication-logic';
import { ConfirmationModal } from '@/components/reusable/confirmation-popup';
import { PublicationModal } from '@/components/admin-components/publications/publication-form';
import { PublicationDataTable } from '@/components/admin-components/publications/publication-data-table';
import { PublicationFilters as PublicationFiltersComponent } from '@/components/admin-components/publications/publication-filters';
import { PUBLICATION_TYPES, PUBLICATION_CATEGORIES } from '@/constants/publication-options';
import { useDebouncedSearch } from '@/hooks/use-debounce';

export default function PublicationCRUDPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<PublicationFilters>({
    year: 'all',
    month: 'all',
    category: 'all', 
    type: 'all',    
    searchText: '',
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
    publications,
    loading,
    error,
    totalCount,
    addPublication,
    updatePublication,
    deletePublication,
    refreshPublications,
  } = PublicationLogic();

  useEffect(() => {
    refreshPublications({ page: currentPage, itemsPerPage, filters });
  }, [currentPage, itemsPerPage, filters, refreshPublications]);

  // Modal state
  const [showPublicationModal, setShowPublicationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);

  // CRUD handlers
  const handleAddPublication = async (newPublication: Partial<Publication>) => {
    await addPublication(newPublication as Omit<Publication, 'id'>, { page: currentPage, itemsPerPage, filters });
    setShowPublicationModal(false);
  };

  const handleUpdatePublication = async (updatedPublication: Partial<Publication>) => {
    if (selectedPublication?.id) {
      await updatePublication(selectedPublication.id, updatedPublication, { page: currentPage, itemsPerPage, filters });
      setShowPublicationModal(false);
      setSelectedPublication(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedPublication?.id) {
      await deletePublication(selectedPublication.id, { page: currentPage, itemsPerPage, filters });
      setShowDeleteModal(false);
      setSelectedPublication(null);
    }
  };

  // Filter change handler
  const handleFiltersChange = (updated: Partial<PublicationFilters>) => {
    // Handle search text with debounced search
    if (updated.searchText !== undefined) {
      handleSearchChange(updated.searchText);
    } else {
      // For other filters, update directly
      setFilters(prev => ({ ...prev, ...updated }));
      setCurrentPage(1); // Reset to first page on filter change
    }
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
              <h1 className="text-3xl font-bold text-gray-800">Admin: Manage Publications</h1>
              <Button
                onClick={() => {
                  setSelectedPublication(null);
                  setShowPublicationModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Publication
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                Error: {error}
              </div>
            )}

            <PublicationFiltersComponent
              filters={{
                category: (filters.category ?? '') as typeof PUBLICATION_CATEGORIES[number] | 'all',
                type: (filters.type ?? '') as typeof PUBLICATION_TYPES[number] | 'all',
                year: filters.year ?? '',
                month: filters.month ?? '',
                searchText: searchValue, // Use debounced search value for display
                dateFrom: filters.dateFrom ?? '',
                dateTo: filters.dateTo ?? '',
              }}
              publicationTypes={PUBLICATION_TYPES}
              publicationCategories={PUBLICATION_CATEGORIES}
              onFiltersChange={handleFiltersChange}
            />

            <PublicationDataTable
              data={publications}
              onEdit={pub => {
                setSelectedPublication(pub);
                setShowPublicationModal(true);
              }}
              onDelete={pub => {
                setSelectedPublication(pub);
                setShowDeleteModal(true);
              }}
              totalCount={totalCount}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              searchValue={searchValue} // Use debounced search value for display
              onSearchChange={handleSearchChange} // Use debounced search handler
            />

            {/* Modals */}
            {showPublicationModal && (
              <PublicationModal
                publication={selectedPublication ?? undefined}
                onSave={selectedPublication ? handleUpdatePublication : handleAddPublication}
                onClose={() => {
                  setShowPublicationModal(false);
                  setSelectedPublication(null);
                }}
              />
            )}

            {showDeleteModal && selectedPublication && (
              <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Publication"
                message={`Are you sure you want to delete "${selectedPublication?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                  setShowDeleteModal(false);
                  setSelectedPublication(null);
                }}
              />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}