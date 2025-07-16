"use client"

import StatsCard from "@/components/statsCard"


interface PublicationStatCardsProps {
  currentYear: number
  totalPublications: number
  allTimeTotal: number
}


export function PublicationStatCards({ 
  currentYear, 
  totalPublications,
  allTimeTotal
}: PublicationStatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <StatsCard
        title={`Total Publications in ${currentYear}`}
        content={
          <div className="text-2xl font-bold">{totalPublications}</div>
        }
      />
      <StatsCard
        title={`Total Publications (All Time)`}
        content={
          <div className="text-2xl font-bold">{allTimeTotal}</div>
        }
      />
    </div>
  )
}