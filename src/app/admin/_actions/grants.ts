"use server"
import {z} from "zod"
import db
 from "@/db/db"
import { redirect } from "next/navigation"

const grantSchema = z.object({
    project_id: z.string().min(1, "Project ID is required"),
    project_title: z.string().optional(),
    pro_date_start: z.string().optional(),
    pro_date_end: z.string().optional(),
    cost_center_code: z.string().optional(),
    pl_staff_no: z.coerce.number().int().optional(),
    pl_name: z.string().optional(),
    ptj_research_alliance: z.string().optional(),
    research_group: z.string().optional(),
    type: z.string().min(1, "Grant Type is required"),
    status: z.string().optional(),
    sponsor_name: z.string().optional(),
    sponsor_category: z.string().min(1, "Sponsor Category is required"),
    subsponsor_name: z.string().optional(),
    approved_amount: z.coerce.number().int().min(1, "Amount is required"),
})

export async function addGrant(formData:FormData) {
    const result = grantSchema.safeParse(Object.fromEntries(formData.entries()))
    
    if (result.success === false){
        return { error: result.error.flatten().fieldErrors }
    }
    
    const data = result.data

    await db.grant.create({
        data: {
            project_id: data.project_id,
            project_title: data.project_title || null,
            pro_date_start: data.pro_date_start ? new Date(data.pro_date_start) : null,
            pro_date_end: data.pro_date_end ? new Date(data.pro_date_end) : null,
            cost_center_code: data.cost_center_code || null,
            pl_staff_no: data.pl_staff_no ? BigInt(data.pl_staff_no) : null,
            pl_name: data.pl_name || null,
            ptj_research_alliance: data.ptj_research_alliance || null,
            research_group: data.research_group || null,
            type: data.type,
            status: data.status || null,
            sponsor_name: data.sponsor_name || null,
            sponsor_category: data.sponsor_category, 
            subsponsor_name: data.subsponsor_name || null,
            approved_amount: data.approved_amount,
        }})
    
    redirect("/admin/grants")
}