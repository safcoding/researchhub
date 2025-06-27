'use client';

import React, { useState } from 'react';
import { AdminSidebar } from "@/components/admin-sidebar/sidebar-content"
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { PublicationLogic, type Publication } from '@/hooks/logic/publication-logic';
import { ConfirmationModal } from '@/components/reusable/confirmation-popup';
import { PublicationModal } from '@/components/admin-components/publications/publication-form';
import { PublicationDataTable } from '@/components/admin-components/publications/publication-data-table';
import { PublicationFilters } from '@/components/admin-components/publications/publication-filters';

export default function PublicationCRUDPage() {
  const { publications, loading, error, addPublication, updatePublication, deletePublication } = PublicationLogic();
  const [showPublicationModal, setShowPublicationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past' | 'thisMonth' | 'nextMonth'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');


  //State Management
  const handleUpdatePublication = async (updatedPublication: Partial<Publication>) => {
    if (selectedPublication?.id) {
      await updatePublication(selectedPublication.id, updatedPublication);
      setShowPublicationModal(false);
      setSelectedPublication(null);
    }
  };

  const handleAddPublication = async (newPublication: Partial<Publication>) => {
    await addPublication(newPublication as Omit<Publication, 'id'>);
    setShowPublicationModal(false);
  };

  const handleEditClick = (publication: Publication) => {
    setSelectedPublication(publication);
    setShowPublicationModal(true);
  };

  const handleDeleteClick = (publication: Publication) => {
    setSelectedPublication(publication);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPublication?.id) {
      await deletePublication(selectedPublication.id);
      setShowDeleteModal(false);
      setSelectedPublication(null);
    }
  };

  // Filtering logic
  const filteredPublications = publications.filter(publication => {
    const publicationDate = new Date(publication.date);
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let matchesDate = true;
    switch (dateFilter) {
      case 'upcoming':
        matchesDate = publicationDate >= today;
        break;
      case 'past':
        matchesDate = publicationDate < today;
        break;
      case 'thisMonth':
        matchesDate = publicationDate.getMonth() === currentMonth && publicationDate.getFullYear() === currentYear;
        break;
      case 'nextMonth':
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        matchesDate = publicationDate.getMonth() === nextMonth && publicationDate.getFullYear() === nextMonthYear;
        break;
      default:
        matchesDate = true;
    }
    const matchesYear = selectedYear === 'all' || publicationDate.getFullYear().toString() === selectedYear;
    const matchesMonth = selectedMonth === 'all' || publicationDate.getMonth().toString() === selectedMonth;
    const matchesStatus = selectedStatus === 'all' || publication.status === selectedStatus;
    return matchesDate && matchesYear && matchesMonth && matchesStatus;
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
            
            <PublicationFilters
              filters={{
                dateFilter,
                selectedYear,
                selectedMonth,
                selectedStatus,
              }}
              publications={publications}
              onFiltersChange={(updated: { selectedYear?: string; selectedMonth?: string; selectedStatus?: string }) => {
                if (updated.selectedYear !== undefined) setSelectedYear(updated.selectedYear);
                if (updated.selectedMonth !== undefined) setSelectedMonth(updated.selectedMonth);
                if (updated.selectedStatus !== undefined) setSelectedStatus(updated.selectedStatus);
              }}
            />

            <PublicationDataTable
              data={filteredPublications}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />

            {/* Modals */}
            {showPublicationModal && (
              <PublicationModal
                publication={selectedPublication ?? undefined}
                onSave={selectedPublication? handleUpdatePublication : handleAddPublication}
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
