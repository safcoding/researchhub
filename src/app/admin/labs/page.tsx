'use client';

import { useState, useMemo } from 'react';
import { LabLogic, type Lab } from '@/hooks/logic/lab-logic';
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
import { LabFilters } from '@/components/admin-components/labs/lab-filters';
import { useEquipmentLogic } from '@/hooks/logic/equipment-logic';

export default function LabsPage() {
  const { labs, loading, error, addLab, updateLab, deleteLab, } = LabLogic();
  const { equipment } = useEquipmentLogic();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

  // Handlers
    const handleAddLab = async (newLab: Partial<Lab>) => {
    const labId = await addLab(newLab as Omit<Lab, 'id'>);
    setShowAddModal(false);
    return labId;
    };

    const handleUpdateLab = async (updatedLab: Partial<Lab>) => {
    if (selectedLab?.LABID) {
        await updateLab(selectedLab.LABID, updatedLab);
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
      await deleteLab(selectedLab.LABID);
      setShowDeleteModal(false);
      setSelectedLab(null);
    }
    };

    const handleDetailsClick = (lab: Lab) => {
    setSelectedLab(lab);
    setShowDetailsModal(true);
    };

    const [filters, setFilters] = useState({
    labType: "",
    labName: "",
    equipmentId: "",
    });

  // 2. Handler for filter changes
    const handleFiltersChange = (changed: Partial<typeof filters>) => {
        setFilters(prev => ({ ...prev, ...changed }));
    };

    const filteredLabs = useMemo(() => {
      return labs.filter(lab => {
        const matchesType = !filters.labType || lab.LAB_TYPE === filters.labType;
        const matchesName = !filters.labName || lab.LAB_NAME.toLowerCase().includes(filters.labName.toLowerCase());
        return matchesType && matchesName;
      });
    }, [labs, filters]);

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

          <LabFilters
            filters={filters}
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
            data={filteredLabs}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onDetails={handleDetailsClick}
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