import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns } from "../../../features/admin/publications/components/columns"
import { DataTable } from "../_shared/data-table";
import db from "@/db/db";

import { Plus } from "lucide-react"
import PublicationFilterCard from "@/features/admin/publications/components/PublicationFilterCard";
import { ExcelExportButton } from "@/features/admin/publications/components/exportExcel";

async function getData(
  page: number = 1, 
  pageSize: number = 10, 
  query?: string,
  type?: string,
  status?: string,
  category?: string,
  date_from?: string,
  date_to?: string,
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

    if (status && status !== 'any') {
    where.status = {
      equals: status,
      mode: 'insensitive' as const,
    }
  }
     if (category && category !== 'any') {
    where.category = {
      equals: category,
      mode: 'insensitive' as const,
    }
  }
     if (type && type !== 'any') {
    where.type = {
      equals: type,
      mode: 'insensitive' as const,
    }
  }
    if (date_from || date_to) {
      where.date = {}
      
      if (date_from && date_from.trim() !== '') {
        const fromDate = new Date(date_from)
        if (!isNaN(fromDate.getTime())) { 
          where.date.gte = fromDate
        }
      }
      
      if (date_to && date_to.trim() !== '') {
        const toDate = new Date(date_to)
        if (!isNaN(toDate.getTime())) {   
          where.date.lte = toDate
        }
      }

      if (Object.keys(where.date).length === 0) {
        delete where.date
      }
    }

  const totalCount = await db.publication.count({ where })

    const publication = await  db.publication.findMany({
      where,
      select: {
        publication_id: true,
        pub_refno: true, 
        title: true, 
        journal: true, 
        type: true, 
        category: true, 
        level: true, 
        date: true, 
        status: true, 
      },
      orderBy:{ createdAt: 'desc'},
      skip: skip,
      take: pageSize,
      })

      return {
        data: publication, totalCount}
  }

export default async function PubblicationAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    pageSize?: string; 
    query?: string;
    type?: string;
    status?: string;
    category?: string;
    date_from?: string;
    date_to?: string;
  }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 10
  const query = params.query || ''
  const type = params.type || ''
  const status = params.status || ''
  const category = params.category || ''
  const date_from = params.date_from || ''
  const date_to = params.date_to || ''

  const { data: publication, totalCount } = await getData(
    page, 
    pageSize, 
    query, 
    type, 
    status, 
    category,
    date_from,
    date_to,
  )
  
  return (
    <div className="space-y-4">
      <PublicationFilterCard/>
      <div className="flex items-center justify-between gap-4">
        <Button asChild>
          <Link href="/admin/publications/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Publication
          </Link>
        </Button>
        
        <ExcelExportButton
          query={query}
          type={type}
          status={status}
          category={category}
          date_from={date_from}
          date_to={date_to}
          totalCount={totalCount}
        />
      </div>

      {(query || type || status || category || date_from || date_to) && (
        <div className="text-sm text-gray-600">
          {totalCount > 0 
            ? `Found ${totalCount} results` 
            : `No results found`
          }
          {query && <span className="ml-2">• Search: &quot;{query}&quot;</span>}
          {type && type !== 'any' && <span className="ml-2">• Type: {type}</span>}
          {status && status !== 'any' && <span className="ml-2">• Status: {status}</span>}
          {category && category !== 'any' && <span className="ml-2">• Category: {category}</span>}
          {(date_from || date_to) && (
            <span className="ml-2">
              • Date range: {date_from || 'any'} to {date_to || 'any'}
            </span>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <DataTable 
          columns={columns} 
          data={publication}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
}