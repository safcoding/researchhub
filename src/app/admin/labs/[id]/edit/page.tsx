import { GrantForm } from "../../_components/grantForm"
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
                <h1 className="text-2xl font-bold">Add New Publication</h1>
            </div>
            <GrantForm grant={grant} />
        </div>
    )
}