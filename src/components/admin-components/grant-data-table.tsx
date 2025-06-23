"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
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
import type { Grant } from "@/hooks/grant-logic";

interface GrantDataTableProps {
  data: Grant[]
  onEdit: (grant: Grant) => void
  onDelete: (grant: Grant) => void
}

export function GrantDataTable({ data, onEdit, onDelete }: GrantDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const columns: ColumnDef<Grant>[] = [
    {
      accessorKey: "PROJECTID",
      header: "Project ID",
      cell: ({ row }) => {
        const grant = row.original
        return <div className="text-sm font-medium text-gray-900">{grant.PROJECTID}</div>
      },
    },
    {
      accessorKey: "PL_NAME",
      header: "Project Leader",
      cell: ({ row }) => {
        const grant = row.original
        return <div className="text-sm font-medium text-gray-900">{grant.PL_NAME}</div>
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-medium text-xs text-gray-500 uppercase tracking-wider"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-medium text-xs text-gray-500 uppercase tracking-wider"
        >
          Date Start
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
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
        <h2 className="text-xl font-semibold text-gray-800 flex-1">All Grants</h2>
        <Input
          placeholder="Filter by Project ID..."
          value={(table.getColumn("PROJECTID")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("PROJECTID")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <DataTable columns={columns} data={data} table={table} />
    </div>
  )
}