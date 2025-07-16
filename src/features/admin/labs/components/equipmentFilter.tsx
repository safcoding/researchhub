"use client"

import { useState, useEffect, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { searchEquipment } from "../server/equipment"

interface EquipmentFilterSearchProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function EquipmentFilterSearch({ value, onChange, placeholder = "Search by equipment name..." }: EquipmentFilterSearchProps) {
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        const performSearch = () => {
            if (value.length < 2) {
                setSuggestions([])
                setShowSuggestions(false)
                return
            }

            startTransition(async () => {
                try {
                    const searchResults = await searchEquipment(value, []) // No exclusions for filter
                    setSuggestions(searchResults.slice(0, 5)) // Limit to 5 suggestions
                    setShowSuggestions(true)
                } catch (error) {
                    console.error('Search error:', error)
                    setSuggestions([])
                }
            })
        }

        const debounceTimer = setTimeout(performSearch, 300)
        return () => clearTimeout(debounceTimer)
    }, [value])

    const handleSelect = (equipmentName: string) => {
        onChange(equipmentName)
        setShowSuggestions(false)
    }

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-10"
                    onFocus={() => value.length >= 2 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
            </div>
            
            {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {isPending ? (
                        <div className="p-2 text-center text-gray-500 text-sm">Searching...</div>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((equipment) => (
                            <button
                                key={equipment.equipment_id}
                                type="button"
                                className="w-full text-left p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-sm"
                                onClick={() => handleSelect(equipment.name)}
                            >
                                <div className="font-medium">{equipment.name}</div>
                            </button>
                        ))
                    ) : (
                        <div className="p-2 text-center text-gray-500 text-sm">No equipment found</div>
                    )}
                </div>
            )}
        </div>
    )
}