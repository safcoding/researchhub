
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { PUBLICATION_TYPES, PUBLICATION_CATEGORIES } from '@/constants/publication-options';

interface PublicationFiltersProps {
  filters: {
    category: typeof PUBLICATION_CATEGORIES[number] | 'all';
    type: typeof PUBLICATION_TYPES[number] | 'all';
    year: string;
    month: string;
    searchText: string;
    dateFrom?: string;
    dateTo?: string;
  };
  publicationTypes: typeof PUBLICATION_TYPES;
  publicationCategories: typeof PUBLICATION_CATEGORIES;
  onFiltersChange: (filters: Partial<PublicationFiltersProps["filters"]>) => void;
}

export function PublicationFilters({ filters, onFiltersChange, publicationTypes, publicationCategories }: PublicationFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      category: "all",
      type: "all",
      year: "all",
      month: "all",
      searchText: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // This prevents page reload
  };

  // Years can be generated dynamically or passed as a prop if needed
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
      <form onSubmit={handleSubmit}> {/* Add onSubmit handler here */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <Select
            value={filters.category}
            onValueChange={value => onFiltersChange({ category: value as typeof PUBLICATION_CATEGORIES[number] | 'all' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {publicationCategories.map((cat: typeof PUBLICATION_CATEGORIES[number]) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Type
          </label>
          <Select
            value={filters.type}
            onValueChange={value => onFiltersChange({ type: value as typeof PUBLICATION_TYPES[number] | 'all' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {publicationTypes.map((type: typeof PUBLICATION_TYPES[number]) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Specific Year
          </label>
          <Select
            value={filters.year}
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
            Filter by Specific Month
          </label>
          <Select
            value={filters.month}
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
          placeholder="Search titles or authors..."
          value={filters.searchText}
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
      </form>
    </div>
  )
}