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
        return 'default' 
      case 'under maintenance':
        return 'secondary' 
      case 'unavailable':
        return 'destructive' 
      default:
        return 'outline' 
    }
  }

  const getTypeVariant = (type: string) => {
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
            <Badge variant={getTypeVariant(lab.type)}>
              {lab.type}
            </Badge>
            {lab.status && (
              <Badge variant={getStatusVariant(lab.status)}>
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