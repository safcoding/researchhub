'use client'

import { ColumnDef } from "@tanstack/react-table"
import { formatCurrency, formatNumber } from "@/lib/formatters"

export type Grant = {
    project_id:            string
    project_title:         string | null
    approved_amount:       number | null
    type:                  string | null
    sponsor_category:      string | null
    sponsor_name:          string | null
    subsponsor_name:       string | null
    status:                string | null
    pro_date_start:        Date | null
}

export const columns: ColumnDef<Grant>[] = [
    {
        accessorKey: "project_id",
        header: "Project ID",
        size: 120,
        cell: ({ row }) => (
            <div className="w-[120px]">{row.getValue("project_id")}</div>
        ),
    },
    {
        accessorKey: "project_title",
        header: "Project Title",
        size: 250,
        cell: ({ row }) => (
            <div className="w-[250px] truncate" title={row.getValue("project_title") || ""}>
            {row.getValue("project_title") || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "approved_amount",
        header: "Approved Amount",
        size: 120,
       cell: ({ row }) => {
            const amount = row.getValue("approved_amount") as number | null
            return (
                <div className="w-[150px] text-center">
                    {amount ? formatCurrency(amount) : "N/A"}  {/* Fixed syntax */}
                </div>
            )
       }
    },
    {
        accessorKey: "type",
        header: "Type",
        size: 120,
        cell: ({ row }) => (
            <div className="w-[180px] truncate" title={row.getValue("type") || ""}>
                {row.getValue("type") || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "sponsor_category",
        header: "Sponsor Category",
        size: 150,
        cell: ({ row }) => (
            <div className="w-[150px]">{row.getValue("sponsor_category") || "N/A"}</div>
        ),
    },
    {
        accessorKey: "sponsor_name",
        header: "Sponsor Name",
        size: 180,
        cell: ({ row }) => (
            <div className="w-[180px] truncate" title={row.getValue("sponsor_name") || ""}>
                {row.getValue("sponsor_name") || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "subsponsor_name",
        header: "Sub-sponsor Name",
        size: 180,
        cell: ({ row }) => (
            <div className="w-[180px] truncate" title={row.getValue("subsponsor_name") || ""}>
                {row.getValue("subsponsor_name") || "N/A"}
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
        accessorKey: "pro_date_start",
        header: "Start Date",
        size: 120,
        cell: ({ row }) => {
            const date = row.getValue("pro_date_start") as Date | null
            return (
                <div className="w-[120px]">
                    {date ? new Intl.DateTimeFormat("ms-MY").format(new Date(date)) : "N/A"}
                </div>
            )
        },
    },
]