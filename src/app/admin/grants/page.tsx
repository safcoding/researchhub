import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns, Grant } from "./columns"
import { DataTable } from "../_components/data-table";
import db from "@/db/db";

async function getData(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize
  const totalCount = await db.grant.count()

    const grants = await  db.grant.findMany({
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
      orderBy:{ createdAt: 'desc'},
      skip: skip,
      take: pageSize,
      })
      console.log('Grants data:', grants)
      return {
        data: grants,
        totalCount
      }
  }


/*TODO
  -ADD SERVER SIDED PAGINATION
  -ADD SEARCH
  -ADD FILTER BY TYPE,SPONSOR CATEGORY, STATUS, DATE
*/

export default async function GrantAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 10
  const { data: grants, totalCount } = await getData(page, pageSize)
  
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Button asChild>
          <Link href="/admin/grants/new">Add Grant</Link>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <DataTable 
          columns={columns} 
          data={grants}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </div>
    </>
  )
}