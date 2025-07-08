"use client"

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { flexRender } from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
  columns: any
  data: TData[]
  table: any // Pass the table instance from useReactTable
  totalCount?: number
  currentPage?: number
  itemsPerPage?: number
  onPageChange?: (page: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  table,
  totalCount,
  currentPage,
  itemsPerPage,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4 px-4">
        {/* Show pagination info if server-side */}
        {totalCount !== undefined && currentPage !== undefined && itemsPerPage !== undefined && (
          <div className="text-sm text-gray-700">
            {totalCount > 0 
              ? `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, totalCount)} of ${totalCount} results`
              : "No results found"
            }
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange ? onPageChange(currentPage! - 1) : table.previousPage()}
            disabled={onPageChange ? currentPage === 1 : !table.getCanPreviousPage()}
          >
            Previous
          </Button>
          
          {/* Show current page info */}
          {totalCount !== undefined && currentPage !== undefined && itemsPerPage !== undefined && totalCount > 0 && (
            <span className="text-sm text-gray-700">
              Page {currentPage} of {Math.max(1, Math.ceil(totalCount / itemsPerPage))}
            </span>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange ? onPageChange(currentPage! + 1) : table.nextPage()}
            disabled={onPageChange 
              ? totalCount === 0 || (currentPage || 1) >= Math.ceil(totalCount! / itemsPerPage!) 
              : !table.getCanNextPage()
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}