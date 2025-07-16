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
import { addPublication, editPublication } from "../server/publications"
import { useFormStatus, } from "react-dom"
import { useFormState } from "react-dom"
import { publication } from "@prisma/client"
import { useState } from "react"

export function PublicationForm( {publication }: { publication?: publication} ){
    const [selectedType, setSelectedType] = useState(publication?.type && ![
        "Book Chapter",
        "Original Book", 
        "Scopus'",
        "Web of Science",
        "Conference Paper",
        "Proceedings"
    ].includes(publication.type) ? "Others" : publication?.type || "");
    const [otherType, setOtherType] = useState(
        publication?.type && ![
            "Book Chapter",
            "Original Book", 
            "Scopus'",
            "Web of Science",
            "Conference Paper",
            "Proceedings"
        ].includes(publication.type) ? publication.type : ""
    );

    const [selectedCategory, setSelectedCategory] = useState(publication?.category && ![
        "Indexed Publication",
        "Non-Indexed Publication"
    ].includes(publication.category) ? "Others" : publication?.category || "");
    const [otherCategory, setOtherCategory] = useState(
        publication?.category && ![
            "Indexed Publication",
            "Non-Indexed Publication"
        ].includes(publication.category) ? publication.category : ""
    );

    const [formState, action] = useFormState(
        async (prevState: any, formData: FormData) => {

            if (formData.get("type") === "Others") {
                formData.set("type", formData.get("other_type") as string);
            }

            if (formData.get("category") === "Others") {
                formData.set("category", formData.get("other_category") as string);
            }

            formData.delete("other_type");
            formData.delete("other_category");
            
            return publication == null
                ? await addPublication(prevState, formData)
                : await editPublication(publication.publication_id, prevState, formData);
        },
        {}
    );

    return (
        <form action={action} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="pub_refno">Publication Reference Number</Label>
                <Input type="text" id="pub_refno" name="pub_refno" required defaultValue={publication?.pub_refno || ""} />
                {formState.errors?.pub_refno && (
                    <div className="text-destructive text-sm">{formState.errors.pub_refno[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="title">Publication Title</Label>
                <Input type="text" id="title" name="title" required defaultValue={publication?.title || ""} />
                {formState.errors?.title && (
                    <div className="text-destructive text-sm">{formState.errors.title[0]}</div>
                )}
            </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={publication?.status || ""} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select publication status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="VERIFIED">VERIFIED</SelectItem>
                            <SelectItem value="VERIFIED (WAITING FOR INDEXING IN SCOPUS/WOS)">VERIFIED (WAITING FOR INDEXING IN SCOPUS/WOS)</SelectItem>
                        </SelectContent>
                    </Select>
                    {formState.errors?.status && (
                        <div className="text-destructive text-sm">{formState.errors.status[0]}</div>
                    )}
                </div>

            <div className="space-y-2">
            <Label htmlFor="type">Publication Type</Label>
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
                <SelectItem value="Book Chapter">Book Chapter</SelectItem>
                <SelectItem value="Original Book">Original Book</SelectItem>
                <SelectItem value="Scopus'">Scopus</SelectItem>
                <SelectItem value="Web of Science">Web of Science</SelectItem>
                <SelectItem value="Conference Paper">Conference Paper</SelectItem>
                <SelectItem value="Proceedings">Proceedings</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
            </Select>
            {selectedType === "Others" && (
                <div className="mt-2">
                <Label htmlFor="other_type">Specify Publication Type</Label>
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
            </div>

            <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
                name="category"
                value={selectedCategory}
                onValueChange={value => {
                setSelectedCategory(value);
                if (value !== "Others") setOtherCategory("");
                }}
                required
            >
                <SelectTrigger>
                <SelectValue placeholder="Select publication category" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Indexed Publication">Indexed Publication</SelectItem>
                <SelectItem value="Non-Indexed Publication">Non-Indexed Publication</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
            </Select>
            {selectedCategory === "Others" && (
                <div className="mt-2">
                <Label htmlFor="other_category">Specify Category</Label>
                <Input
                    type="text"
                    id="other_category"
                    name="other_category"
                    value={otherCategory}
                    onChange={e => setOtherCategory(e.target.value)}
                    required
                />
                </div>
            )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="journal">Journal</Label>
                <Input type="text" id="journal" name="journal" required defaultValue={publication?.journal || ""} />
                {formState.errors?.journal && (
                    <div className="text-destructive text-sm">{formState.errors.journal[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="impact">Impact Factor</Label>
                <Input type="number" step="0.001" id="impact" name="impact" defaultValue={publication?.impact?.toString() || ""} />
                {formState.errors?.impact && (
                    <div className="text-destructive text-sm">{formState.errors.impact[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="date">Publication Date</Label>
                <Input type="date" id="date" name="date" required defaultValue={publication?.date ? new Date(publication.date).toISOString().split('T')[0] : ""} />
                {formState.errors?.date && (
                    <div className="text-destructive text-sm">{formState.errors.date[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Input type="text" id="level" name="level" required defaultValue={publication?.level || ""} />
                {formState.errors?.level && (
                    <div className="text-destructive text-sm">{formState.errors.level[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="author_id">Author ID</Label>
                <Input type="number" id="author_id" name="author_id" required defaultValue={publication?.author_id?.toString() || ""} />
                {formState.errors?.author_id && (
                    <div className="text-destructive text-sm">{formState.errors.author_id[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="author_name">Author Name</Label>
                <Input type="text" id="author_name" name="author_name" required defaultValue={publication?.author_name || ""} />
                {formState.errors?.author_name && (
                    <div className="text-destructive text-sm">{formState.errors.author_name[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="research_alliance">Research Alliance</Label>
                <Input type="text" id="research_alliance" name="research_alliance" defaultValue={publication?.research_alliance || ""} />
                {formState.errors?.research_alliance && (
                    <div className="text-destructive text-sm">{formState.errors.research_alliance[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="rg_name">Research Group Name</Label>
                <Input type="text" id="rg_name" name="rg_name" defaultValue={publication?.rg_name || ""} />
                {formState.errors?.rg_name && (
                    <div className="text-destructive text-sm">{formState.errors.rg_name[0]}</div>
                )}
            </div>
            <SubmitButton/>
        </form>
    )
}


function SubmitButton(){
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save"}</Button>
    )

}