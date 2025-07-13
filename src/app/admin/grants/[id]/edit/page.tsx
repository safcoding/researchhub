import { GrantForm } from "../../_components/grantForm"
import db from "@/db/db"
import { notFound } from "next/navigation"

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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Edit Grant</h1>
            <GrantForm grant={grant} />
        </div>
    )
}