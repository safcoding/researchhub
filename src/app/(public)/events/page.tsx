import { getEvents } from "@/features/public/events/server/events"
import { EventGrid } from "@/features/public/events/components/eventGrid"
import { EventSearch } from "@/features/public/events/components/searchBars"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const EVENT_CATEGORIES = [
  { value: 'all', label: 'All Events' },
  { value: 'Conference', label: 'Conference' },
  { value: 'Grant', label: 'Grant' },
  { value: 'Competition', label: 'Competition' },
  { value: 'Seminar', label: 'Seminar' },
  { value: 'Workshop', label: 'Workshop' },
]

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    pageSize?: string; 
    query?: string;
    category?: string; 
  }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 9
  const query = params.query || ''
  const category = params.category || 'all'
  const { data: events, totalCount } = await getEvents(page, pageSize, query, category)
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">All Events</h1>

        <div className="max-w-md mx-auto">
          <Suspense fallback={<div>Loading search...</div>}>
            <EventSearch />
          </Suspense>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {EVENT_CATEGORIES.map((eventCategory) => (
            <Button
              key={eventCategory.value}
              variant={category === eventCategory.value ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link
                href={`/events?category=${eventCategory.value}&page=1${query ? `&query=${encodeURIComponent(query)}` : ''}`}
                className="no-underline"
              >
                {eventCategory.label}
              </Link>
            </Button>
          ))}
        </div>

        {(query || category !== 'all') && (
          <div className="text-sm text-gray-600">
            {totalCount > 0 
              ? `Found ${totalCount} results ${query ? `for "${query}"` : ''} ${category !== 'all' ? `in ${category}` : ''}`
              : `No results found ${query ? `for "${query}"` : ''} ${category !== 'all' ? `in ${category}` : ''}`
            }
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {query || category !== 'all' 
              ? `No events found matching your criteria` 
              : "No events available at the moment."
            }
          </p>
        </div>
      ) : (
        <Suspense fallback={<div className="text-center">Loading events...</div>}>
          <EventGrid
            events={events}
            page={page}
            pageSize={pageSize}
            totalCount={totalCount} 
          />
        </Suspense>
      )}
    </div>
  )
}