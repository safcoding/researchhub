import { getPartners } from "@/features/public/events/server/events"
import { EventGrid } from "@/features/public/events/components/eventGrid"
import Link from "next/link"


export default async function PartnersPage() {

  const { data: partners } = await getPartners()
  
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