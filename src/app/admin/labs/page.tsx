import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns } from "./_components/columns"
import { DataTable } from "../_components/data-table";
import db from "@/db/db";
import Search from "@/components/ui/search";
import { Suspense } from "react";
import { Plus } from "lucide-react";

async function getData(page: number = 1, pageSize: number = 10, query?: string) {
  const skip = (page - 1) * pageSize

  const where = query ? {
    OR: [
      {
        lab_name: {
          contains: query,
          mode: 'insensitive' as const,
        },
      },
    ],
  } : {}
  
  const totalCount = await db.lab.count({ where })

    const labs = await  db.lab.findMany({
      where,
      select: {
        lab_id: true,
        lab_name: true,
        type: true,
        research_area: true,
        description: true,
        location: true,
        status: true,
      },
      orderBy:{ createdAt: 'desc'},
      skip: skip,
      take: pageSize,
      })
      console.log('Lab data:', labs)
      console.log('Search query:', query)

      return {
        data: labs,
        totalCount
      }
  }


/*TODO
  -ADD FILTER BY TYPE,SPONSOR CATEGORY, STATUS, DATE
  -ADD BACK BUTTON IN EDIT PAGE USING BREADCRUMBS?
*/

export default async function LabAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; query?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 10
  const query = params.query || ''
  const { data: labs, totalCount } = await getData(page, pageSize, query)
  
  return (
    <div className="space-y-4">
      {/* Single header with search and button */}
      <div className="flex items-center justify-between gap-4">
        <Suspense fallback={<div>Loading search...</div>}>
          <Search placeholder="Search by lab name..." />
        </Suspense>
        <Button asChild>
          <Link href="/admin/labs/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Lab
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
          data={labs}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
}