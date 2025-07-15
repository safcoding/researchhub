'use client'

import { ColumnDef } from "@tanstack/react-table"
import { formatCurrency, formatNumber } from "@/lib/formatters"
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

import { deleteLab } from "../../_actions/labs"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export type Lab = {
    lab_id: string
    lab_name: string
    type: string
    research_area: string | null
    description: string | null
    location: string | null
    status: string | null
}

export const columns: ColumnDef<Lab>[] = [
    {
        accessorKey: "lab_name",
        header: "Lab Name",
        size: 250,
        cell: ({ row }) => (
            <div className="w-[250px] truncate" title={row.getValue("lab_name") || ""}>
                {row.getValue("lab_name") || "N/A"}
            </div>
        ),
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
        accessorKey: "research_area",
        header: "Research Area",
        size: 200,
        cell: ({ row }) => (
            <div className="w-[200px] truncate" title={row.getValue("research_area") || ""}>
                {row.getValue("research_area") || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        size: 300,
        cell: ({ row }) => (
            <div className="w-[300px] truncate" title={row.getValue("description") || ""}>
                {row.getValue("description") || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "location",
        header: "Location",
        size: 150,
        cell: ({ row }) => (
            <div className="w-[150px] truncate" title={row.getValue("location") || ""}>
                {row.getValue("location") || "N/A"}
            </div>
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
        id: "actions",
        cell: ({ row }) => {
            const lab = row.original
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
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/labs/${lab.lab_id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem               
                            className="text-destructive focus:text-destructive"
                            disabled={isPending}
                            onClick={() => {
                                if (confirm("Are you sure you want to delete this lab?")) {
                                    startTransition(async () => {
                                        await deleteLab(lab.lab_id)
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