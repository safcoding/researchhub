"use server"

import {z} from "zod"
import db from "@/db/db"
import { redirect, notFound } from "next/navigation"

const addSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().optional(),
    location: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    organizer: z.string().min(1, "Organizer is required"),
    contact_email: z.string().email("Valid email is required"),
    registration_required: z.string().optional(),
    registration_deadline: z.string().optional(),
    image: z.string().optional(),
    priority: z.string().optional(),
    status: z.string().optional(),
})

const editSchema = addSchema

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
            registration_required: data.registration_required === "true" ? true : false,
            registration_deadline: data.registration_deadline ? new Date(data.registration_deadline) : null,
            image: data.image || null,
            priority: data.priority || "",
            status: data.status || "",
        }
    })

    redirect("/admin/events")
}

export async function deleteEvent(id: string) {
    const event = await db.event.findUnique({ where: { event_id: id } })
    if (event == null) return notFound()

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
    const event = await db.event.findUnique({ where: { event_id: id } })
    if (!event) {
        notFound()
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
            image: data.image || null,
            priority: data.priority || "",
            status: data.status || "",
        }
    })
    
    redirect("/admin/events")
}