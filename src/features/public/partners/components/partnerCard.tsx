"use client"

import { Card } from "@/components/ui/card"

interface Partner{
    partner_id: string,
    name: string,
    image: string,
}

export function PartnerCard({name, image}: Partner){
    return (
    <Card 
      className={`h-full cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]`}
    >
      {image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>
      )}
    </Card>   
    )
}