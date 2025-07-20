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
import Link from "next/link"

import { deletePublication } from "../server/publications"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export type Publication = {
        publication_id: string
        pub_refno:      string
        title:          string
        journal:        string
        type:           string
        category:       string
        level:          string 
        date:           Date
        status:         string
}


export const columns: ColumnDef<Publication>[] = [

    {
        accessorKey: "pub_refno",
        header: "Public Ref. No",
        size: 120,
        cell: ({ row }) => (
            <div className="w-[120px]">{row.getValue("pub_refno")}</div>
        ),
    },
    {
        accessorKey: "title",
        header: "Title",
        size: 250,
        cell: ({ row }) => (
            <div className="w-[250px] truncate" title={row.getValue("title") || ""}>
            {row.getValue("title") || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "journal",
        header: "Journal",
        size: 120,
        cell: ({ row }) => (
            <div className="w-[250px] truncate" title={row.getValue("journal") || ""}>
            {row.getValue("journal") || "N/A"}
            </div>        ),
    },
    {
        accessorKey: "type",
        header: "Type",
        size: 120,
        cell: ({ row }) => (
            <div className="w-[120px] truncate" title={row.getValue("type") || ""}>
                {row.getValue("type") || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        size: 120,
        cell: ({ row }) => (
            <div className="w-[120px]">{row.getValue("category") || "N/A"}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        size: 120,
        cell: ({ row }) => (
            <div className="w-[120px] truncate" title={row.getValue("status") || ""}>
                {row.getValue("status") || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "date",
        header: "Publication Date",
        size: 120,
        cell: ({ row }) => {
            const date = row.getValue("date") as Date | null
            return (
                <div className="w-[120px]">
                    {date ? new Intl.DateTimeFormat("ms-MY").format(new Date(date)) : "N/A"}
                </div>
            )
        },
    },
  {
    id: "actions",
    cell: ({ row }) => {
      const publication = row.original
      const router = useRouter()
      const [isPending, startTransition] = useTransition()

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
              asChild
            >
              <Link href={`/admin/publications/${publication.publication_id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem               
              className="text-destructive focus:text-destructive"
              disabled={isPending}
              onClick={() => {
                if (confirm("Are you sure you want to delete this publication?")) {
                  startTransition(async () => {
                    await deletePublication(publication.publication_id)
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