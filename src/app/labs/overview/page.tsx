'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';
import { type Lab } from '@/hooks/lab-logic';
import { supabase } from '@/lib/db-connect';

const OurLabs = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Fetch labs from Supabase
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const { data, error } = await supabase
          .from('labs')
          .select('*')
          .order('LAB_NAME');
        
        if (error) throw error;
        const labsData = (data as Lab[]) || [];
        setLabs(labsData);
        
        // Set the first available department as default selected category
        if (labsData && labsData.length > 0) {
          const departments = [...new Set(labsData.map(lab => lab.DEPARTMENT).filter(Boolean))];          if (departments.length > 0 && !selectedDepartment) {
            setSelectedDepartment(departments[0]!);
          }
        }
      } catch (error) {
        console.error('Error fetching labs:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchLabs();
  }, [selectedDepartment]);

  // Get unique departments from labs data
  const getAvailableDepartments = () => {
    const departments = [...new Set(labs.map(lab => lab.DEPARTMENT).filter(Boolean))];
    return departments.sort();
  };

  // Get labs for selected department
  const getLabsForSelectedDepartment = () => {
    if (!selectedDepartment) return [];
    return labs.filter(lab => lab.DEPARTMENT === selectedDepartment);
  };

  const handleLabClick = (labId: string) => {
    router.push(`/labs/view-more?id=${labId}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading labs...</span>
        </div>
      </>
    );
  }

  const availableDepartments = getAvailableDepartments();
  const currentLabs = getLabsForSelectedDepartment();

  // If no labs exist, show a message
  if (labs.length === 0) {
    return (
      <>
        <Navbar />
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
      <Navbar />
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-gray-100 p-4 border-r border-gray-200">
          <h2 className="text-lg font-bold mb-4">Research Departments</h2>
          <div className="space-y-2">
            {availableDepartments.map((department) => (
              <button
                key={department}
                onClick={() => setSelectedDepartment(department)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedDepartment === department 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-800 hover:bg-gray-200'
                }`}
              >
                {department}
              </button>
            ))}
          </div>
          
          {/* Department Stats */}
          <div className="mt-6 p-4 bg-white rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Department Statistics</h3>
            <div className="space-y-1 text-sm">
              <div>Total Labs: {currentLabs.length}</div>
              <div>Active Labs: {currentLabs.filter(lab => lab.LAB_STATUS === 'Active').length}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50">
          {/* Department Header Section */}
          <div className="mb-6"> 
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{selectedDepartment} Labs</h1>
              <p className="text-sm text-gray-600">
                {currentLabs.length} labs available
              </p>
            </div>
          </div>

          {/* Labs Table */}
          {currentLabs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">No labs found for {selectedDepartment} department.</p>
              <button
                onClick={() => router.push('/labs')}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Lab
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/4">Lab Name</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Lab Head</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/4">Research Focus</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentLabs.map((lab) => (
                    <tr 
                      key={lab.LABID}
                      onClick={() => handleLabClick(lab.LABID)}
                      className="hover:bg-blue-50 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 group-hover:text-blue-600">
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
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 line-clamp-2">{lab.RESEARCH_AREA}</td>
                      <td className="px-4 py-3 text-gray-700">{lab.LOCATION}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OurLabs;
