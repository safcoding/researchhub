"use client"

import { useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { EquipmentFilterSearch } from "@/features/admin/labs/components/equipmentFilter"

export function LabsSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [labQuery, setLabQuery] = useState(searchParams.get("query") || "")
  const [equipmentQuery, setEquipmentQuery] = useState(searchParams.get("equipment_query") || "")

  const updateSearch = (labSearch: string, equipmentSearch: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams.toString())
      
      if (labSearch.trim()) {
        newParams.set("query", labSearch.trim())
      } else {
        newParams.delete("query")
      }
      
      if (equipmentSearch.trim()) {
        newParams.set("equipment_query", equipmentSearch.trim())
      } else {
        newParams.delete("equipment_query")
      }
      
      newParams.set("page", "1") // Reset to first page
      
      router.push(`${pathname}?${newParams.toString()}`)
    })
  }

  const handleLabSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearch(labQuery, equipmentQuery)
  }

  const clearSearch = () => {
    setLabQuery("")
    setEquipmentQuery("")
    updateSearch("", "")
  }

  const hasActiveSearch = labQuery.trim() || equipmentQuery.trim()

  return (
    <div className="space-y-4">
      <form onSubmit={handleLabSearch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search labs by name..."
            value={labQuery}
            onChange={(e) => setLabQuery(e.target.value)}
            className="pl-10 pr-12"
          />
        </div>

        <div>
          <EquipmentFilterSearch
            value={equipmentQuery}
            onChange={setEquipmentQuery}
            placeholder="Search labs by equipment..."
          />
        </div>

        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={isPending}
            className="flex-1"
          >
            <Search className="h-4 w-4 mr-2" />
            {isPending ? "Searching..." : "Search Labs"}
          </Button>
          
          {hasActiveSearch && (
            <Button 
              type="button" 
              variant="outline"
              onClick={clearSearch}
              disabled={isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </form>

      {hasActiveSearch && (
        <div className="flex flex-wrap gap-2">
          {labQuery.trim() && (
            <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span>Lab: "{labQuery.trim()}"</span>
              <button
                onClick={() => {
                  setLabQuery("")
                  updateSearch("", equipmentQuery)
                }}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {equipmentQuery.trim() && (
            <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              <span>Equipment: "{equipmentQuery.trim()}"</span>
              <button
                onClick={() => {
                  setEquipmentQuery("")
                  updateSearch(labQuery, "")
                }}
                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}