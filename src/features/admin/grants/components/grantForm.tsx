"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addGrant, editGrant } from "../server/grants"
import { useFormStatus, } from "react-dom"
import { useFormState } from "react-dom"
import { grant } from "@prisma/client"

export function GrantForm( {grant }: { grant?: grant} ){

    const [formState, action] = useFormState( grant ==  null ? addGrant : editGrant.bind(null, grant.grant_id), {})

    return <form action={action} className="space-y-8">
        <div className="space-y-2">
            <Label htmlFor="project_id">Project ID</Label>
            <Input type="text" id="project_id" name="project_id" required defaultValue={grant?.project_id || ""} />
            {formState.errors?.project_id && (
                <div className="text-destructive text-sm">{formState.errors.project_id[0]}</div>
            )}
        </div>

        <div className="space-y-2">
            <Label htmlFor="project_title">Project Title</Label>
            <Input type="text" id="project_title" name="project_title" defaultValue={grant?.project_title || ""} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="pro_date_start">Project Start Date</Label>
            <Input type="date" id="pro_date_start" name="pro_date_start" defaultValue={grant?.pro_date_start ? new Date(grant.pro_date_start).toISOString().split('T')[0] : ""} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="pro_date_end">Project End Date</Label>
            <Input type="date" id="pro_date_end" name="pro_date_end" defaultValue={grant?.pro_date_end ? new Date(grant.pro_date_end).toISOString().split('T')[0] : ""} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="cost_center_code">Cost Center Code</Label>
            <Input type="text" id="cost_center_code" name="cost_center_code" defaultValue={grant?.cost_center_code || ""} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="pl_staff_no">Project Leader Staff Number</Label>
            <Input type="number" id="pl_staff_no" name="pl_staff_no" defaultValue={grant?.pl_staff_no?.toString() || ""} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="pl_name">Project Leader Name</Label>
            <Input type="text" id="pl_name" name="pl_name" defaultValue={grant?.pl_name || ""} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="ptj_research_alliance"> Research Alliance</Label>
            <Input type="text" id="ptj_research_alliance" name="ptj_research_alliance" defaultValue={grant?.ptj_research_alliance || ""} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="research_group">Research Group</Label>
            <Input type="text" id="research_group" name="research_group" defaultValue={grant?.research_group || ""} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="type">Grant Type</Label>
            <Select name="type" defaultValue={grant?.type || ""} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select publication type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="University Grant">University Grant</SelectItem>
                    <SelectItem value="Government Grant">Government Grant</SelectItem>
                    <SelectItem value="Industrial Grant">Industrial Grant</SelectItem>
                    <SelectItem value="Research Contract">Research Contract</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
            </Select>
            {formState.errors?.type && (
                <div className="text-destructive text-sm">{formState.errors.type[0]}</div>
            )}
        </div>

        <div className="space-y-2">
            <Label htmlFor="status">Grant Status</Label>
            <Select name="status" defaultValue={grant?.status || ""} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select Grant Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
            </Select>
            {formState.errors?.status && (
                <div className="text-destructive text-sm">{formState.errors.status[0]}</div>
            )}
        </div>

        <div className="space-y-2">
            <Label htmlFor="sponsor_name">Sponsor Name</Label>
            <Input type="text" id="sponsor_name" name="sponsor_name" defaultValue={grant?.sponsor_name || ""} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="sponsor_category">Sponsor  Category</Label>
            <Select name="sponsor_category" defaultValue={grant?.sponsor_category || ""} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select Sponsor Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="University">University</SelectItem>
                    <SelectItem value="Industry">Industry</SelectItem>
                    <SelectItem value="International">International</SelectItem>
                </SelectContent>
            </Select>
            {formState.errors?.sponsor_category && (
                <div className="text-destructive text-sm">{formState.errors.sponsor_category[0]}</div>
            )}
        </div>

        <div className="space-y-2">
            <Label htmlFor="subsponsor_name">Sub-sponsor Name</Label>
            <Input type="text" id="subsponsor_name" name="subsponsor_name" defaultValue={grant?.subsponsor_name || ""} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="approved_amount">Approved Amount</Label>
            <Input type="number" step="0.01" id="approved_amount" name="approved_amount" defaultValue={grant?.approved_amount?.toString() || ""} />
            {formState.errors?.approved_amount && (
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