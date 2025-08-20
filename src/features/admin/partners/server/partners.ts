"use server"

import {z} from "zod"
import db from "@/db/db"
import { uploadPartnerImage, deletePartnerImage } from "@/lib/utils/supabase/storage"
import { notFound } from "next/navigation"


const fileSchema = z.instanceof(File, { message: "Not a file" })
const imageSchema = fileSchema.refine(
  file => file.size === 0 || file.type.startsWith("image/"),
  "File must be an image"
).refine(
  file => file.size === 0 || file.size <= 1024 * 1024,
  "Image must be less than 1MB"
)

const addSchema =z.object({
    name: z.string().min(1, "Partner Name required"),
    image: imageSchema.refine(file => file.size> 0,  "Image Required")
})

const editSchema = z.object({
    name: z.string().min(1, "Partner Name required"),
    image: imageSchema.optional()
})

type FormState = {
    message: string
    errors?: {
        [key: string]: string[]
    }
}

export async function addPartner(prevState: FormState, formData: FormData): Promise<FormState> {
    const result  = addSchema.safeParse(Object.fromEntries(formData.entries ()))
    if (result.success === false) {
        return {
            message: "Invalid fields",
            errors: result.error.flatten().fieldErrors
        }
    }

    const data = result.data

   try {
    const imageUrl = await uploadPartnerImage(data.image)

    await db.partner.create({
      data: {
        name: data.name,
        image: imageUrl,

      }
    })
  return { message: "success" };
  
  } catch (error) {
    return {
      message: "Failed to create event. Please try again.",
      errors: {}
    }
  }
}

export async function deletePartner(id: string){
    const partner = await db.partner.findUnique({where: {partner_id: id}})
    if (partner == null) return notFound()

    if (partner.image) {
        await deletePartnerImage(partner.image)
    }
    await db.partner.delete({ where: { partner_id: id}})
    return { message: "success" };
}

export async function editPartner (id: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
    
    if (result.success === false) {
        return {
            message: "Invalid fields",
            errors: result.error.flatten().fieldErrors
        }
    }
    
    const data = result.data
    const existingPartner = await db.partner.findUnique({ where: { partner_id: id } })
    if (!existingPartner) {
        notFound()
    }
    
    let imageUrl = existingPartner.image

    if (data.image && data.image.size > 0) {
      if (existingPartner.image) {
        await deletePartnerImage(existingPartner.image)
      }
      imageUrl = await uploadPartnerImage(data.image)
    }

    await db.partner.update({
        where: { partner_id: id },
        data: {
            name: data.name,
            image: imageUrl,
        }
    })
    
return { message: "success" };
}