'use client';

import { useState, useEffect, useCallback } from 'react';
import { LabLogic, type Lab, type LabFilters } from '@/hooks/logic/lab-logic';
import { LabDataTable } from '@/components/admin-components/labs/lab-data-table';
import { LabFormModal } from '@/components/admin-components/labs/lab-form';
import LabDetailsModal from '@/components/admin-components/labs/table-details-modal';
import { ConfirmationModal } from '@/components/reusable/confirmation-popup';
import { Button } from '@/components/ui/button';
import { AdminSidebar } from "@/components/admin-sidebar/sidebar-content"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LabFilters as LabFiltersComponent } from '@/components/admin-components/labs/lab-filters';
import { useEquipmentLogic } from '@/hooks/logic/equipment-logic';
import { useDebouncedSearch } from '@/hooks/use-debounce';

export default function LabsPage() {
  const { labs, loading, error, totalCount, fetchLabs, addLab, updateLab, deleteLab } = LabLogic();
  const { equipment } = useEquipmentLogic();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [filters, setFilters] = useState<LabFilters>({
    searchText: '',
    labType: '',
  });

  // Use debounced search hook
  const { searchValue, handleSearchChange } = useDebouncedSearch(
    (value: string) => {
      setFilters(prev => ({ ...prev, searchText: value }));
      setCurrentPage(1);
    },
    300
  );

  // Load data when filters or page changes
  useEffect(() => {
    fetchLabs({
      page: currentPage,
      itemsPerPage,
      filters: {
        searchText: filters.searchText,
        labType: filters.labType,
      },
    });
  }, [currentPage, filters, fetchLabs, itemsPerPage]);

  // Filter change handler
  const handleFiltersChange = useCallback((newFilters: Partial<{ labType: string; labName: string; equipmentId: string }>) => {
    setFilters(prev => ({
      ...prev,
      labType: newFilters.labType || '',
    }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Page change handler
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handlers
  const handleAddLab = async (newLab: Partial<Lab>) => {
    const labId = await addLab(
      newLab as Omit<Lab, 'LABID'>, 
      filters, 
      currentPage, 
      itemsPerPage
    );
    setShowAddModal(false);
    return labId;
  };

  const handleUpdateLab = async (updatedLab: Partial<Lab>) => {
    if (selectedLab?.LABID) {
      await updateLab(
        selectedLab.LABID, 
        updatedLab, 
        filters, 
        currentPage, 
        itemsPerPage
      );
      setShowEditModal(false);
      setSelectedLab(null);
      return selectedLab.LABID;
    }
    return "";
  };

  const handleEditClick = (lab: Lab) => {
    setSelectedLab(lab);
    setShowEditModal(true);
  };

  const handleDeleteClick = (lab: Lab) => {
    setSelectedLab(lab);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedLab?.LABID) {
      await deleteLab(
        selectedLab.LABID, 
        filters, 
        currentPage, 
        itemsPerPage
      );
      setShowDeleteModal(false);
      setSelectedLab(null);
    }
  };

  const handleDetailsClick = (lab: Lab) => {
    setSelectedLab(lab);
    setShowDetailsModal(true);
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
              <h1 className="text-3xl font-bold text-gray-800">Admin: Manage Labs</h1>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Lab
              </Button>
            </div>

            <LabFiltersComponent
              filters={{ labType: filters.labType, labName: '', equipmentId: '' }}
              onFiltersChange={handleFiltersChange}
              equipmentList={equipment.map(eq => ({ id: eq.id, name: eq.name }))}
            />
          
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading laboratories...</span>
              </div>
            ) : (
              <LabDataTable
                data={labs}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onDetails={handleDetailsClick}
                totalCount={totalCount}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
              />
            )}

            {showAddModal && (
              <LabFormModal
                onSave={handleAddLab}
                onClose={() => setShowAddModal(false)}
              />
            )}

            {showEditModal && selectedLab && (
              <LabFormModal
                lab={selectedLab}
                onSave={handleUpdateLab}
                onClose={() => setShowEditModal(false)}
              />
            )}

            {showDetailsModal && selectedLab && (
              <LabDetailsModal
                lab={selectedLab}
                onClose={() => setShowDetailsModal(false)}
              />
            )}
          </div>

          {showDeleteModal && selectedLab && (
            <ConfirmationModal
              isOpen={showDeleteModal}
              title="Delete Lab"
              message={`Are you sure you want to delete "${selectedLab.LAB_NAME}"? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
              variant="destructive"
              onConfirm={handleDeleteConfirm}
              onCancel={() => {
                setShowDeleteModal(false);
                setSelectedLab(null);
              }}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
