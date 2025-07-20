import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns } from "../../../features/admin/grants/components/columns"
import { DataTable } from "../_shared/data-table";
import db from "@/db/db";
import { Plus } from "lucide-react";
import GrantFilterCard from "../../../features/admin/grants/components/GrantFilterCard";
import { ExcelExportButton } from "@/features/admin/grants/components/exportExcel";

async function getData(
  page: number = 1, 
  pageSize: number = 10, 
  query?: string,
  type?: string,
  status?: string,
  sponsor_category?: string,
  date_from?: string,
  date_to?: string,
) {
  const skip = (page - 1) * pageSize
  const where: any = {}

  if (query) {
    where.OR = [
      {
        project_title: {
          contains: query,
          mode: 'insensitive' as const,
        },
      },
    ]
  }

  if (type && type !== 'any') {
    if (type === 'Others') {
      where.type = {
        notIn: [
          'UNIVERSITY GRANT',
          'GOVERNMENT GRANT', 
          'INDUSTRIAL GRANT',
          'RESEARCH CONTRACT'
        ]
      }
    } else {
      where.type = {
        equals: type,
        mode: 'insensitive' as const,
      }
    }
  }

  if (status && status !== 'any') {
    where.status = {
      equals: status,
      mode: 'insensitive' as const,
    }
  }

  if (sponsor_category && sponsor_category !== 'any') {
    where.sponsor_category = {
      equals: sponsor_category,
      mode: 'insensitive' as const,
    }
  }
if (date_from || date_to) {
  where.pro_date_start = {}
  
  if (date_from && date_from.trim() !== '') {
    const fromDate = new Date(date_from)
    if (!isNaN(fromDate.getTime())) {  
      where.pro_date_start.gte = fromDate
    }
  }
  
  if (date_to && date_to.trim() !== '') {
    const toDate = new Date(date_to)
    if (!isNaN(toDate.getTime())) {  
      where.pro_date_start.lte = toDate
    }
  }
  if (Object.keys(where.pro_date_start).length === 0) {
    delete where.pro_date_start
  }
}

  const totalCount = await db.grant.count({ where })
  const grants = await db.grant.findMany({
    where,
    select: {
      grant_id: true,
      project_id: true, 
      project_title: true, 
      approved_amount: true, 
      type: true, 
      sponsor_category: true, 
      sponsor_name: true, 
      subsponsor_name: true, 
      status: true, 
      pro_date_start: true  
    },
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: pageSize,
  })

  return { data: grants, totalCount }
}

export default async function GrantAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    pageSize?: string; 
    query?: string;
    type?: string;
    status?: string;
    sponsor_category?: string;
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
  const sponsor_category = params.sponsor_category || ''
  const date_from = params.date_from || ''
  const date_to = params.date_to || ''

  const { data: grants, totalCount } = await getData(
    page, 
    pageSize, 
    query, 
    type, 
    status, 
    sponsor_category,
    date_from,
    date_to,
  )
  
  return (
    <div className="space-y-4">
      <GrantFilterCard />
      <div className="flex items-center justify-between gap-4">
        <Button asChild>
          <Link href="/admin/grants/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Grant
          </Link>
        </Button>

        <ExcelExportButton
          query={query}
          type={type}
          status={status}
          sponsor_category={sponsor_category}
          date_from={date_from}
          date_to={date_to}
          totalCount={totalCount}
        />
      </div>

      {(query || type || status || sponsor_category) && (
        <div className="text-sm text-gray-600">
          {totalCount > 0 
            ? `Found ${totalCount} results` 
            : `No results found`
          }
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
          data={grants}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
}