import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { GRANT_TYPES, GRANT_STATUSES } from '@/constants/grant-options';
import { type GrantFilters } from '@/hooks/logic/grant-logic';

interface GrantFiltersComponentProps {
  filters: GrantFilters;
  onFiltersChange: (filters: Partial<GrantFilters>) => void;
}

export function GrantFilters({ filters, onFiltersChange }: GrantFiltersComponentProps) {
  
  const handleReset = () => {
    onFiltersChange({
      status: "all",
      grantType: "all",
      year: "all",
      month: "all",
      searchText: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  // Years can be generated dynamically
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

  const getMonthOptions = () => [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
              {GRANT_STATUSES.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
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
              {GRANT_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
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
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
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
        
        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <input
            type="date"
            value={filters.dateFrom || ""}
            onChange={e => onFiltersChange({ dateFrom: e.target.value })}
            className="border px-3 py-2 rounded text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <input
            type="date"
            value={filters.dateTo || ""}
            onChange={e => onFiltersChange({ dateTo: e.target.value })}
            className="border px-3 py-2 rounded text-sm w-full"
          />
        </div>
      </div>
      {/* Search */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Search project ID, title, or PI name..."
          value={filters.searchText || ''}
          onChange={e => onFiltersChange({ searchText: e.target.value })}
          className="border px-3 py-2 rounded text-sm w-64"
        />
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