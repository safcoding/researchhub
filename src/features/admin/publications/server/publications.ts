"use server"

import {z} from "zod"
import db from "@/db/db"
import { redirect, notFound  } from "next/navigation"

const addSchema = z.object({
    pub_refno:             z.string().min(1, "Publication Reference Number is required"),
    title:                 z.string().min(1, "Title is required"),
    status:                z.string().min(1, "Status is required"),
    type:                  z.string().min(1, "Publication Type is required"),
    category:              z.string().min(1, "Category is required"),
    journal:               z.string().min(1, "Journal is required"),
    impact:                z.coerce.number().optional(),
    date:                  z.string().min(1, "Publication Date is required"),
    level:                 z.string().min(1, "Level is required"),
    author_id:             z.coerce.number().int().min(1, "Author ID is required"),
    research_alliance:     z.string().optional(),
    rg_name:               z.string().optional(),
    author_name:           z.string().min(1, "Author Name is required"),
})

type FormState = {
    errors?: {
        [key: string]: string[]
    }
    success?: boolean
}

export async function addPublication(prevState: FormState, formData: FormData):  Promise<FormState> {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  
  if (result.success === false) {
    return {errors: result.error.flatten().fieldErrors
    }
  }
    
    const data = result.data

    await db.publication.create({
        data: {
            pub_refno: data.pub_refno,
            title: data.title,
            status: data.status,
            type: data.type,
            category: data.category,
            journal: data.journal,
            impact: data.impact || null,
            date: new Date(data.date),
            level: data.level,
            author_id: data.author_id,
            research_alliance: data.research_alliance || null,
            rg_name: data.rg_name || null,
            author_name: data.author_name,
        }})
    
    redirect("/admin/publications")
}

export async function deletePublication(publication_id: string) {
  const publication = await db.publication.delete({where: { publication_id } })
  if (publication == null) return notFound()
}

const editSchema = z.object({
    pub_refno:             z.string().min(1, "Publication Reference Number is required"),
    title:                 z.string().min(1, "Title is required"),
    status:                z.string().min(1, "Status is required"),
    type:                  z.string().min(1, "Publication Type is required"),
    category:              z.string().min(1, "Category is required"),
    journal:               z.string().min(1, "Journal is required"),
    impact:                z.coerce.number().optional(),
    date:                  z.string().min(1, "Publication Date is required"),
    level:                 z.string().min(1, "Level is required"),
    author_id:             z.coerce.number().int().min(1, "Author ID is required"),
    research_alliance:     z.string().optional(),
    rg_name:               z.string().optional(),
    author_name:           z.string().min(1, "Author Name is required"),
})

export async function editPublication(id: string, prevState: FormState, formData: FormData):  Promise<FormState> {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
  
  if (result.success === false) {
    return {errors: result.error.flatten().fieldErrors
    }
  }
    
    const data = result.data
    const publication = await db.publication.findUnique({ where: { publication_id: id } })
    if (!publication) {
        notFound()
    }
    
    await db.publication.update({
      where: { publication_id: id },
        data: {
            pub_refno: data.pub_refno,
            title: data.title,
            status: data.status,
            type: data.type,
            category: data.category,
            journal: data.journal,
            impact: data.impact || null,
            date: new Date(data.date),
            level: data.level,
            author_id: data.author_id,
            research_alliance: data.research_alliance || null,
            rg_name: data.rg_name || null,
            author_name: data.author_name,
        }})
    
    redirect("/admin/publications")
}