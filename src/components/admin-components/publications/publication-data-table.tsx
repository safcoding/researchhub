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
import { ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import type { Publication } from "@/hooks/publication-logic"

interface PublicationDataTableProps {
  data: Publication[]
  onEdit: (publication: Publication) => void
  onDelete: (publication: Publication) => void
}

export function PublicationDataTable({ data, onEdit, onDelete }: PublicationDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const columns: ColumnDef<Publication>[] = [
    {
      accessorKey: "pub_refno",
      header: "Reference Number",
      cell: ({ row }) => {
        const publication = row.original
        return <div className="text-sm font-medium text-gray-900">{publication.pub_refno}</div>
      },
    },
    {
      accessorKey: "author_name",
      header: "Author",
      cell: ({ row }) => {
        const publication = row.original
        return <div className="text-sm font-medium text-gray-900">{publication.author_name}</div>
      },
    },
    {
      accessorKey: "title",
      header: "Project Title",
      cell: ({ row }) => {
        const publication = row.original
        return <div className="text-sm font-medium text-gray-900">{publication.title}</div>
      },
    },
    {
      accessorKey: "journal",
      header: "Journal",
      cell: ({ row }) => {
        const publication = row.original
        return <div className="text-sm font-medium text-gray-900">{publication.journal}</div>
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const publication = row.original
        return <div className="text-sm font-medium text-gray-900">{publication.type}</div>
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const publication = row.original
        return <div className="text-sm font-medium text-gray-900">{publication.category}</div>
      },
    },
    {
      accessorKey: "impact",
      header: "Impact",
      cell: ({ row }) => {
        const publication = row.original
        return <div className="text-sm font-medium text-gray-900">{publication.impact}</div>
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-medium text-xs text-gray-500 uppercase tracking-wider"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const publication = row.original
        return <div className="text-sm font-medium text-gray-900">{publication.date}</div>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const publication = row.original
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(publication)}
              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(publication)}
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
        <h2 className="text-xl font-semibold text-gray-800 flex-1">All Publications</h2>
        <Input
          placeholder="Filter by Publication Reference number..."
          value={(table.getColumn("pub_refno")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("pub_refno")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <DataTable columns={columns} data={data} table={table} />
    </div>
  )
}