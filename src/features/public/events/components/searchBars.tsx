"use client"

import { useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export function EventSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [eventQuery, setEventQuery] = useState(searchParams.get("query") || "")

  const updateSearch = (eventSearch: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams.toString())
      
      if (eventSearch.trim()) {
        newParams.set("query", eventSearch.trim())
      } else {
        newParams.delete("query")
      }
      
      newParams.set("page", "1") 
      
      router.push(`${pathname}?${newParams.toString()}`)
    })
  }

  const handleEventSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearch(eventQuery)
  }

  const clearSearch = () => {
    setEventQuery("")
    updateSearch("")
  }

  const hasActiveSearch = eventQuery.trim()

  return (
    <div className="space-y-4">
      <form onSubmit={handleEventSearch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search events by title or description..."
            value={eventQuery}
            onChange={(e) => setEventQuery(e.target.value)}
            className="pl-10 pr-12"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={isPending}
            className="flex-1"
          >
            <Search className="h-4 w-4 mr-2" />
            {isPending ? "Searching..." : "Search Events"}
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
          {eventQuery.trim() && (
            <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span>Event: "{eventQuery.trim()}"</span>
              <button
                onClick={() => {
                  setEventQuery("")
                  updateSearch("")
                }}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
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