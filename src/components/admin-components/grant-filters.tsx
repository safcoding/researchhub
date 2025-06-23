import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface GrantFiltersProps {
  filters: {
    dateFilter: string
    selectedYear: string
    selectedMonth: string
    selectedStatus: string
  }
  grants: any[]
  onFiltersChange: (filters: Partial<GrantFiltersProps["filters"]>) => void
}

export function GrantFilters({ filters, grants, onFiltersChange }: GrantFiltersProps) {

  const getAvailableYears = () => {
    const years = [...new Set(grants.map(grant => new Date(grant.date).getFullYear()))]
    return years.sort((a, b) => b - a)
  }

  const getMonthOptions = () => [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' }
  ]

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <Select
            value={filters.selectedStatus}
            onValueChange={value => onFiltersChange({ selectedStatus: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="TERMINATED">Terminated</SelectItem>
              <SelectItem value="ENDED">Ended</SelectItem>
              <SelectItem value="REACTIVATE WITH FINAL REPORT">Reactivate with Final Report</SelectItem>
              {/* Add more statuses as needed */}
            </SelectContent>
          </Select>
        </div>
        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Year
          </label>
          <Select
            value={filters.selectedYear}
            onValueChange={value => onFiltersChange({ selectedYear: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {getAvailableYears().map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Month Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Month
          </label>
          <Select
            value={filters.selectedMonth}
            onValueChange={value => onFiltersChange({ selectedMonth: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {getMonthOptions().map(month => (
                <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}