"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, User, Mail, Phone, Wrench } from "lucide-react"


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

interface LabModalProps {
  lab: Lab | null
  isOpen: boolean
  onClose: () => void
}

export function LabModal({ lab, isOpen, onClose }: LabModalProps) {
  if (!lab) return null

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'default' 
      case 'under maintenance':
        return 'secondary' 
      case 'unavailable':
        return 'destructive' 
      default:
        return 'outline' 
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'i-kohza':
        return 'default'
      case 'research lab':
        return 'secondary'
      case 'satellite lab':
        return 'outline' 
      case 'teaching lab':
        return 'default' 
      case 'service lab':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">
                {lab.lab_name}
              </DialogTitle>
              {lab.research_area && (
                <DialogDescription className="text-lg">
                  {lab.research_area}
                </DialogDescription>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={getTypeColor(lab.type)}>
                {lab.type}
              </Badge>
              {lab.status && (
                <Badge className={getStatusColor(lab.status)}>
                  {lab.status}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {lab.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{lab.description}</p>
            </div>
          )}

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lab.lab_head && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Lab Head</div>
                    <div className="font-medium">{lab.lab_head}</div>
                  </div>
                </div>
              )}

              {lab.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{lab.email}</div>
                  </div>
                </div>
              )}

              {lab.contact_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium">{lab.contact_phone}</div>
                  </div>
                </div>
              )}

              {lab.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-medium">{lab.location}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {lab.lab_equipment.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Wrench className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold">Equipment ({lab.lab_equipment.length} items)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {lab.lab_equipment.map((equipment) => (
                    <div 
                      key={equipment.equipment_id}
                      className="p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="font-medium text-sm mb-1">
                        {equipment.equipment.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Quantity: {equipment.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}