"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addEvent, editEvent } from "../../_actions/events"
import { useFormStatus, useFormState } from "react-dom"
import { useState, useEffect } from "react"
import { event } from "@prisma/client"
import { Textarea } from "@/components/ui/textarea"
import imageCompression from 'browser-image-compression'

interface FormState {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

export function EventForm({ event }: { event?: event }) {
    const [formState, action] = useFormState(
        event == null ? addEvent : editEvent.bind(null, event.event_id), 
        { message: "", errors: {} } as FormState
    )
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isCompressing, setIsCompressing] = useState(false)

    useEffect(() => {
        if (formState.errors && Object.keys(formState.errors).length > 0) {
            setImagePreview(null)
            // Also clear the file input
            const fileInput = document.getElementById('image') as HTMLInputElement
            if (fileInput) {
                fileInput.value = ''
            }
        }
    }, [formState.errors])

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsCompressing(true)
            
            // Compression options
            const options = {
                maxSizeMB: 1, // Max 1MB
                maxWidthOrHeight: 1920, // Max dimensions
                useWebWorker: true,
                fileType: 'image/jpeg' as const
            }

            // Compress the image
            const compressedFile = await imageCompression(file, options)
            
            // Create new file input with compressed image
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(new File([compressedFile], file.name, {
                type: compressedFile.type,
                lastModified: Date.now()
            }))
            
            if (e.target) {
                e.target.files = dataTransfer.files
            }

            // Show preview
            const reader = new FileReader()
            reader.onload = (e) => setImagePreview(e.target?.result as string)
            reader.readAsDataURL(compressedFile)
            
        } catch (error) {
            console.error('Error compressing image:', error)
        } finally {
            setIsCompressing(false)
        }
    }

    return (
        <form action={action} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input type="text" id="title" name="title" required defaultValue={event?.title || ""} />
                {formState.errors?.title && (
                    <div className="text-destructive text-sm">{formState.errors.title[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required defaultValue={event?.description || ""} />
                {formState.errors?.description && (
                    <div className="text-destructive text-sm">{formState.errors.description[0]}</div>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={event?.category || ""} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select event category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Conference">Conference</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                {formState.errors?.category && (
                    <div className="text-destructive text-sm">{formState.errors.category[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" defaultValue={event?.priority || ""}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select event priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                </Select>
                {formState.errors?.priority && (
                    <div className="text-destructive text-sm">{formState.errors.priority[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={event?.status || ""}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select event status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
                {formState.errors?.status && (
                    <div className="text-destructive text-sm">{formState.errors.status[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="date">Event Date</Label>
                <Input type="date" id="date" name="date" required defaultValue={event?.date ? new Date(event.date).toISOString().split('T')[0] : ""} />
                {formState.errors?.date && (
                    <div className="text-destructive text-sm">{formState.errors.date[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input type="time" id="time" name="time" defaultValue={event?.time || ""} />
                {formState.errors?.time && (
                    <div className="text-destructive text-sm">{formState.errors.time[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input type="text" id="location" name="location" defaultValue={event?.location || ""} />
                {formState.errors?.location && (
                    <div className="text-destructive text-sm">{formState.errors.location[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input type="text" id="organizer" name="organizer" required defaultValue={event?.organizer || ""} />
                {formState.errors?.organizer && (
                    <div className="text-destructive text-sm">{formState.errors.organizer[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="registration_required">Registration Required</Label>
                <Select name="registration_required" defaultValue={event?.registration_required?.toString() || "false"}>
                    <SelectTrigger>
                        <SelectValue placeholder="Registration required?" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                </Select>
                {formState.errors?.registration_required && (
                    <div className="text-destructive text-sm">{formState.errors.registration_required[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="registration_deadline">Registration Deadline</Label>
                <Input type="date" id="registration_deadline" name="registration_deadline" 
                       defaultValue={event?.registration_deadline ? new Date(event.registration_deadline).toISOString().split('T')[0] : ""} />
                {formState.errors?.registration_deadline && (
                    <div className="text-destructive text-sm">{formState.errors.registration_deadline[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input type="email" id="contact_email" name="contact_email" defaultValue={event?.contact_email || ""} />
                {formState.errors?.contact_email && (
                    <div className="text-destructive text-sm">{formState.errors.contact_email[0]}</div>
                )}
            </div>

    <div className="space-y-2">
                <Label htmlFor="image">Event Image</Label>
                <Input 
                    type="file" 
                    id="image" 
                    name="image" 
                    accept="image/*"
                    required={!event}
                    onChange={handleImageChange}
                />
                
                {isCompressing && (
                    <p className="text-sm text-blue-600">Compressing image...</p>
                )}
                
                <p className="text-xs text-gray-500">
                    Images will be automatically compressed to under 1MB
                </p>
                
                {/* Show preview of new image */}
                {imagePreview && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">Preview:</p>
                        <img 
                            src={imagePreview} 
                            alt="Image preview" 
                            className="w-32 h-32 object-cover rounded border"
                        />
                    </div>
                )}
                
                {/* Show current image for editing */}
                {event?.image && !imagePreview && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">Current image:</p>
                        <img 
                            src={event.image} 
                            alt="Current event image" 
                            className="w-32 h-32 object-cover rounded border"
                        />
                    </div>
                )}
                
                {formState.errors?.image && (
                    <div className="text-destructive text-sm">{formState.errors.image[0]}</div>
                )}
            </div>

            <SubmitButton/>
        </form>
    )
}


function SubmitButton(){
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save"}</Button>
    )

}