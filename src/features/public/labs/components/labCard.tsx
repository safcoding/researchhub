"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, Mail, Phone } from "lucide-react"

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

interface LabCardProps {
  lab: Lab
  onClick: (lab: Lab) => void
}

export function LabCard({ lab, onClick }: LabCardProps) {
  const getStatusVariant = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-[#06d6a0] text-white border-transparent' 
      case 'under maintenance':
        return 'bg-[#ef476f] text-white border-transparent' 
      case 'unavailable':
        return 'bg-[#ef476f] text-white border-transparent' 
      case 'inactive':
        return 'bg-gray-200 text-black border-transparent' 
      default:
      return 'bg-gray-200 text-gray-800 border-transparent'
    }
  }

  const getTypeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'i-kohza':
        return 'bg-[#0A867D] text-white border-transparent'
    case 'research lab':
      return 'bg-[#F4A261] text-white border-transparent'
    case 'satellite lab':
      return 'bg-[#264653] text-white border-transparent'
    case 'teaching lab':
      return 'bg-[#E76F51] text-white border-transparent'
    case 'service lab':
      return 'bg-[#E9C46A] text-white border-transparent'
    default:
      return 'bg-gray-200 text-gray-800 border-transparent'
    }
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full flex flex-col"
      onClick={() => onClick(lab)}
    >
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {lab.lab_name}
          </CardTitle>
          <div className="flex flex-col gap-1">
            <Badge className={getTypeVariant(lab.type)}>
              {lab.type}
            </Badge>
            {lab.status && (
              <Badge className={getStatusVariant(lab.status)}>
                {lab.status}
              </Badge>
            )}
          </div>
        </div>
        
        {lab.research_area && (
          <CardDescription className="text-sm text-muted-foreground">
            {lab.research_area}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-3">
          {lab.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {lab.description}
            </p>
          )}

          <div className="space-y-2">
            {lab.lab_head && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{lab.lab_head}</span>
              </div>
            )}

            {lab.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{lab.location}</span>
              </div>
            )}

            {lab.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate text-foreground">{lab.email}</span>
              </div>
            )}

            {lab.contact_phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{lab.contact_phone}</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="text-sm text-muted-foreground">
              Equipment: {lab.lab_equipment.length} items
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}