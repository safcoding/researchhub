import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { type GrantFilters } from '@/hooks/logic/grant-logic';

interface GrantFiltersComponentProps {
  filters: GrantFilters
  grants: any[]
  onFiltersChange: (filters: Partial<GrantFilters>) => void
}

export function GrantFilters({ filters, grants, onFiltersChange }: GrantFiltersComponentProps) {

  const handleReset = () => {
    onFiltersChange({
      year: "all",
      month: "all",
      status: "all",
      grantType: "all",
      searchText: "",
    });
  };

  const getAvailableYears = () => {
    const years = [...new Set(
      grants
        .map(grant => {
          const d = new Date(grant.PRO_DATESTART);
          return isNaN(d.getTime()) ? null : d.getFullYear();
        })
        .filter(year => year !== null)
    )];
    return years.sort((a, b) => b - a);
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
            value={filters.status || 'all'}
            onValueChange={value => onFiltersChange({ status: value })}
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
              <SelectItem value="END - NEED TO SUBMIT FINAL REPORT">End - Need to Submit Final Report</SelectItem>
              {/* Add more statuses as needed */}
            </SelectContent>
          </Select>
        </div>
        
        {/* Grant Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Grant Type
          </label>
          <Select
            value={filters.grantType || 'all'}
            onValueChange={value => onFiltersChange({ grantType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Grant Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grant Types</SelectItem>
              <SelectItem value="International Grant">International Grant</SelectItem>
              <SelectItem value="UTM Encouragement Research">UTM Encouragement Research</SelectItem>
              <SelectItem value="Potential Academic Staff">Potential Academic Staff</SelectItem>
              <SelectItem value="Matching Grant">Matching Grant</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="COLLABORATIVE RESEARCH AND EXTERNAL GRANT">Collaborative Research and External Grant</SelectItem>
              {/* Add more grant types as needed */}
            </SelectContent>
          </Select>
        </div>
        
        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Year
          </label>
          <Select
            value={filters.year || 'all'}
            onValueChange={value => onFiltersChange({ year: value })}
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
            value={filters.month || 'all'}
            onValueChange={value => onFiltersChange({ month: value })}
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
      <div className="flex justify-end mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  )
}