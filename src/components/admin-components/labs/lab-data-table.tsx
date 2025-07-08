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
    totalCount?: number
    currentPage?: number
    itemsPerPage?: number
    onPageChange?: (page: number) => void
    searchValue?: string
    onSearchChange?: (value: string) => void
}

export function LabDataTable({
  data, 
  onEdit, 
  onDelete, 
  onDetails,
  totalCount,
  currentPage,
  itemsPerPage,
  onPageChange,
  searchValue,
  onSearchChange 
} : LabDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  
  // Remove client-side filtering since we might do server-side in the future

  const columns: ColumnDef<Lab>[] = [
    {
      accessorKey: "LAB_NAME",
      header: "Lab Name",
      cell: ({ row }) => {
        const lab = row.original
        return (
          <div>
            <div className="text-sm font-medium text-gray-900">{lab.LAB_NAME}</div>
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {lab.RESEARCH_AREA}
            </div>
          </div>
        )
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
        getSortedRowModel: getSortedRowModel(),
        // Use manual pagination if server-side props are provided
        ...(totalCount !== undefined && currentPage !== undefined && itemsPerPage !== undefined && {
          manualPagination: true,
          pageCount: Math.ceil(totalCount / itemsPerPage),
        }),
        ...(!totalCount && {
          getPaginationRowModel: getPaginationRowModel(),
        }),
        state: {
            sorting,
            ...(totalCount !== undefined && currentPage !== undefined && itemsPerPage !== undefined && {
              pagination: {
                pageIndex: currentPage - 1,
                pageSize: itemsPerPage,
              },
            }),
        },
    })
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center">
        <h2 className="text-xl font-semibold text-gray-800 flex-1">
          All Labs {totalCount !== undefined ? `(${totalCount})` : `(${data.length})`}
        </h2>
        {(searchValue !== undefined && onSearchChange) ? (
          <input
            type="text"
            placeholder="Search labs..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <Input
            placeholder="Filter by Lab Name..."
            value={(table.getColumn("LAB_NAME")?.getFilterValue() as string) ?? ""}
            onChange={event =>
              table.getColumn("LAB_NAME")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
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

