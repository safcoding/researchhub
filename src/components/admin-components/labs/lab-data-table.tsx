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
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Eye } from "lucide-react";
import type { Lab } from "@/hooks/logic/lab-logic"

interface LabDataTableProps {
    data: Lab[]
    onEdit: (lab: Lab) => void
    onDelete: (lab: Lab) => void
    onDetails?: (lab: Lab) => void;
}

export function LabDataTable({data, onEdit, onDelete, onDetails } : LabDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])   

  const columns: ColumnDef<Lab>[] = [
    {
      accessorKey: "LAB_NAME",
      header: "Lab Name",
      cell: ({ row }) => {
        const lab = row.original
        return <div className="text-sm font-medium text-gray-900">{lab.LAB_NAME}</div>
      },
    },
    {
      accessorKey: "LAB_TYPE",
      header: "Lab Type",
      cell: ({ row }) => {
        const lab = row.original
        return <div className="text-sm font-medium text-gray-900">{lab.LAB_TYPE}</div>
      },
    },
    {
      accessorKey: "RESEARCH_AREA",
      header: "Research Area",
      cell: ({ row }) => {
        const lab = row.original
        return <div className="text-sm font-medium text-gray-900">{lab.RESEARCH_AREA}</div>
      },
    },
    {
      accessorKey: "LOCATION",
      header: "Location",
      cell: ({ row }) => {
        const lab = row.original
        return <div className="text-sm font-medium text-gray-900">{lab.LOCATION}</div>
      },
    },
    {
      accessorKey: "LAB_HEAD",
      header: "Lab Head",
      cell: ({ row }) => {
        const lab = row.original
        return <div className="text-sm font-medium text-gray-900">{lab.LAB_HEAD}</div>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const lab = row.original
        return (
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDetails?.(lab)}
              className="text-green-600 hover:text-green-900 hover:bg-green-50"
            >
            <Eye />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(lab)}
              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(lab)}
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
        <h2 className="text-xl font-semibold text-gray-800 flex-1">All Labs</h2>
        <Input
          placeholder="Filter by Lab Name..."
          value={(table.getColumn("LAB_NAME")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("LAB_NAME")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <DataTable columns={columns} data={data} table={table} />
    </div>
  )
}

