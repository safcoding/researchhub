import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns, Event } from "./_components/columns"
import { DataTable } from "../_components/data-table";
import db from "@/db/db";
import Search from "@/components/ui/search";
import { Suspense } from "react";
import { Plus } from "lucide-react"

async function getData(page: number = 1, pageSize: number = 10, query?: string) {
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
  
  const totalCount = await db.event.count({ where })

    const event = await  db.event.findMany({
      where,
      select: {
        event_id: true,
        title: true, 
        description: true, 
        date: true,
        time: true,
        location: true,
        category: true,
        organizer: true, 
        status: true, 
        
      },
      orderBy:{ createdAt: 'desc'},
      skip: skip,
      take: pageSize,
      })
      console.log('Events data:', event)
      console.log('Search query:', query)

      return {
        data: event,
        totalCount
      }
  }


/*TODO
  -ADD FILTER BY TYPE,SPONSOR CATEGORY, STATUS, DATE
  -ADD BACK BUTTON IN EDIT PAGE USING BREADCRUMBS?
*/

export default async function EventAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; query?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 10
  const query = params.query || ''
  const { data: event, totalCount } = await getData(page, pageSize, query)
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Suspense fallback={<div>Loading search...</div>}>
          <Search placeholder="Search by event title..." />
        </Suspense>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" />
            Add event
          </Link>
        </Button>
      </div>

      {query && (
        <div className="text-sm text-gray-600">
          {totalCount > 0 
            ? `Found ${totalCount} results for "${query}"` 
            : `No results found for "${query}"`
          }
        </div>
      )}

      <div className="overflow-x-auto">
        <DataTable 
          columns={columns} 
          data={event}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
}