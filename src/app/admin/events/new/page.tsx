import { EventForm } from "../../../../features/admin/events/components/eventForm";
import { BackButton } from "@/components/backButton";

export default function AddEventPage(){
    return(
        <div className="space-y-6">
            <div className="space-y-4">
                <BackButton />
                <h1 className="text-2xl font-bold">Add New Event</h1>
                Fields with <span className="text-red-500">*</span> are required fields.
            </div>
            <EventForm />
        </div>
    )
}