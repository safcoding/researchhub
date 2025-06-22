import React from 'react';

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  equipmentSearch: string;
  setEquipmentSearch: (query: string) => void;
  selectedEquipment: string;
  setSelectedEquipment: (equipment: string) => void;
  selectedLabType: string;
  currentLabs: any[];
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  equipmentSearch,
  setEquipmentSearch,
  selectedEquipment,
  setSelectedEquipment,
  selectedLabType,
  currentLabs
}) => {
  const clearAllFilters = () => {
    setSearchQuery('');
    setEquipmentSearch('');
    setSelectedEquipment('');
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Search & Filter</h3>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by lab name, head, or research area..."
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-3.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search equipment..."
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={equipmentSearch}
            onChange={(e) => setEquipmentSearch(e.target.value)}
          />
          <div className="absolute left-3 top-3.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
            </svg>
          </div>
        </div>

        {(searchQuery || equipmentSearch || selectedEquipment) && (
          <button
            onClick={clearAllFilters}
            className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Search Results Summary */}
      {(searchQuery || equipmentSearch || selectedEquipment) && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            {searchQuery && equipmentSearch && selectedEquipment
              ? `Searching for "${searchQuery}" in lab info, "${equipmentSearch}" in equipment, and filtering by "${selectedEquipment}"`
              : searchQuery && equipmentSearch
              ? `Searching for "${searchQuery}" in lab info and "${equipmentSearch}" in equipment`
              : searchQuery && selectedEquipment
              ? `Searching for "${searchQuery}" in lab info and filtering by "${selectedEquipment}"`
              : equipmentSearch && selectedEquipment
              ? `Searching for "${equipmentSearch}" in equipment and filtering by "${selectedEquipment}"`
              : searchQuery 
              ? `Searching for "${searchQuery}" in lab information`
              : equipmentSearch
              ? `Searching for "${equipmentSearch}" in equipment lists`
              : `Filtering by equipment: "${selectedEquipment}"`
            }
            {currentLabs.length === 0 ? ' - No results found' : ` - ${currentLabs.length} result(s) found`}
          </p>
        </div>
      )}
    </div>
  );
};