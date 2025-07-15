import { PublicationForm } from "../../../../features/admin/publications/components/publicationForm";
import { BackButton } from "@/components/backButton";

export default function AddPublicationPage(){
    return(
        <div className="space-y-6">
            <div className="space-y-4">
                <BackButton />
                <h1 className="text-2xl font-bold">Add New Publication</h1>
            </div>
            <PublicationForm />
        </div>
    )
}