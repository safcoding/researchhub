"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addLab, editLab } from "../server/labs"
import { useFormStatus, useFormState } from "react-dom"
import { useState } from "react"
import { lab, equipment } from "@prisma/client"
import { EquipmentSearch } from "./searchEquipment"
import { SelectedEquipmentItem } from "./selectEquipment"

interface FormState {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

type LabWithEquipment = lab & {
  lab_equipment: Array<{
    equipment_id: string;
    quantity: number;
    equipment: equipment;
  }>;
}

interface LabFormProps {
  lab?: LabWithEquipment;
}

export function LabForm({ lab }: LabFormProps) {
    const [formState, action] = useFormState(
        lab == null ? addLab : editLab.bind(null, lab.lab_id), 
        { message: "", errors: {} } as FormState
    )
    const [selectedEquipment, setSelectedEquipment] = useState<Array<{
        equipment_id: string;
        quantity: number;
    }>>(
        lab?.lab_equipment.map(le => ({
            equipment_id: le.equipment_id,
            quantity: le.quantity
        })) || []
    )


    const removeEquipmentRow = (index: number) => {
        setSelectedEquipment(selectedEquipment.filter((_, i) => i !== index))
    }

    const updateEquipment = (index: number, field: 'equipment_id' | 'quantity', value: string | number) => {
        const updated = [...selectedEquipment]
        updated[index] = { ...updated[index], [field]: value }
        setSelectedEquipment(updated)
    }

    return (
        <form action={action} className="space-y-8">
            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="lab_name">Lab Name <span className="text-red-500">*</span></Label>
                        <Input 
                            type="text" 
                            id="lab_name" 
                            name="lab_name" 
                            required 
                            defaultValue={lab?.lab_name || ""} 
                        />
                        {formState.errors?.lab_name && (
                            <div className="text-destructive text-sm">{formState.errors.lab_name[0]}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Lab Type <span className="text-red-500">*</span></Label>
                        <Select name="type" defaultValue={lab?.type || ""} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select lab type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="i-Kohza">i-Kohza</SelectItem>
                                <SelectItem value="Research Lab">Research Lab</SelectItem>
                                <SelectItem value="Satellite Lab">Satellite Lab</SelectItem>
                                <SelectItem value="Teaching Lab">Teaching Lab</SelectItem>
                                <SelectItem value="Service Lab">Service Lab</SelectItem>
                            </SelectContent>
                        </Select>
                        {formState.errors?.type && (
                            <div className="text-destructive text-sm">{formState.errors.type[0]}</div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="lab_head">Lab Head</Label>
                        <Input 
                            type="text" 
                            id="lab_head" 
                            name="lab_head" 
                            defaultValue={lab?.lab_head || ""} 
                        />
                        {formState.errors?.lab_head && (
                            <div className="text-destructive text-sm">{formState.errors.lab_head[0]}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Contact Email</Label>
                        <Input 
                            type="email" 
                            id="email" 
                            name="email" 
                            defaultValue={lab?.email || ""} 
                        />
                        {formState.errors?.email && (
                            <div className="text-destructive text-sm">{formState.errors.email[0]}</div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contact_phone">Contact Phone</Label>
                        <Input 
                            type="tel" 
                            id="contact_phone" 
                            name="contact_phone" 
                            defaultValue={lab?.contact_phone || ""} 
                        />
                        {formState.errors?.contact_phone && (
                            <div className="text-destructive text-sm">{formState.errors.contact_phone[0]}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                            type="text" 
                            id="location" 
                            name="location" 
                            placeholder="Building, Room, Floor, etc."
                            defaultValue={lab?.location || ""} 
                        />
                        {formState.errors?.location && (
                            <div className="text-destructive text-sm">{formState.errors.location[0]}</div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="research_area">Research Area</Label>
                        <Input 
                            type="text" 
                            id="research_area" 
                            name="research_area" 
                            placeholder="e.g., Biochemistry, Materials Science"
                            defaultValue={lab?.research_area || ""} 
                        />
                        {formState.errors?.research_area && (
                            <div className="text-destructive text-sm">{formState.errors.research_area[0]}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={lab?.status || ""}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Under Maintenance">Inactive</SelectItem>
                                <SelectItem value="Unavailable">Unavailable</SelectItem>
                            </SelectContent>
                        </Select>
                        {formState.errors?.status && (
                            <div className="text-destructive text-sm">{formState.errors.status[0]}</div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                        id="description" 
                        name="description" 
                        placeholder="Describe the lab's purpose, capabilities, and focus areas..."
                        rows={4}
                        defaultValue={lab?.description || ""} 
                    />
                    {formState.errors?.description && (
                        <div className="text-destructive text-sm">{formState.errors.description[0]}</div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold">Lab Equipment</h2>
                    <p className="text-sm text-gray-600">Search and add equipment to this lab</p>
                </div>

                <div className="space-y-4">
                    <Label>Add Equipment</Label>
                    <EquipmentSearch 
                        onSelect={(equipment) => {
                            setSelectedEquipment([...selectedEquipment, {
                                equipment_id: equipment.equipment_id,
                                quantity: 1
                            }])
                        }}
                        selectedEquipmentIds={selectedEquipment.map(eq => eq.equipment_id)}
                    />
                </div>

                {selectedEquipment.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500">No equipment added yet</p>
                        <p className="text-sm text-gray-400 mt-1">Search for equipment above to add to this lab</p>
                    </div>
                )}
                
                {selectedEquipment.map((item, index) => (
                    <SelectedEquipmentItem 
                        key={index}
                        item={item}
                        index={index}
                        onUpdateQuantity={(quantity) => updateEquipment(index, 'quantity', quantity)}
                        onRemove={() => removeEquipmentRow(index)}
                    />
                ))}
                
                {formState.errors?.equipment && (
                    <div className="text-destructive text-sm">{formState.errors.equipment[0]}</div>
                )}
            </div>

            <SubmitButton/>
        </form>
    )
}

function SubmitButton(){
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
            {pending ? "Saving..." : "Save Lab"}
        </Button>
    )
}