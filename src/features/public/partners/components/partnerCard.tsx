"use client"

import { Card } from "@/components/ui/card"

interface Partner{
    partner_id: string,
    name: string,
    image: string,
}

interface PartnerCardProps{
  partner: Partner
}

export function PartnerCard({partner}: PartnerCardProps){
    return (
    <Card 
      className={`h-full cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]`}
    >
      {partner.image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={partner.image} 
            alt={partner.name}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>
      )}
    </Card>   
    )
}