import { EVENT_CATEGORIES } from "@/constants/event-options"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface EventFiltersProps {
  filters: {
    selectedCategory: string
    dateFilter: string
    selectedYear: string
    selectedMonth: string
  }
  events: any[]
  onFiltersChange: (filters: Partial<EventFiltersProps["filters"]>) => void
}

export function EventFilters({ filters, events, onFiltersChange }: EventFiltersProps) {

  const getAvailableYears = () => {
    const years = [...new Set(events.map(event => new Date(event.date).getFullYear()))]
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
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <Select
            value={filters.selectedCategory}
            onValueChange={value => onFiltersChange({ selectedCategory: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {EVENT_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Date
          </label>
          <Select
            value={filters.dateFilter}
            onValueChange={value => onFiltersChange({ dateFilter: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="upcoming">Upcoming Events</SelectItem>
              <SelectItem value="past">Past Events</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="nextMonth">Next Month</SelectItem>
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