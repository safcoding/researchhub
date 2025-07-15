import { LabForm } from "../_components/labForm";
import { BackButton } from "@/components/backButton";

export default async function AddLabPage(){
    return(
        <div className="space-y-6">
            <div className="space-y-4">
                <BackButton />
                <h1 className="text-2xl font-bold">Add New Lab</h1>
            </div>
            <LabForm />
        </div>
    )
}