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
import { useState } from "react"

export function GrantForm( {grant }: { grant?: grant} ){

    const [selectedType, setSelectedType] = useState(grant?.type && ![
        "UNIVERSITY GRANT",
        "GOVERNMENT GRANT",
        "INDUSTRIAL GRANT",
        "RESEARCH CONTRACT"
    ].includes(grant.type) ? "Others" : grant?.type || "");
    const [otherType, setOtherType] = useState(
        grant?.type && ![
            "UNIVERSITY GRANT",
            "GOVERNMENT GRANT",
            "INDUSTRIAL GRANT",
            "RESEARCH CONTRACT"
        ].includes(grant.type) ? grant.type : ""
    );

    const [formState, action] = useFormState(
        async (prevState: any, formData: FormData) => {
            // If "Others" is selected, use the manual type
            if (formData.get("type") === "Others") {
                formData.set("type", formData.get("other_type") as string);
            }
            // Remove the other_type field so it's not saved as a column
            formData.delete("other_type");
            return grant == null
                ? await addGrant(prevState, formData)
                : await editGrant(grant.grant_id, prevState, formData);
        },
        {}
    );


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
                <Select
                    name="type"
                    value={selectedType}
                    onValueChange={value => {
                        setSelectedType(value);
                        if (value !== "Others") setOtherType("");
                    }}
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select publication type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="UNIVERSITY GRANT">UNIVERSITY GRANT</SelectItem>
                        <SelectItem value="GOVERNMENT GRANT">GOVERNMENT GRANT</SelectItem>
                        <SelectItem value="INDUSTRIAL GRANT">INDUSTRIAL GRANT</SelectItem>
                        <SelectItem value="RESEARCH CONTRACT">RESEARCH CONTRACT</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                </Select>
                {selectedType === "Others" && (
                    <div className="mt-2">
                        <Label htmlFor="other_type">Specify Grant Type</Label>
                        <Input
                            type="text"
                            id="other_type"
                            name="other_type"
                            value={otherType}
                            onChange={e => setOtherType(e.target.value)}
                            required
                        />
                    </div>
                )}
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
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                    <SelectItem value="ENDED">ENDED</SelectItem>
                    <SelectItem value="TERMINATED">TERMINATED</SelectItem>
                    <SelectItem value="REACTIVATE WITH FINAL REPORT">REACTIVATE WITH FINAL REPORT</SelectItem>
                    <SelectItem value="END - NEED TO SUBMIT FINAL REPORT">END - NEED TO SUBMIT FINAL REPORT</SelectItem>
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
            <Label htmlFor="sponsor_category">Sponsor Category</Label>
            <Select name="sponsor_category" defaultValue={grant?.sponsor_category || ""} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select Sponsor Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="NATIONAL">NATIONAL</SelectItem>
                    <SelectItem value="UNIVERSITY">UNIVERSITY</SelectItem>
                    <SelectItem value="PRIVATE">PRIVATE</SelectItem>
                    <SelectItem value="INTERNATIONAL">INTERNATIONAL</SelectItem>
                    <SelectItem value="GOVERNMENT">GOVERNMENT</SelectItem>   
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