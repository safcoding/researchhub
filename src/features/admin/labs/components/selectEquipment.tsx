"use client"

import { useState, useEffect, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { getEquipmentById } from "../server/equipment"

interface SelectedEquipmentItemProps {
    item: { equipment_id: string; quantity: number }
    index: number
    onUpdateQuantity: (quantity: number) => void
    onRemove: () => void
}

export function SelectedEquipmentItem({ item, index, onUpdateQuantity, onRemove }: SelectedEquipmentItemProps) {
    const [equipmentDetails, setEquipmentDetails] = useState<any>(null)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const details = await getEquipmentById(item.equipment_id)
            setEquipmentDetails(details)
        })
    }, [item.equipment_id])

    return (
        <div className="p-4 border rounded-lg">
            <div className="flex gap-4 items-center">
                <div className="flex-1">
                    {isPending ? (
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    ) : equipmentDetails ? (
                        <div>
                            <h4 className="font-medium">{equipmentDetails.name}</h4>
                        </div>
                    ) : (
                        <div className="text-red-500 text-sm">Error loading equipment details</div>
                    )}
                </div>
                
                <div className="w-32">
                    <Label htmlFor={`quantity_${index}`}>Quantity</Label>
                    <Input
                        type="number"
                        name="quantity"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity(parseInt(e.target.value) || 1)}
                        required
                    />
                </div>
                
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={onRemove}
                    className="text-red-600 hover:text-red-700"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
            
            {/* Hidden inputs for form submission */}
            <input type="hidden" name="equipment_id" value={item.equipment_id} />
        </div>
    )
}