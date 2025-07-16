import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns } from "../../../features/admin/events/components/columns"
import { DataTable } from "../_shared/data-table";
import db from "@/db/db";
import { Plus } from "lucide-react";
import EventFilterCard from "@/features/admin/events/components/eventsFilterCard";

async function getData(
  page: number = 1, 
  pageSize: number = 10, 
  query?: string,
  category?: string,
  status?: string,
  priority?: string,
) {
  const skip = (page - 1) * pageSize
  const where: any = {}

  if (query) {
    where.OR = [
      {
        title: {
          contains: query,
          mode: 'insensitive' as const,
        },
      },
    ]
  }

  if (category && category !== 'any') {
    where.category = {
      equals: category,
      mode: 'insensitive' as const,
    }
  }

  if (status && status !== 'any') {
    where.status = {
      equals: status,
      mode: 'insensitive' as const,
    }
  }

  if (priority && priority !== 'any') {
    where.priority = {
      equals: priority,
      mode: 'insensitive' as const,
    }
  }

  const totalCount = await db.event.count({ where })
  const events = await db.event.findMany({
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
      priority: true,
    },
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: pageSize,
  })

  return { data: events, totalCount }
}

export default async function EventAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    pageSize?: string; 
    query?: string;
    category?: string;
    status?: string;
    priority?: string;
  }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 10
  const query = params.query || ''
  const category = params.category || ''
  const status = params.status || ''
  const priority = params.priority || ''

  const { data: events, totalCount } = await getData(
    page, 
    pageSize, 
    query, 
    category, 
    status, 
    priority
  )
  
  return (
    <div className="space-y-4">
      <EventFilterCard />
      
      <div className="flex items-center justify-between gap-4">
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Link>
        </Button>
      </div>

      {(query || category || status || priority) && (
        <div className="text-sm text-gray-600">
          {totalCount > 0 
            ? `Found ${totalCount} results` 
            : `No results found`
          }
        </div>
      )}

      <div className="overflow-x-auto">
        <DataTable 
          columns={columns} 
          data={events}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
}