"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"
import { EventModal } from "@/app/(public)/_shared/eventModal"

interface ConferenceProps {
  conferences: Array<{
    event_id: string
    title: string
    description: string
    date: Date
    time?: string | null
    location?: string | null
    image?: string | null
    category: string
    organizer: string | null
  }>
}

function ConferenceContent({ conferences }: ConferenceProps) {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConferenceClick = (conference: any) => {
    setSelectedEvent(conference)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  if (conferences.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No upcoming conferences at the moment.</p>
      </div>
    )
  }

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Conferences</h2>
          
          <div className="space-y-4">
            {conferences.map((conference) => (
              <Card 
                key={conference.event_id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] min-h-[140px]"
                onClick={() => handleConferenceClick(conference)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row min-h-[140px]">
                    <div className="bg-[#046951] text-white p-6 flex flex-col items-center justify-center min-w-[120px] flex-shrink-0">
                      <div className="text-2xl font-bold">
                        {new Date(conference.date).getDate()}
                      </div>
                      <div className="text-sm uppercase tracking-wide">
                        {new Date(conference.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                  
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between h-full">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 text-[#046951]">
                            {conference.title}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            {conference.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{conference.location}</span>
                              </div>
                            )}
                            
                            {conference.time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{conference.time}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {conference.description}
                          </p>
                          
                          <Badge variant="outline" className="text-[#046951] border-[#046951]">
                            {conference.category}
                          </Badge>
                        </div>
                        
                        <div className="mt-4 md:mt-0 md:ml-6">
                          <div className="text-sm text-gray-500 text-right">
                            Click to view details
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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

export { ConferenceContent }