import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns } from "../../../features/admin/labs/components/columns"
import { DataTable } from "../_shared/data-table";
import db from "@/db/db";
import { Plus } from "lucide-react";
import LabFilterCard from "@/features/admin/labs/components/LabsFilterCard";

async function getData(
  page: number = 1, 
  pageSize: number = 10, 
  query?: string,
  equipment_query?: string,
  type?: string,
  status?: string,
) {
  const skip = (page - 1) * pageSize
  const where: any = {}
  const searchConditions = []

  if (query) {
    searchConditions.push({
      lab_name: {
        contains: query,
        mode: 'insensitive' as const,
      },
    })
  }
  
  if (equipment_query) {
    searchConditions.push({
      lab_equipment: {
        some: {
          equipment: {
            name: {
              contains: equipment_query,
              mode: 'insensitive' as const,
            }
          }
        }
      }
    })
  }

  if (searchConditions.length > 0) {
    where.OR = searchConditions
  }

  if (type && type !== 'any') {
    where.type = {
      equals: type,
      mode: 'insensitive' as const,
    }
  }

  if (status && status !== 'any') {
    where.status = {
      equals: status,
      mode: 'insensitive' as const,
    }
  }

  const totalCount = await db.lab.count({ where })
  const labs = await db.lab.findMany({
    where,
    select: {
      lab_id: true,
      lab_name: true,
      lab_head: true,
      email: true,
      research_area: true,
      location: true,
      status: true,
      type: true,
      contact_phone: true,
    },
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: pageSize,
  })

  return { data: labs, totalCount }
}

export default async function LabAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    pageSize?: string; 
    query?: string;
    equipment_query?: string;
    type?: string;
    status?: string;
  }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 10
  const query = params.query || ''
  const equipment_query = params.equipment_query || '' 
  const type = params.type || ''
  const status = params.status || ''

  const { data: labs, totalCount } = await getData(
    page, 
    pageSize, 
    query, 
    equipment_query,
    type, 
    status
  )
  
  return (
    <div className="space-y-4">
      <LabFilterCard />
      
      <div className="flex items-center justify-between gap-4">
        <Button asChild>
          <Link href="/admin/labs/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Lab
          </Link>
        </Button>
      </div>

      {(query || equipment_query || type || status) && (
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
          data={labs}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
}