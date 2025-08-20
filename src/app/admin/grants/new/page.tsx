import { GrantForm } from "../../../../features/admin/grants/components/grantForm";
import { BackButton } from "@/components/backButton";
export default function AddGrantPage(){
    return(
        <div className="space-y-6">
            <div className="space-y-4">
                <BackButton />
                <h1 className="text-2xl font-bold">Add New Grant</h1>
                Fields with <span className="text-red-500">*</span> are required fields.
            </div>
        <GrantForm />
    </div>
    )
}