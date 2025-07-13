"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addGrant } from "../../_actions/grants"
import { useFormStatus, } from "react-dom"
import { useFormState } from "react-dom"

export function GrantForm(){
//error handling not added
    const [formState, action] = useFormState(addGrant, {})

    return <form action={action} className="space-y-8">
        <div className="space-y-2">
            <Label htmlFor="project_id">Project ID</Label>
            <Input type="text" id="project_id" name="project_id" required />
            {formState.errors?.project_id && (
                <div className="text-destructive text-sm">{formState.errors.project_id[0]}</div>
            )}
        </div>

        <div className="space-y-2">
            <Label htmlFor="project_title">Project Title</Label>
            <Input type="text" id="project_title" name="project_title" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="pro_date_start">Project Start Date</Label>
            <Input type="date" id="pro_date_start" name="pro_date_start" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="pro_date_end">Project End Date</Label>
            <Input type="date" id="pro_date_end" name="pro_date_end" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="cost_center_code">Cost Center Code</Label>
            <Input type="text" id="cost_center_code" name="cost_center_code" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="pl_staff_no">Project Leader Staff Number</Label>
            <Input type="number" id="pl_staff_no" name="pl_staff_no" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="pl_name">Project Leader Name</Label>
            <Input type="text" id="pl_name" name="pl_name" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="ptj_research_alliance"> Research Alliance</Label>
            <Input type="text" id="ptj_research_alliance" name="ptj_research_alliance" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="research_group">Research Group</Label>
            <Input type="text" id="research_group" name="research_group" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="type">Grant Type</Label>
            <Input type="text" id="type" name="type" />
            {formState.errors?.project_id && (
                <div className="text-destructive text-sm">{formState.errors.type[0]}</div>
            )}
        </div>

        <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input type="text" id="status" name="status" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="sponsor_name">Sponsor Name</Label>
            <Input type="text" id="sponsor_name" name="sponsor_name" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="sponsor_category">Sponsor Category</Label>
            <Input type="text" id="sponsor_category" name="sponsor_category" />
            {formState.errors?.project_id && (
                <div className="text-destructive text-sm">{formState.errors.sponsor_category[0]}</div>
            )}
        </div>

        <div className="space-y-2">
            <Label htmlFor="subsponsor_name">Sub-sponsor Name</Label>
            <Input type="text" id="subsponsor_name" name="subsponsor_name" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="approved_amount">Approved Amount</Label>
            <Input type="number" step="0.01" id="approved_amount" name="approved_amount" />
            {formState.errors?.project_id && (
                <div className="text-destructive text-sm">{formState.errors.approved_amount[0]}</div>
            )}
        </div>
        <SubmitButton/>
    </form>
}

function SubmitButton(){
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save"}</Button>
    )

}