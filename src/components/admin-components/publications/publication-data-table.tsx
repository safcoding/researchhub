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
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import type { Publication } from "@/hooks/logic/publication-logic"

interface PublicationDataTableProps {
  data: Publication[]
  onEdit: (publication: Publication) => void
  onDelete: (publication: Publication) => void
  totalCount: number
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  searchValue: string
  onSearchChange: (value: string) => void
}

export function PublicationDataTable({ 
  data, 
  onEdit, 
  onDelete, 
  totalCount, 
  currentPage, 
  itemsPerPage, 
  onPageChange,
  searchValue,
  onSearchChange 
}: PublicationDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  

  const columns: ColumnDef<Publication>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const publication = row.original
        return (
          <div>
            <div className="text-sm font-medium text-gray-900">{publication.title}</div>
            <div className="text-sm text-gray-500">
              {publication.pub_refno} • {publication.journal}
            </div>
          </div>
        )
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
      accessorKey: "category",
      header: "Category", 
      cell: ({ row }) => {
        const publication = row.original
        return <div className="text-sm font-medium text-gray-900">{publication.category}</div>
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
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const publication = row.original
        return <div className="text-sm font-medium text-gray-900">{publication.type}</div>
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
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true, // Enable manual pagination for server-side
    pageCount: Math.ceil(totalCount / itemsPerPage),
    state: {
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
    },
  })

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center">
        <h2 className="text-xl font-semibold text-gray-800 flex-1">All Publications ({totalCount})</h2>
      </div>
      <DataTable 
        columns={columns} 
        data={data} 
        table={table}
        totalCount={totalCount}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  )
}