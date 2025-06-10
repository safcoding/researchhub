'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';
import { LabLogic, type Lab } from '@/hooks/lab-logic';
import { supabase } from '@/lib/db-connect';



// Define category keys type
type CategoryKey = 'Materials Science' | 'Computer Science' | 'Biotechnology';

const OurLabs = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('Materials Science');
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
        setLabs(data || []);
      } catch (error) {
        console.error('Error fetching labs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);


      // Group labs by category
    const categories: Record<CategoryKey, Lab[]> = {
      'Materials Science': labs.filter(lab => lab.DEPARTMENT === 'Materials Science'),
      'Computer Science': labs.filter(lab => lab.DEPARTMENT === 'Computer Science'),
      'Biotechnology': labs.filter(lab => lab.DEPARTMENT === 'Biotechnology')
    };

      const handleLabClick = (labId: string) => {
    router.push(`/labs/view-more?id=${labId}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div>Loading labs...</div>
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
          <h2 className="text-lg font-bold mb-4">Research Categories</h2>
          <div className="space-y-2">
            {Object.keys(categories).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as CategoryKey)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50">
          {/* Category Header Section */}
          <div className="mb-6"> 
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{selectedCategory} Labs</h1>
              <p className="text-sm text-gray-600">
                {categories[selectedCategory]?.length ?? 0} labs available
              </p>
            </div>
          </div>

          {/* Labs Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/4">Lab Name</th>
                  <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Lab Head</th>
                  <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Department</th>
                  <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/4">Research Focus</th>
                  <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories[selectedCategory]?.map((lab) => (
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
                    <td className="px-4 py-3 text-gray-700">{lab.DEPARTMENT}</td>
                    <td className="px-4 py-3 text-gray-700 line-clamp-2">{lab.RESEARCH_AREA}</td>
                    <td className="px-4 py-3 text-gray-700">{lab.LOCATION}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurLabs;