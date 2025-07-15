"use client"

import { useState } from "react"
import { EventCard } from "@/app/(public)/_shared/eventCard"
import { EventModal } from "@/app/(public)/_shared/eventModal"
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"

interface Event {
  event_id: string
  title: string
  description: string
  date: Date
  time?: string | null
  location?: string | null
  image?: string | null
  category: string
  organizer: string | null
}

interface EventGridProps {
  events: Event[]
  page: number
  pageSize: number
  totalCount: number
}

export function EventGrid({ events, page, pageSize, totalCount }: EventGridProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard 
            key={event.event_id}
            event={event}
            onClick={handleEventClick}
          />
        ))}
      </div>
      
      <EventModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
        <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount}
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