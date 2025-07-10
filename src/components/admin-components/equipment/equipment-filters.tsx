"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { EquipmentFilters } from '@/hooks/logic/equipment-logic'

interface EquipmentFiltersComponentProps {
  filters: EquipmentFilters;
  onFiltersChange: (filters: Partial<EquipmentFilters>) => void;
}

export function EquipmentFilters({ filters, onFiltersChange }: EquipmentFiltersComponentProps) {
  
  const handleReset = () => {
    onFiltersChange({
      searchText: '',
      name: '',
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Equipment
          </label>
          <Input
            type="text"
            placeholder="Search by equipment name..."
            value={filters.searchText || ''}
            onChange={e => onFiltersChange({ searchText: e.target.value })}
            className="text-sm w-full"
          />
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="mb-0"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
