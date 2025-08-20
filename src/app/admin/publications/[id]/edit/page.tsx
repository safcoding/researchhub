import { PublicationForm } from "../../../../../features/admin/publications/components/publicationForm"
import db from "@/db/db"
import { notFound } from "next/navigation"
import { BackButton } from "@/components/backButton"
export default async function EditPublicationPage(
    {params}: {
        params: Promise<{ id: string }>
    }
){
    const { id } = await params
    const publication = await db.publication.findUnique({ where: { publication_id: id } })
    
    if (!publication) {
        notFound()
    }
    
    return(
        <div className="space-y-6">
            <div className="space-y-4">
                <BackButton />
                <h1 className="text-2xl font-bold">Edit Publication</h1>
                Fields with <span className="text-red-500">*</span> are required fields.
            </div>
            <PublicationForm publication={publication} />
        </div>
    )
}