import { LabForm } from "../../../../../features/admin/labs/components/labForm"
import db from "@/db/db"
import { notFound } from "next/navigation"
import { BackButton } from "@/components/backButton"

export default async function EditLabPage(
    {params}: {
        params: Promise<{ id: string }>
    }
){
    const { id } = await params
    
    const lab = await db.lab.findUnique({ 
        where: { lab_id: id },
        include: {
            lab_equipment: {
                include: {
                    equipment: true 
                }
            }
        }
    })
    
    if (!lab) {
        notFound()
    }
    
    return(
        <div className="space-y-6">
            <div className="space-y-4">
                <BackButton />
                <h1 className="text-2xl font-bold">Edit Lab</h1>
            </div>
            <LabForm lab={lab} />
        </div>
    )
}