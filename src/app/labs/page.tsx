'use client';
import React, { useState, useEffect } from 'react';
import ConditionalNavbar from '@/components/navbar/conditional-navbar';
import { useRouter } from 'next/navigation';
import { type Lab } from '@/hooks/lab-logic';
import { createClient } from '@/utils/supabase/client';

const OurLabs = () => {
  const [selectedLabType, setSelectedLabType] = useState<string>('');  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [equipmentSearch, setEquipmentSearch] = useState<string>('');
  const [showEquipmentFilter, setShowEquipmentFilter] = useState(false);  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [showLabModal, setShowLabModal] = useState(false);
  const router = useRouter();  // Fetch labs from Supabase
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('labs')
          .select('*')
          .order('LAB_NAME');
        
        if (error) throw error;
        const labsData = (data as Lab[]) || [];
        setLabs(labsData);
        
        // Set the first available lab type as default selected category
        if (labsData && labsData.length > 0) {
          const labTypes = [...new Set(labsData.map(lab => lab.LAB_TYPE).filter(Boolean))];
          if (labTypes.length > 0 && !selectedLabType) {
            setSelectedLabType(labTypes[0]!);
          }
        }
      } catch (error) {
        console.error('Error fetching labs:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchLabs();
  }, [selectedLabType]);
  // Get unique lab types from labs data
  const getAvailableLabTypes = () => {
    const labTypes = [...new Set(labs.map(lab => lab.LAB_TYPE).filter(Boolean))];
    return labTypes.sort();
  };

  // Get all unique equipment items across all labs
  const getAllAvailableEquipment = () => {
    const allEquipment = new Set<string>();
    
    labs.forEach(lab => {
      if (lab.EQUIPMENT_LIST) {
        const equipment = parseEquipmentList(lab.EQUIPMENT_LIST);
        equipment.forEach(item => allEquipment.add(item));
      }
    });
    
    return Array.from(allEquipment).sort();
  };

  // Get count of labs that have specific equipment
  const getEquipmentLabCount = (equipment: string) => {
    return labs.filter(lab => {
      if (!lab.EQUIPMENT_LIST) return false;
      const labEquipment = parseEquipmentList(lab.EQUIPMENT_LIST);
      return labEquipment.some(item => 
        item.toLowerCase().includes(equipment.toLowerCase())
      );
    }).length;
  };
  // Get labs for selected lab type with search filtering
  const getLabsForSelectedType = () => {
    if (!selectedLabType) return [];
    
    let filtered = labs.filter(lab => lab.LAB_TYPE === selectedLabType);
    
    // Apply general search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lab => 
        lab.LAB_NAME?.toLowerCase().includes(query) || 
        lab.LAB_HEAD?.toLowerCase().includes(query) ||
        lab.RESEARCH_AREA?.toLowerCase().includes(query)
      );
    }
    
  // Apply equipment search filter
    if (equipmentSearch.trim() !== '') {
      const equipQuery = equipmentSearch.toLowerCase();
      filtered = filtered.filter(lab => 
        lab.EQUIPMENT_LIST?.toLowerCase().includes(equipQuery)
      );
    }
    
    // Apply equipment filter (from equipment filter button)
    if (selectedEquipment.trim() !== '') {
      filtered = filtered.filter(lab => {
        if (!lab.EQUIPMENT_LIST) return false;
        const labEquipment = parseEquipmentList(lab.EQUIPMENT_LIST);
        return labEquipment.some(item => 
          item.toLowerCase().includes(selectedEquipment.toLowerCase())
        );
      });
    }
    
    return filtered;
  };  const handleLabClick = (lab: Lab) => {
    setSelectedLab(lab);
    setShowLabModal(true);
  };

  // Function to parse and visualize equipment list
  const parseEquipmentList = (equipmentList: string | undefined) => {
    if (!equipmentList || equipmentList.trim() === '') {
      return [];
    }
    
    // Split by common delimiters and clean up
    return equipmentList
      .split(/[,;\n\r]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };
  // Component to display equipment as badges
  const EquipmentBadges = ({ 
    equipmentList, 
    maxVisible = 3, 
    clickable = false 
  }: { 
    equipmentList: string | undefined, 
    maxVisible?: number,
    clickable?: boolean 
  }) => {
    const equipment = parseEquipmentList(equipmentList);
    
    if (equipment.length === 0) {
      return <span className="text-gray-400 text-xs">No equipment listed</span>;
    }

    const visibleEquipment = equipment.slice(0, maxVisible);
    const remainingCount = equipment.length - maxVisible;

    return (
      <div className="flex flex-wrap gap-1">
        {visibleEquipment.map((item, index) => (
          <span
            key={index}
            onClick={clickable ? (e) => {
              e.stopPropagation(); // Prevent row click
              setSelectedEquipment(item);
            } : undefined}
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ${
              clickable ? 'cursor-pointer hover:bg-blue-200 transition-colors' : ''
            } ${selectedEquipment === item ? 'ring-2 ring-blue-500 bg-blue-200' : ''}`}
            title={clickable ? `Click to filter by: ${item}` : item}
          >
            {item.length > 12 ? `${item.substring(0, 12)}...` : item}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  };
  if (loading) {
    return (
      <>
        <ConditionalNavbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading labs...</span>
        </div>
      </>
    );
  }
  const availableLabTypes = getAvailableLabTypes();
  const currentLabs = getLabsForSelectedType();
  // If no labs exist, show a message
  if (labs.length === 0) {
    return (
      <>
        <ConditionalNavbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">No Labs Available</h1>
            <p className="text-gray-600 mb-4">There are no labs in the database yet.</p>
            <button
              onClick={() => router.push('/labs')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Labs
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <ConditionalNavbar />
      <div className="flex min-h-screen">        {/* Sidebar Navigation */}
        <div className="w-80 bg-gray-100 p-4 border-r border-gray-200">
          <h2 className="text-lg font-bold mb-4">MJIIT Labs</h2>
          <div className="space-y-2">
            {availableLabTypes.map((labType) => (
              <button
                key={labType}
                onClick={() => setSelectedLabType(labType)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedLabType === labType 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-800 hover:bg-gray-200'
                }`}
              >
                {labType}
              </button>
            ))}
          </div>
          
          {/* Lab Type Stats */}
          <div className="mt-6 p-4 bg-white rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Lab Type Statistics</h3>
            <div className="space-y-1 text-sm">
              <div>Total Labs: {currentLabs.length}</div>
              <div>Active Labs: {currentLabs.filter(lab => lab.LAB_STATUS === 'Active').length}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50">          {/* Lab Type Header Section */}
          <div className="mb-6"> 
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{selectedLabType} Labs</h1>
              <p className="text-sm text-gray-600">
                {currentLabs.length} labs available
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
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
                  onClick={() => {
                    setSearchQuery('');
                    setEquipmentSearch('');
                    setSelectedEquipment('');
                  }}
                  className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>
              {/* Search Results Summary */}
            {(searchQuery || equipmentSearch || selectedEquipment) && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">                <p className="text-sm text-blue-800">
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

          {/* Equipment Filter Section */}
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Equipment Filter</h3>
              <button
                onClick={() => setShowEquipmentFilter(!showEquipmentFilter)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                {showEquipmentFilter ? 'Hide Equipment' : 'Show Equipment'}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${showEquipmentFilter ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {selectedEquipment && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-green-800">
                      <strong>Active Filter:</strong> {selectedEquipment}
                    </span>
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {getEquipmentLabCount(selectedEquipment)} labs
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedEquipment('')}
                    className="text-green-600 hover:text-green-800 text-sm underline"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            )}
            
            {showEquipmentFilter && (
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {getAllAvailableEquipment().map((equipment) => {
                    const labCount = getEquipmentLabCount(equipment);
                    const isSelected = selectedEquipment === equipment;
                    
                    return (
                      <button
                        key={equipment}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedEquipment('');
                          } else {
                            setSelectedEquipment(equipment);
                          }
                        }}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                          isSelected
                            ? 'bg-blue-100 border-blue-300 text-blue-800 shadow-md'
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-sm font-medium truncate mr-2" title={equipment}>
                          {equipment.length > 20 ? `${equipment.substring(0, 20)}...` : equipment}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          isSelected
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {labCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {getAllAvailableEquipment().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🔧</div>
                    <p>No equipment found in any labs</p>
                  </div>
                )}
              </div>
            )}
          </div>          {/* Labs Table */}
          {currentLabs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              {searchQuery || equipmentSearch || selectedEquipment ? (
                <div>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Results Found</h3>
                  <p className="text-gray-600 mb-4">
                    No {selectedLabType.toLowerCase()} labs match your search criteria.
                  </p>                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    {searchQuery && <p>Searched for: &quot;{searchQuery}&quot; in lab information</p>}
                    {equipmentSearch && <p>Searched for: &quot;{equipmentSearch}&quot; in equipment lists</p>}
                    {selectedEquipment && <p>Filtered by equipment: &quot;{selectedEquipment}&quot;</p>}
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setEquipmentSearch('');
                        setSelectedEquipment('');
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Clear Search
                    </button>
                    <button
                      onClick={() => router.push('/labs')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Add New Lab
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">🧪</div>
                  <p className="text-gray-600 mb-4">No labs found for {selectedLabType} type.</p>
                  <button
                    onClick={() => router.push('/labs')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add Lab
                  </button>
                </div>
              )}
            </div>
          ) : (            <div className="bg-white rounded-lg shadow-sm overflow-hidden">              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs text-gray-600">
                  💡 <strong>Tip:</strong> Click on <strong>lab names</strong> to view details, or click on <strong>equipment badges</strong> to filter labs by that equipment
                </p>
              </div>              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-800"><tr>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/5">Lab Name</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Lab Head</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/8">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/5">Research Focus</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/5">Equipment</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Location</th>
                  </tr></thead>
                <tbody className="divide-y divide-gray-200">
                  {currentLabs.map((lab) => (                    <tr 
                      key={lab.LABID}
                      className="hover:bg-blue-50 transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div 
                          onClick={() => handleLabClick(lab)}
                          className="font-medium text-gray-900 group-hover:text-blue-600 cursor-pointer"
                        >
                          {lab.LAB_NAME}
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {lab.LAB_DESCRIPTION ? lab.LAB_DESCRIPTION.substring(0, 60) + '...' : 'No description available'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{lab.LAB_HEAD}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lab.LAB_STATUS === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : lab.LAB_STATUS === 'Inactive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {lab.LAB_STATUS}
                        </span>                      </td>
                      <td className="px-4 py-3 text-gray-700 line-clamp-2">{lab.RESEARCH_AREA ?? 'Not specified'}</td>                      <td className="px-4 py-3">
                        <EquipmentBadges equipmentList={lab.EQUIPMENT_LIST} maxVisible={2} clickable={true} />
                      </td>
                      <td className="px-4 py-3 text-gray-700">{lab.LOCATION}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>          )}
        </div>
      </div>

      {/* Lab Details Modal */}
      {showLabModal && selectedLab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">{selectedLab.LAB_NAME}</h2>              <button
                onClick={() => setShowLabModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lab Head</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLab.LAB_HEAD || 'Not specified'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lab Type</label>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {selectedLab.LAB_TYPE}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedLab.LAB_STATUS === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedLab.LAB_STATUS === 'Inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedLab.LAB_STATUS}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLab.LOCATION || 'Not specified'}</p>
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLab.CONTACT_PHONE ?? 'Not specified'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLab.LAB_HEAD_EMAIL ?? 'Not specified'}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Research Area</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[80px]">
                      {selectedLab.RESEARCH_AREA ?? 'No research area specified'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[100px]">
                      {selectedLab.LAB_DESCRIPTION || 'No description available'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Equipment List</label>
                    <div className="bg-gray-50 p-3 rounded-lg min-h-[120px]">
                      <EquipmentBadges equipmentList={selectedLab.EQUIPMENT_LIST} maxVisible={10} clickable={false} />
                    </div>
                  </div>                </div>
              </div>
            </div>            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowLabModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              {selectedLab.LAB_HEAD_EMAIL && (
                <button
                  onClick={() => {
                    window.location.href = `mailto:${selectedLab.LAB_HEAD_EMAIL}?subject=Inquiry about ${selectedLab.LAB_NAME}&body=Dear ${selectedLab.LAB_HEAD},%0D%0A%0D%0AI am writing to inquire about your laboratory.%0D%0A%0D%0ABest regards,`;
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Lab Head
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OurLabs;
