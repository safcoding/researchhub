import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LAB_TYPES } from "@/constants/lab-options";

interface LabFiltersProps {
  filters: {
    labType: string;
    labName: string;
    equipmentId: string;
  };
  onFiltersChange: (filters: Partial<LabFiltersProps["filters"]>) => void;
  equipmentList: { id: string; name: string }[];
}

export function LabFilters({ filters, onFiltersChange }: LabFiltersProps) {

  const handleReset = () => {
  onFiltersChange({ labType: "", labName: "", equipmentId: "" });
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Lab Type
          </label>
          <Select
            value={filters.labType || "all"}
            onValueChange={value => onFiltersChange({ labType: value === "all" ? "" : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {LAB_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
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
  );
}