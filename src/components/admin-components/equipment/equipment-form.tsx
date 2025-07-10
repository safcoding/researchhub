"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FormField } from '@/components/reusable/formfield'
import { X } from "lucide-react"
import { type Equipment } from '@/hooks/logic/equipment-logic'

interface EquipmentFormModalProps {
  equipment?: Equipment
  onSave: (equipment: Partial<Equipment>) => void
  onClose: () => void
}

export function EquipmentFormModal({ equipment, onSave, onClose }: EquipmentFormModalProps) {
  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: '',
  })

  // Load equipment data if we're editing
  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
      })
    }
  }, [equipment])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {equipment ? 'Edit Equipment' : 'Add New Equipment'}
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField
            label="Equipment Name"
            type="text"
            name="name"
            placeholder="Enter equipment name"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {equipment ? 'Update Equipment' : 'Add Equipment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
