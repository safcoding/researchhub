"use client"

import * as React from "react"
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import type { Event } from "@/hooks/event-logic"
import { Button } from "../../ui/button"
import { ArrowUpDown } from "lucide-react"

interface EventsDataTableProps {
  data: Event[]
  onEdit: (event: Event) => void
  onDelete: (event: Event) => void
}

export function EventsDataTable({ data, onEdit, onDelete }: EventsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const event = row.original
        return (
          <div>
            <div className="text-sm font-medium text-gray-900">{event.title}</div>
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {event.description}
            </div>
          </div>
        )
      },
    },
     {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const event = row.original
        return (
          <div>
            <div className="text-sm font-medium text-gray-900">{event.category}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 h-auto font-medium text-xs text-gray-500 uppercase tracking-wider"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-sm text-gray-900">{row.getValue("date")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const event = row.original
        return (
          <div>
            <div className="text-sm font-medium text-gray-900">{event.status}</div>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const event = row.original
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(event)}
              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(event)}
              className="text-red-600 hover:text-red-900 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center">
        <h2 className="text-xl font-semibold text-gray-800 flex-1">All Events</h2>
        <Input
          placeholder="Filter by Title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <DataTable columns={columns} data={data} table={table} />
    </div>
  )
}