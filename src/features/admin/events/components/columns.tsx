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

import { deleteEvent } from "../server/events"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export type Event = {
        event_id: string
        title: string
        description: string
        category: string
        priority: string
        status: string
        date: Date
        time: string | null
        location: string | null
        organizer: string

}


export const columns: ColumnDef<Event>[] = [

    {
        accessorKey: "title",
        header: "Event Title",
        size: 250,
        cell: ({ row }) => (
            <div className="w-[250px] truncate" title={row.getValue("title") || ""}>
            {row.getValue("title") || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        size: 120,
        cell: ({ row }) => (
            <div className="w-[120px] truncate" title={row.getValue("description") || ""}>
                {row.getValue("description") || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        size: 120,
        cell: ({ row }) => (
            <div className="w-[120px] truncate" title={row.getValue("category") || ""}>
                {row.getValue("category") || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        size: 120,
        cell: ({ row }) => (
            <div className="w-[120px]">{row.getValue("status") || "N/A"}</div>
        ),
    },
    {
        accessorKey: "priority",
        header: "Priority",
        size: 100,
        cell: ({ row }) => (
            <div className="w-[100px]">{row.getValue("priority") || "N/A"}</div>
        ),
    },
    {
        accessorKey: "date",
        header: "Event Date",
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
        accessorKey: "time",
        header: "Time",
        size: 100,
        cell: ({ row }) => (
            <div className="w-[100px]">{row.getValue("time") || "N/A"}</div>
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
    id: "actions",
    cell: ({ row }) => {
      const event = row.original
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
              <Link href={`/admin/events/${event.event_id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem               
              className="text-destructive focus:text-destructive"
              disabled={isPending}
              onClick={() => {
                if (confirm("Are you sure you want to delete this event?")) {
                  startTransition(async () => {
                    await deleteEvent(event.event_id)
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