import { EventForm } from "../../../../../features/admin/events/components/eventForm"
import db from "@/db/db"
import { notFound } from "next/navigation"
import { BackButton } from "@/components/backButton"
export default async function EditEventPage(
    {params}: {
        params: Promise<{ id: string }>
    }
){
    const { id } = await params
    const event = await db.event.findUnique({ where: { event_id: id } })
    
    if (!event) {
        notFound()
    }
    
    return(
        <div className="space-y-6">
            <div className="space-y-4">
                <BackButton />
                <h1 className="text-2xl font-bold">Edit Event</h1>
                Fields with <span className="text-red-500">*</span> are required fields.
            </div>
            <EventForm event={event} />
        </div>
    )
}