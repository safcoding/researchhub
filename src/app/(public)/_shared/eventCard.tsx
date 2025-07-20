"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock } from "lucide-react"
import { linkifyText } from "@/lib/linkifyText" 
import Image from "next/image"

interface Event {
  event_id: string
  title: string
  description: string
  date: Date
  time?: string |  null
  location?: string | null
  image?: string | null
  category: string
  organizer: string |  null
}

interface EventCardProps {
  event: Event
  onClick: (event: Event) => void
  className?: string
}

export function EventCard({ event, onClick, className = "" }: EventCardProps) {
  return (
    <Card 
      className={`h-full cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] ${className}`}
      onClick={() => onClick(event)}
    >
      {event.image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={event.image} 
            alt={event.title}
            width={400}
            height={225}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{event.category}</Badge>
        </div>
        <CardTitle className="line-clamp-2 text-[#046951]">{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {linkifyText(event.description)}
        </p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
            {event.time && (
              <>
                <Clock className="h-4 w-4 ml-2" />
                <span>{event.time}</span>
              </>
            )}
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}