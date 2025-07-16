"use server"

import {z} from "zod"
import db from "@/db/db"
import { redirect, notFound } from "next/navigation"
import { uploadEventImage, deleteEventImage } from "@/lib/utils/supabase/storage"

const fileSchema = z.instanceof(File, { message: "Not a file" })
const imageSchema = fileSchema.refine(
  file => file.size === 0 || file.type.startsWith("image/"),
  "File must be an image"
).refine(
  file => file.size === 0 || file.size <= 1024 * 1024, // 1MB limit
  "Image must be less than 1MB"
)

const addSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().optional(),
    location: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    organizer: z.string().min(1, "Organizer is required"),
    contact_email: z.string().optional(),
    registration_required: z.string().optional(),
    registration_deadline: z.string().optional(),
    image: imageSchema.refine(file => file.size > 0, "Image Required"),
    priority: z.string().optional(),
    status: z.string().optional(),
})

const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  location: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  organizer: z.string().optional(),
  contact_email: z.string().optional(),
  registration_required: z.string().optional(),
  registration_deadline: z.string().optional(),
  image: imageSchema.optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
})

type FormState = {
    message: string
    errors?: {
        [key: string]: string[]
    }
}

export async function addEvent(prevState: FormState, formData: FormData): Promise<FormState> {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
    
    if (result.success === false) {
        return {
            message: "Invalid fields",
            errors: result.error.flatten().fieldErrors
        }
    }
    
    const data = result.data

   try {
    // Upload image to Supabase
    const imageUrl = await uploadEventImage(data.image)

    await db.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        time: data.time || null,
        location: data.location || null,
        category: data.category,
        organizer: data.organizer,
        contact_email: data.contact_email,
        registration_required: data.registration_required === "true",
        registration_deadline: data.registration_deadline ? new Date(data.registration_deadline) : null,
        image: imageUrl,
        priority: data.priority || "",
        status: data.status || "",
      }
    })

    redirect("/admin/events")
  } catch (error) {
    console.error('Error creating event:', error)
    return {
      message: "Failed to create event. Please try again.",
      errors: {}
    }
  }
}

export async function deleteEvent(id: string) {
    const event = await db.event.findUnique({ where: { event_id: id } })
    if (event == null) return notFound()

    if (event.image) {
      await deleteEventImage(event.image)
    }
    await db.event.delete({ where: { event_id: id } })
    redirect("/admin/events")
}

export async function editEvent(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
    
    if (result.success === false) {
        return {
            message: "Invalid fields",
            errors: result.error.flatten().fieldErrors
        }
    }
    
    const data = result.data
    const existingEvent = await db.event.findUnique({ where: { event_id: id } })
    if (!existingEvent) {
        notFound()
    }
    
    let imageUrl = existingEvent.image

    if (data.image && data.image.size > 0) {
      if (existingEvent.image) {
        await deleteEventImage(existingEvent.image)
      }
      imageUrl = await uploadEventImage(data.image)
    }

    await db.event.update({
        where: { event_id: id },
        data: {
            title: data.title,
            description: data.description,
            date: new Date(data.date),
            time: data.time || null,
            location: data.location || null,
            category: data.category,
            organizer: data.organizer,
            contact_email: data.contact_email,
            registration_required: data.registration_required === "true" ? true : false,
            registration_deadline: data.registration_deadline ? new Date(data.registration_deadline) : null,
            image: imageUrl,
            priority: data.priority || "",
            status: data.status || "",
        }
    })
    
    redirect("/admin/events")
}