"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, User} from "lucide-react"
import { useState } from "react"
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

interface EventModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  const [showImageModal, setShowImageModal] = useState(false);

  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
<DialogContent className="max-w-[1200px] max-h-[80vh] overflow-y-auto">
  <DialogHeader>
    <div className="flex items-center justify-between">
      <Badge variant="secondary" className="w-fit">
        {event.category}
      </Badge>
    </div>
    <DialogTitle className="text-left text-2xl font-bold text-[#046951] mt-2">
      {event.title}
    </DialogTitle>
  </DialogHeader>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="flex flex-col justify-start">
      {event.image && (
        <>
          <div
            className="aspect-video overflow-hidden rounded-lg cursor-pointer"
            onClick={() => setShowImageModal(true)}
            title="Click to view full image"
          >
            <Image 
              src={event.image} 
              alt={event.title}
              width={400}
              height={225}
              className="w-full h-full object-cover"
            />
          </div>
          <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
            <DialogContent className="p-0 max-w-3xl bg-transparent shadow-none">
              <Image
                src={event.image}
                alt={event.title}
                width={400}
                height={225}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>


    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{new Date(event.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        {event.time && (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
        )}
        {event.location && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600">
          <User className="h-4 w-4" />
          <span>Organized by: {event.organizer}</span>
        </div>
      </div>

      {/* Row 2: Description */}
      <div>
        <h3 className="font-semibold text-lg mb-2">About this Event</h3>
        <div className="text-gray-700 whitespace-pre-wrap">
          {linkifyText(event.description)}
        </div>
      </div>
    </div>
  </div>
</DialogContent>
    </Dialog>
  )
}