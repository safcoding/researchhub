import { GrantForm } from "../_components/grantForm";
import { BackButton } from "@/components/backButton";
export default function AddGrantPage(){
    return(
        <div className="space-y-6">
            <div className="space-y-4">
                <BackButton />
                <h1 className="text-2xl font-bold">Add New Publication</h1>
            </div>
        <GrantForm />
    </div>
    )
}