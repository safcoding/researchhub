"use client"

import { useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { EventCard } from "@/app/(public)/_shared/eventCard"
import { EventModal } from "@/app/(public)/_shared/eventModal"

interface Event {
  event_id: string
  title: string
  description: string
  date: Date
  time?: string |  null
  location?: string | null
  image?: string |  null
  category: string
  organizer: string | null
}

interface EventCarouselProps {
  events: Event[]
  title?: string
}

export function EventCarousel({ events, title = "Upcoming Events" }: EventCarouselProps) {
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

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No upcoming events.</p>
      </div>
    )
  }

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {events.map((event) => (
                <CarouselItem key={event.event_id} className="md:basis-1/2 lg:basis-1/3">
                  <EventCard 
                    event={event} 
                    onClick={handleEventClick}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
      
      <EventModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}