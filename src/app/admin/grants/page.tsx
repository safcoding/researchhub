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
import { GrantLogic, type Grant, type GrantFilters } from '@/hooks/logic/grant-logic';
import { ConfirmationModal } from '@/components/reusable/confirmation-popup';
import { GrantModal } from '@/components/admin-components/grants/grant-form';
import { GrantDataTable } from '@/components/admin-components/grants/grant-data-table';
import { GrantFilters as GrantFiltersComponent } from '@/components/admin-components/grants/grant-filters';
import { useDebouncedSearch } from '@/hooks/use-debounce';

export default function GrantDBPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<GrantFilters>({
    year: 'all',
    month: 'all',
    status: 'all',
    grantType: 'all',
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
    grants,
    loading,
    error,
    totalCount,
    addGrant,
    updateGrant,
    deleteGrant,
    refreshGrants,
  } = GrantLogic();

  useEffect(() => {
    refreshGrants({ page: currentPage, itemsPerPage, filters });
  }, [currentPage, itemsPerPage, filters, refreshGrants]);

  // Modal state
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);

  // CRUD handlers
  const handleAddGrant = async (newGrant: Partial<Grant>) => {
    await addGrant(newGrant as Omit<Grant, 'grant_id'>, { page: currentPage, itemsPerPage, filters });
    setShowGrantModal(false);
  };

  const handleUpdateGrant = async (updatedGrant: Partial<Grant>) => {
    if (selectedGrant?.PROJECTID) {
      await updateGrant(selectedGrant.PROJECTID, updatedGrant, { page: currentPage, itemsPerPage, filters });
      setShowGrantModal(false);
      setSelectedGrant(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedGrant?.PROJECTID) {
      await deleteGrant(selectedGrant.PROJECTID, { page: currentPage, itemsPerPage, filters });
      setShowDeleteModal(false);
      setSelectedGrant(null);
    }
  };

  const handleEditClick = (grant: Grant) => {
    setSelectedGrant(grant);
    setShowGrantModal(true);
  };

  const handleDeleteClick = (grant: Grant) => {
    setSelectedGrant(grant);
    setShowDeleteModal(true);
  };

  // Filter change handler
  const handleFiltersChange = (updated: Partial<GrantFilters>) => {
    setFilters(prev => ({ ...prev, ...updated }));
    setCurrentPage(1); // Reset to first page on filter change
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
              <h1 className="text-3xl font-bold text-gray-800">Admin: Manage Grants</h1>
              <Button
                onClick={() => {
                  setSelectedGrant(null);
                  setShowGrantModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Grant
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                Error: {error}
              </div>
            )}
            
            <GrantFiltersComponent
              filters={filters}
              grants={grants}
              onFiltersChange={handleFiltersChange}
            />

            <GrantDataTable
              data={grants}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              totalCount={totalCount}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              searchValue={filters.searchText || ''}
              onSearchChange={handleSearchChange}
            />

            {/* Modals */}
            {showGrantModal && (
              <GrantModal
                grant={selectedGrant ?? undefined}
                onSave={selectedGrant ? handleUpdateGrant : handleAddGrant}
                onClose={() => {
                  setShowGrantModal(false);
                  setSelectedGrant(null);
                }}
              />
            )}

            {showDeleteModal && selectedGrant && (
              <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Grant"
                message={`Are you sure you want to delete "${selectedGrant?.PROJECT_TITLE}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                  setShowDeleteModal(false);
                  setSelectedGrant(null);
                }}
              />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}