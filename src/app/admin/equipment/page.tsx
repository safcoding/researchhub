'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEquipmentLogic, type Equipment, type EquipmentFilters } from '@/hooks/logic/equipment-logic';
import { EquipmentDataTable } from '@/components/admin-components/equipment/equipment-data-table';
import { EquipmentFormModal } from '@/components/admin-components/equipment/equipment-form';
import { ConfirmationModal } from '@/components/reusable/confirmation-popup';
import { Button } from '@/components/ui/button';
import { AdminSidebar } from "@/components/admin-sidebar/sidebar-content";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { EquipmentFilters as EquipmentFiltersComponent } from '@/components/admin-components/equipment/equipment-filters';
import { useDebounceValue } from '@/hooks/use-debounce-value';

export default function EquipmentPage() {
  // Get equipment logic hooks
  const { equipment, loading, error, totalCount, fetchEquipment, addEquipment, updateEquipment, deleteEquipment } = useEquipmentLogic();
  
  // UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [filters, setFilters] = useState<EquipmentFilters>({
    searchText: '',
  });

  // Use debounced filters to prevent excessive API calls
  const debouncedFilters = useDebounceValue(filters, 300);

  // Load data when filters or page changes
  useEffect(() => {
    fetchEquipment({
      page: currentPage,
      itemsPerPage,
      filters: debouncedFilters,
    });
  }, [currentPage, debouncedFilters, fetchEquipment, itemsPerPage]);

  // Filter change handler
  const handleFiltersChange = useCallback((newFilters: Partial<EquipmentFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Page change handler
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // CRUD handlers
  const handleAddEquipment = async (newEquipment: Partial<Equipment>) => {
    await addEquipment(
      newEquipment, 
      { page: currentPage, itemsPerPage, filters: debouncedFilters }
    );
    setShowAddModal(false);
  };

  const handleUpdateEquipment = async (updatedEquipment: Partial<Equipment>) => {
    if (selectedEquipment?.id) {
      await updateEquipment(
        selectedEquipment.id, 
        updatedEquipment, 
        { page: currentPage, itemsPerPage, filters: debouncedFilters }
      );
      setShowEditModal(false);
      setSelectedEquipment(null);
    }
  };

  const handleEditClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowEditModal(true);
  };

  const handleDeleteClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedEquipment?.id) {
      await deleteEquipment(
        selectedEquipment.id, 
        { page: currentPage, itemsPerPage, filters: debouncedFilters }
      );
      setShowDeleteModal(false);
      setSelectedEquipment(null);
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
              <h1 className="text-3xl font-bold text-gray-800">Admin: Manage Equipment</h1>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Equipment
              </Button>
            </div>

            <EquipmentFiltersComponent
              filters={filters}
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
                <span className="ml-2">Loading equipment...</span>
              </div>
            ) : (
              <EquipmentDataTable
                data={equipment}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                totalCount={totalCount}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}

            {showAddModal && (
              <EquipmentFormModal
                onSave={handleAddEquipment}
                onClose={() => setShowAddModal(false)}
              />
            )}

            {showEditModal && selectedEquipment && (
              <EquipmentFormModal
                equipment={selectedEquipment}
                onSave={handleUpdateEquipment}
                onClose={() => setShowEditModal(false)}
              />
            )}

            {showDeleteModal && selectedEquipment && (
              <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Equipment"
                message={`Are you sure you want to delete "${selectedEquipment.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                  setShowDeleteModal(false);
                  setSelectedEquipment(null);
                }}
              />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
