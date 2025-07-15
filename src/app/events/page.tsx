"use client"

import { useState, useEffect } from "react"
import { getAllEvents } from "../_actions/events"
import { EventCard } from "@/components/eventCard"
import { EventModal } from "@/components/eventModal"

interface Event {
  event_id: string
  title: string
  description: string
  date: string
  time?: string
  location?: string
  image?: string
  category: string
  organizer: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getAllEvents()
        setEvents(fetchedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading events...</div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">All Events</h1>
        
        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No events available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard 
                key={event.event_id}
                event={event}
                onClick={handleEventClick}
              />
            ))}
          </div>
        )}
      </div>
      
      <EventModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}