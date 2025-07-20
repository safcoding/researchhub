"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { columns, Partner } from "@/features/admin/partners/components/columns";
import { PartnerFormModal } from "@/features/admin/partners/components/partnerFormModal";
import { MiniDataTable } from "@/app/admin/_shared/mini-data-table";

interface PartnerTableSectionProps {
  partners: Partner[];
}

export function PartnerTableSection({ partners }: PartnerTableSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | undefined>(undefined);

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPartner(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(undefined);
    window.location.reload();
  };

  const table = useReactTable({
    data: partners,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onEdit: handleEdit,
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Industry Partners</CardTitle>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <MiniDataTable 
            columns={columns} 
            data={partners}
            table={table}
          />
        </CardContent>
      </Card>
      
      <PartnerFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        partner={selectedPartner}
      />
    </>
  );
}