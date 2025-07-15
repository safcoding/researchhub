import db from "@/db/db";
import Search from "@/components/ui/search";
import { Suspense } from "react";
import { EventGrid } from "./_components/eventGrid";

interface Event {
  event_id: string
  title: string
  description: string
  date: Date
  time?: string | null
  location?: string | null
  image?: string | null
  category: string
  organizer: string | null
}

async function getData(page: number = 1, pageSize: number = 9, query?: string) {
  const skip = (page - 1) * pageSize

  const where = query ? {
    OR: [
      {
        title: {
          contains: query,
          mode: 'insensitive' as const,
        },
      },
    ],
  } : {}
  
  const totalCount = await db.event.count()

  const events = await db.event.findMany({

    select: {
      event_id: true,
      title: true,
      description: true,
      date: true,
      time: true,
      location: true,
      image: true,
      category: true,
      organizer: true
    },
    orderBy: { date: 'asc' }, 
    skip: skip,
    take: pageSize,
  })

  return {
    data: events,
    totalCount
  }
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; query?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 9
  const query = params.query || ''
  const { data: events, totalCount } = await getData(page, pageSize, query)
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">All Events</h1>
        
        <div className="flex items-center justify-center gap-4">
          <Suspense fallback={<div>Loading search...</div>}>
            <Search placeholder="Search events by title." />
          </Suspense>
        </div>

        {query && (
          <div className="text-sm text-gray-600">
            {totalCount > 0 
              ? `Found ${totalCount} results for "${query}"` 
              : `No results found for "${query}"`
            }
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {query ? `No events found matching "${query}"` : "No events available at the moment."}
          </p>
        </div>
      ) : (
        <>
          <EventGrid
          events={events}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount} 
          />
        </>
      )}
    </div>
  )
}