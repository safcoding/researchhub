"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { exportGrantsToExcel } from "../server/excelExport"
import * as XLSX from 'xlsx'
import { toast } from "sonner"

interface ExcelExportButtonProps {
  query?: string
  type?: string
  status?: string
  sponsor_category?: string
  date_from?: string
  date_to?: string
  totalCount: number
}

export function ExcelExportButton({
  query,
  type,
  status,
  sponsor_category,
  date_from,
  date_to,
  totalCount
}: ExcelExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      
      const result = await exportGrantsToExcel(
        query,
        type,
        status,
        sponsor_category,
        date_from,
        date_to
      )

      if (result.data.length === 0) {
        toast.error("No data to export")
        return
      }

      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(result.data)

      // Auto-size columns
      const colWidths = Object.keys(result.data[0]).map(key => ({
        wch: Math.max(
          key.length,
          ...result.data.map(row => String(row[key]).length)
        )
      }))
      worksheet['!cols'] = colWidths
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Grants')
      XLSX.writeFile(workbook, result.filename)
      
      toast.success(`Successfully exported ${result.totalCount} grants to Excel`)
    } catch (error) {
      console.error('Export failed:', error)
      toast.error("Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      disabled={isExporting || totalCount === 0}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      Export to Excel ({totalCount} records)
    </Button>
  )
}