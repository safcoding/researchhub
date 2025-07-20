import { PublicationForm } from "../../../../features/admin/publications/components/publicationForm";
import { BackButton } from "@/components/backButton";

export default function AddPublicationPage(){
    return(
        <div className="space-y-6">
            <div className="space-y-4">
                <BackButton />
                <h1 className="text-2xl font-bold">Add New Publication</h1>
                Fields with <span className="text-red-500">*</span> are required fields.
            </div>
            <PublicationForm />
        </div>
    )
}