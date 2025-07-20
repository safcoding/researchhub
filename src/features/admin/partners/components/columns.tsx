'use client'

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deletePartner } from "../server/partners"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export type Partner = {
        partner_id: string
        name: string
        image: string

}

interface TableMeta {
  onEdit?: (partner: Partner) => void
}

export const columns: ColumnDef<Partner>[] = [

    {
        accessorKey: "name",
        header: "Partner Name",
        size: 250,
        cell: ({ row }) => (
            <div className="w-[250px] truncate" title={row.getValue("name") || ""}>
            {row.getValue("name") || "N/A"}
            </div>
        ),
    },

  {
    id: "actions",
    cell: ({ row, table }) => {
      const partner = row.original
      const router = useRouter()
      const [isPending, startTransition] = useTransition()
      const meta = table.options.meta as TableMeta

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => meta?.onEdit?.(partner)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem               
              className="text-destructive focus:text-destructive"
              disabled={isPending}
              onClick={() => {
                if (confirm("Are you sure you want to delete this partner?")) {
                  startTransition(async () => {
                    await deletePartner(partner.partner_id)
                    router.refresh()
                  })
                }
              }}
            >
              {isPending ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]