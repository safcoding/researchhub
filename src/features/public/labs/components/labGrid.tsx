"use client"

import { useState } from "react"
import { LabCard } from "./labCard"
import { LabModal } from "./labModal"
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"

interface Lab {
  lab_id: string
  lab_name: string
  lab_head: string | null
  email: string | null
  research_area: string | null
  description: string | null
  location: string | null
  status: string | null
  type: string
  contact_phone: string | null
  lab_equipment: Array<{
    equipment_id: string
    quantity: number
    equipment: {
      name: string
    }
  }>
}

interface LabsGridProps {
  labs: Lab[]
  page: number
  pageSize: number
  totalCount: number
}

export function LabsGrid({ labs, page, pageSize, totalCount }: LabsGridProps) {
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLabClick = (lab: Lab) => {
    setSelectedLab(lab)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedLab(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <LabCard 
            key={lab.lab_id}
            lab={lab}
            onClick={handleLabClick}
          />
        ))}
      </div>
      
      <LabModal 
        lab={selectedLab}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} labs
        </div>
        
        <PaginationWithLinks 
          page={page} 
          pageSize={pageSize} 
          totalCount={totalCount} 
        />
      </div>
    </>
  )
}