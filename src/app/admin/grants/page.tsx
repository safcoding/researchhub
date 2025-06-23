'use client';

import { useState } from 'react';
import { GrantLogic, type Grant } from '@/hooks/grant-logic';
import { GrantModal } from '@/components/admin-components/grants/grant-form';
import { ConfirmationModal } from '@/components/reusable/confirmation-popup';
import { Button } from '@/components/ui/button';
import { AdminSidebar } from "@/components/admin-sidebar/sidebar-content";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { GrantDataTable } from '@/components/admin-components/grants/grant-data-table';
import { GrantFilters } from '@/components/admin-components/grants/grant-filters';

export default function GrantDBPage() {
  const { grants, loading, error, addGrant, updateGrant, deleteGrant } = GrantLogic();
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past' | 'thisMonth' | 'nextMonth'>('all');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleUpdateGrant = async (updatedGrant: Partial<Grant>) => {
    if (selectedGrant?.PROJECTID) {
      await updateGrant(selectedGrant.PROJECTID, updatedGrant);
      setShowGrantModal(false);
      setSelectedGrant(null);
    }
  };

  const handleAddGrant = async (newGrant: Partial<Grant>) => {
    await addGrant(newGrant);
    setShowGrantModal(false);
  };

  const handleEditClick = (grant: Grant) => {
    setSelectedGrant(grant);
    setShowGrantModal(true);
  };

  const handleDeleteClick = (grant: Grant) => {
    setSelectedGrant(grant);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedGrant?.PROJECTID) {
      await deleteGrant(selectedGrant.PROJECTID);
      setShowDeleteModal(false);
      setSelectedGrant(null);
    }
  };

  // Filtering logic
  const filteredGrants = grants.filter(grant => {

    const grantDate = new Date(grant.PRO_DATESTART);
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let matchesDate = true;
    switch (dateFilter) {
      case 'upcoming':
        matchesDate = grantDate >= today;
        break;
      case 'past':
        matchesDate = grantDate < today;
        break;
      case 'thisMonth':
        matchesDate = grantDate.getMonth() === currentMonth && grantDate.getFullYear() === currentYear;
        break;
      case 'nextMonth':
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        matchesDate = grantDate.getMonth() === nextMonth && grantDate.getFullYear() === nextMonthYear;
        break;
      default:
        matchesDate = true;
    }

    // Year filtering
    const matchesYear = selectedYear === 'all' || grantDate.getFullYear().toString() === selectedYear;

    // Month filtering
    const matchesMonth = selectedMonth === 'all' || grantDate.getMonth().toString() === selectedMonth;

    const matchesStatus = selectedStatus === 'all' || grant.PROJECT_STATUS === selectedStatus;

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

            <GrantFilters
              filters={{
                dateFilter,
                selectedYear,
                selectedMonth,
                selectedStatus,
              }}
              grants={grants}
              onFiltersChange={updated => {
                if (updated.selectedYear !== undefined) setSelectedYear(updated.selectedYear);
                if (updated.selectedMonth !== undefined) setSelectedMonth(updated.selectedMonth);
                if (updated.selectedStatus !== undefined) setSelectedStatus(updated.selectedStatus);
              }}
            />

            <GrantDataTable
              data={filteredGrants}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                Error: {error}
              </div>
            )}

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