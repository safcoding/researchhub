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
import type { Grant } from "@/hooks/logic/grant-logic";

interface GrantDataTableProps {
  data: Grant[]
  onEdit: (grant: Grant) => void
  onDelete: (grant: Grant) => void
  totalCount: number
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function GrantDataTable({ 
  data, 
  onEdit, 
  onDelete,
  totalCount,
  currentPage,
  itemsPerPage,
  onPageChange
}: GrantDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  
  // Remove client-side filtering since we're doing server-side

  const columns: ColumnDef<Grant>[] = [
    {
      accessorKey: "PROJECTID",
      header: "Project ID",
      cell: ({ row }) => {
        const grant = row.original
        return (
          <div>
            <div className="text-sm font-medium text-gray-900">{grant.PROJECTID}</div>
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {grant.PL_NAME}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "PROJECT_STATUS",
      header: "Project Status",
      cell: ({ row }) => {
        const grant = row.original
        return <div className="text-sm font-medium text-gray-900">{grant.PROJECT_STATUS}</div>
      },
    },
    {
      accessorKey: "PRO_APPROVED",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 h-auto font-medium text-xs text-gray-500 uppercase tracking-wider"
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-sm text-gray-900">{row.getValue("PRO_APPROVED")}</div>,
    },
    {
      accessorKey: "GRANT_TYPE",
      header: "Grant Type",
      cell: ({ row }) => {
        const grant = row.original
        return <div className="text-sm font-medium text-gray-900">{grant.GRANT_TYPE}</div>
      },
    },
    {
      accessorKey: "COST_CENTER_CODE",
      header: "Cost Center Code",
      cell: ({ row }) => {
        const grant = row.original
        return <div className="text-sm font-medium text-gray-900">{grant.COST_CENTER_CODE}</div>
      },
    },
    {
      accessorKey: "PRO_DATESTART",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 h-auto font-medium text-xs text-gray-500 uppercase tracking-wider"
          >
            Date Start
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-sm text-gray-900">{row.getValue("PRO_DATESTART")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const grant = row.original
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(grant)}
              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(grant)}
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
        <h2 className="text-xl font-semibold text-gray-800 flex-1">All Grants ({totalCount})</h2>
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