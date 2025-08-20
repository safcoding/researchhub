import { GrantForm } from "../../../../../features/admin/grants/components/grantForm"
import db from "@/db/db"
import { notFound } from "next/navigation"
import { BackButton } from "@/components/backButton"

export default async function EditGrantPage(
    {params}: {
        params: Promise<{ id: string }>
    }
){
    const { id } = await params
    const grant = await db.grant.findUnique({ where: { grant_id: id } })
    
    if (!grant) {
        notFound()
    }
    
    return(
        <div className="space-y-6">
            <div className="space-y-4">
                <BackButton />
                <h1 className="text-2xl font-bold">Edit Grant</h1>
                Fields with <span className="text-red-500">*</span> are required fields.
            </div>
            <GrantForm grant={grant} />
        </div>
    )
}