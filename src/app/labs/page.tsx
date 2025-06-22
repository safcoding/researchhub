'use client';
import React, { useState, useEffect } from 'react';
import ConditionalNavbar from '@/components/admin-sidebar/conditional-navbar';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';
import { type Lab } from '@/hooks/lab-logic';
import { createClient } from '@/utils/supabase/client';
import Footer from '@/components/footer';

// Import components
import { LabSidebar } from '@/components/labs/lab-sidebar';
import { SearchFilters } from '@/components/labs/search-filter';
import { LabsTable } from '@/components/labs/pub-lab-table';
import { LabModal } from '@/components/labs/lab-details';

const OurLabs = () => {
  const [selectedLabType, setSelectedLabType] = useState<string>('');
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [equipmentSearch, setEquipmentSearch] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [showLabModal, setShowLabModal] = useState(false);
  const router = useRouter();

  // Fetch labs from Supabase
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
  };

  const parseEquipmentList = (equipmentList: string | undefined) => {
    if (!equipmentList || equipmentList.trim() === '') {
      return [];
    }
    
    return equipmentList
      .split(/[,;\n\r]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const handleLabClick = (lab: Lab) => {
    setSelectedLab(lab);
    setShowLabModal(true);
  };

  const handleEquipmentClick = (equipment: string) => {
    setSelectedEquipment(equipment);
  };

  const handleCloseModal = () => {
    setShowLabModal(false);
    setSelectedLab(null);
  };

  if (loading) {
    return (
      <ConditionalNavbar>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading labs...</span>
        </div>
      </ConditionalNavbar>
    );
  }

  const availableLabTypes = getAvailableLabTypes();
  const currentLabs = getLabsForSelectedType();

  // If no labs exist, show a message
  if (labs.length === 0) {
    return (
      <ConditionalNavbar>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">No Labs Available</h1>
            <p className="text-gray-600 mb-4">There are no labs in the database yet.</p>
            <button
              onClick={() => router.push('/admin/lab-admin')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Labs
            </button>
          </div>
        </div>
      </ConditionalNavbar>
    );
  }

  return (
    <ConditionalNavbar>
      <Navbar />
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <LabSidebar
          availableLabTypes={availableLabTypes}
          selectedLabType={selectedLabType}
          setSelectedLabType={setSelectedLabType}
          currentLabs={currentLabs}
        />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50">
          {/* Lab Type Header Section */}
          <div className="mb-6"> 
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{selectedLabType} Labs</h1>
            </div>
          </div>

          {/* Search and Filter Section */}
          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            equipmentSearch={equipmentSearch}
            setEquipmentSearch={setEquipmentSearch}
            selectedEquipment={selectedEquipment}
            setSelectedEquipment={setSelectedEquipment}
            selectedLabType={selectedLabType}
            currentLabs={currentLabs}
          />

          {/* Labs Table */}
          {currentLabs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-4">
                No {selectedLabType.toLowerCase()} labs match your search criteria.
              </p>
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
            </div>
          ) : (
            <LabsTable
              labs={currentLabs}
              selectedEquipment={selectedEquipment}
              onLabClick={handleLabClick}
              onEquipmentClick={handleEquipmentClick}
            />
          )}
        </div>
      </div>

      {/* Lab Details Modal */}
      {selectedLab && (
        <LabModal
          lab={selectedLab}
          isOpen={showLabModal}
          onClose={handleCloseModal}
        />
      )}

      <Footer />
    </ConditionalNavbar>
  );
};

export default OurLabs;