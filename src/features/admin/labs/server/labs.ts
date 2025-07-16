"use server"

import { z } from "zod"
import db from "@/db/db"
import { redirect } from "next/navigation"

const addSchema = z.object({
    lab_name: z.string().min(1, "Lab name is required"),
    lab_head: z.string().optional(),
    email: z.string().email("Valid email required").optional().or(z.literal("")),
    research_area: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    status: z.string().optional(),
    type: z.string().min(1, "Lab type is required"),
    contact_phone: z.string().optional(),
    equipment: z.array(z.object({
        equipment_id: z.string(),
        quantity: z.coerce.number().int().min(0, "Quantity must be 0 or greater")
    })).optional()
})

const editSchema = addSchema

type FormState = {
    message: string
    errors?: {
        [key: string]: string[]
    }
}

export async function addLab(prevState: FormState, formData: FormData): Promise<FormState> {
    const equipmentData = []
    const equipmentIds = formData.getAll('equipment_id') as string[]
    const quantities = formData.getAll('quantity') as string[]
    
    for (let i = 0; i < equipmentIds.length; i++) {
        if (equipmentIds[i] && quantities[i] && parseInt(quantities[i]) > 0) {
            equipmentData.push({
                equipment_id: equipmentIds[i],
                quantity: parseInt(quantities[i])
            })
        }
    }

    const formDataObj = Object.fromEntries(formData.entries())
    const dataToValidate = { ...formDataObj, equipment: equipmentData }
    
    const result = addSchema.safeParse(dataToValidate)
    
    if (result.success === false) {
        return {
            message: "Invalid fields",
            errors: result.error.flatten().fieldErrors
        }
    }
    
    const data = result.data

    try {
        await db.$transaction(async (tx) => {
            const lab = await tx.lab.create({
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

            if (data.equipment && data.equipment.length > 0) {
                await tx.lab_equipment.createMany({
                    data: data.equipment.map(eq => ({
                        lab_id: lab.lab_id,
                        equipment_id: eq.equipment_id,
                        quantity: eq.quantity
                    }))
                })
            }
        })

        redirect("/admin/labs")
    } catch (error) {
        console.error('Error creating lab:', error)
        return {
            message: "Failed to create lab. Please try again.",
            errors: {}
        }
    }
}

export async function editLab(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const equipmentData = []
    const equipmentIds = formData.getAll('equipment_id') as string[]
    const quantities = formData.getAll('quantity') as string[]
    
    for (let i = 0; i < equipmentIds.length; i++) {
        if (equipmentIds[i] && quantities[i] && parseInt(quantities[i]) > 0) {
            equipmentData.push({
                equipment_id: equipmentIds[i],
                quantity: parseInt(quantities[i])
            })
        }
    }

    const formDataObj = Object.fromEntries(formData.entries())
    const dataToValidate = { ...formDataObj, equipment: equipmentData }
    
    const result = editSchema.safeParse(dataToValidate)
    
    if (result.success === false) {
        return {
            message: "Invalid fields",
            errors: result.error.flatten().fieldErrors
        }
    }
    
    const data = result.data

    try {
        await db.$transaction(async (tx) => {

            await tx.lab.update({
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

            await tx.lab_equipment.deleteMany({
                where: { lab_id: id }
            })

            if (data.equipment && data.equipment.length > 0) {
                await tx.lab_equipment.createMany({
                    data: data.equipment.map(eq => ({
                        lab_id: id,
                        equipment_id: eq.equipment_id,
                        quantity: eq.quantity
                    }))
                })
            }
        })

        redirect("/admin/labs")
    } catch (error) {
        console.error('Error updating lab:', error)
        return {
            message: "Failed to update lab. Please try again.",
            errors: {}
        }
    }
}

export async function deleteLab(lab_id: string) {
    try {
        await db.$transaction(async (tx) => {
            await tx.lab_equipment.deleteMany({
                where: { lab_id }
            })
            
            await tx.lab.delete({
                where: { lab_id }
            })
        })
        
        redirect("/admin/labs")
    } catch (error) {
        console.error('Error deleting lab:', error)
        throw error
    }
}