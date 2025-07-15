"use client"

import { useState, useEffect, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { searchEquipment } from "../server/equipment"

interface EquipmentSearchProps {
    onSelect: (equipment: { equipment_id: string; name: string }) => void
    selectedEquipmentIds: string[]
}

export function EquipmentSearch({ onSelect, selectedEquipmentIds }: EquipmentSearchProps) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [showResults, setShowResults] = useState(false)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        const performSearch = () => {
            if (query.length < 2) {
                setResults([])
                setShowResults(false)
                return
            }

            startTransition(async () => {
                try {
                    const searchResults = await searchEquipment(query, selectedEquipmentIds)
                    setResults(searchResults)
                    setShowResults(true)
                } catch (error) {
                    console.error('Search error:', error)
                    setResults([])
                }
            })
        }

        const debounceTimer = setTimeout(performSearch, 300)
        return () => clearTimeout(debounceTimer)
    }, [query, selectedEquipmentIds])

    const handleSelect = (equipment: any) => {
        onSelect(equipment)
        setQuery("")
        setShowResults(false)
    }

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="text"
                    placeholder="Search equipment by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                    onFocus={() => query.length >= 2 && setShowResults(true)}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
            </div>
            
            {showResults && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {isPending ? (
                        <div className="p-3 text-center text-gray-500">Searching...</div>
                    ) : results.length > 0 ? (
                        results.map((equipment) => (
                            <button
                                key={equipment.equipment_id}
                                type="button"
                                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                onClick={() => handleSelect(equipment)}
                            >
                                <div className="font-medium">{equipment.name}</div>
                            </button>
                        ))
                    ) : (
                        <div className="p-3 text-center text-gray-500">No equipment found</div>
                    )}
                </div>
            )}
        </div>
    )
}