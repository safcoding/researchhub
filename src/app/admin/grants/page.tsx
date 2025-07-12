import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns, Grant } from "./columns"
import { DataTable } from "../_components/data-table";
import db from "@/db/db";

async function getData(): Promise<Grant[]>{
  const grants = await  db.grant.findMany({
    select: {
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
    orderBy:{ createdAt: 'desc'}
    })
    console.log('Grants data:', grants)
    return grants
}


/*TODO
  -ADD SERVER SIDED PAGINATION
  -ADD SEARCH AND FILTER BY TYPE,SPONSOR CATEGORY, STATUS, DATE
  -ADD EDIT/DELETE ACTIONS
*/

export default async function Page() {
  const grants = await getData()

  return(
  <>
    <div className="flex justify-between items-center gap-4">
      <Button>
        <Link href="/admin/grants/new"> Add Grant</Link>
      </Button>
    </div>
      <div className="overflow-x-auto">
        <DataTable columns={columns} data = {grants} />
      </div>
  </>
  )
}