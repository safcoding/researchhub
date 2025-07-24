"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"

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
      className={`h-full cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] px-4 py-4`}
    >
      {partner.image && (
        <div className="w-full h-full flex items-center justify-center">
          <Image 
            src={partner.image} 
            alt={partner.name}
            width={225}
            height={400}
            className="max-w-full max-g-48 object-contain"
          />
        </div>
      )}
    </Card>   
    )
}