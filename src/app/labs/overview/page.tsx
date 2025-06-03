'use client';
import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';
import { labsData } from '@/lib/labData';

// Define category keys type
type CategoryKey = 'Materials Science' | 'Computer Science' | 'Biotechnology';

// Group labs by category
const categories: Record<CategoryKey, typeof labsData> = {
  'Materials Science': labsData.filter(lab => lab.department === 'Materials Science'),
  'Computer Science': labsData.filter(lab => lab.department === 'Computer Science'),
  'Biotechnology': labsData.filter(lab => lab.department === 'Biotechnology')
};

const OurLabs = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('Materials Science');
  const router = useRouter();

  const handleLabClick = (labId: number) => {
    router.push(`/labs/view-more?id=${labId}`); // Navigate to lab details page, not working
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
                    key={lab.id}
                    onClick={() => handleLabClick(lab.id)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600">
                        {lab.name}
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {lab.description.substring(0, 60)}...
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{lab.labHead}</td>
                    <td className="px-4 py-3 text-gray-700">{lab.department}</td>
                    <td className="px-4 py-3 text-gray-700 line-clamp-2">{lab.researchArea}</td>
                    <td className="px-4 py-3 text-gray-700">{lab.location}</td>
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