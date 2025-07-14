"use server"

import {z} from "zod"
import db from "@/db/db"
import { redirect, notFound } from "next/navigation"

const addSchema = z.object({
    lab_name:      z.string().min(1, "Lab name is required"),
    lab_head:      z.string().optional(),
    email:         z.string().email("Valid email is required").optional().or(z.literal("")),
    research_area: z.string().optional(),
    description:   z.string().optional(),
    location:      z.string().optional(),
    status:        z.string().optional(),
    type:          z.string().min(1, "Lab type is required"),
    contact_phone: z.string().optional(),
})

const editSchema = addSchema

type FormState = {
    message: string
    errors?: {
        [key: string]: string[]
    }
}

export async function addLab(prevState: FormState, formData: FormData): Promise<FormState> {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
    
    if (result.success === false) {
        return {
            message: "Invalid fields",
            errors: result.error.flatten().fieldErrors
        }
    }
    
    const data = result.data

    await db.lab.create({
        data: {
            lab_name: data.lab_name,
            lab_head: data.lab_head || null,
            email: data.email || null,
            research_area: data.research_area || null,
            description: data.description || null,
            location: data.location || null,
            status: data.status || null,
            type: data.type,
            contact_phone: data.contact_phone || null,
        }
    })
    
    redirect("/admin/labs")
}

export async function deleteLab(lab_id: string) {
    const lab = await db.lab.findUnique({ where: { lab_id } })
    if (lab == null) return notFound()

    await db.lab.delete({ where: { lab_id } })
    redirect("/admin/labs")
}

export async function editLab(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
    
    if (result.success === false) {
        return {
            message: "Invalid fields",
            errors: result.error.flatten().fieldErrors
        }
    }
    
    const data = result.data
    const lab = await db.lab.findUnique({ where: { lab_id: id } })
    if (!lab) {
        notFound()
    }
    
    await db.lab.update({
        where: { lab_id: id },
        data: {
            lab_name: data.lab_name,
            lab_head: data.lab_head || null,
            email: data.email || null,
            research_area: data.research_area || null,
            description: data.description || null,
            location: data.location || null,
            status: data.status || null,
            type: data.type,
            contact_phone: data.contact_phone || null,
        }
    })
    
    redirect("/admin/labs")
}