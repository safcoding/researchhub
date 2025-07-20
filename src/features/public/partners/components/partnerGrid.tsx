"use client"

import { PartnerCard } from "./partnerCard"

interface Partner{
    partner_id: string,
    name: string,
    image: string,
}

interface PartnerGridProps{
  partners: Partner[]
}
export function PartnerGrid( {partners}: PartnerGridProps) {

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {partners.map((partner) => (
          <PartnerCard 
            key={partner.partner_id}
            partner={partner}
          />
        ))}
      </div>
  )
}