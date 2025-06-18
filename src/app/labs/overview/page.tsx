'use client';
import React, { useState, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'all' | 'name' | 'head'>('all');
  const router = useRouter();

  const handleLabClick = (labId: number) => {
    router.push(`/labs/view-more?id=${labId}`);
  };

  // Filter labs based on search query and selected category
  const filteredLabs = useMemo(() => {
    let labs = categories[selectedCategory] || [];
    
    if (searchQuery.trim() === '') {
      return labs;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return labs.filter(lab => {
      try {
        switch (searchFilter) {
          case 'name':
            return lab.name?.toLowerCase().includes(query) || false;
          case 'head':
            return lab.labHead?.toLowerCase().includes(query) || false;
          case 'all':
          default:
            return (lab.name?.toLowerCase().includes(query) || false) ||
                   (lab.labHead?.toLowerCase().includes(query) || false) ||
                   (lab.description?.toLowerCase().includes(query) || false) ||
                   (lab.researchArea?.toLowerCase().includes(query) || false);
        }
      } catch (error) {
        console.error('Search filter error:', error);
        return false;
      }
    });
  }, [selectedCategory, searchQuery, searchFilter]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchFilter('all');
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-gray-100 p-4 border-r border-gray-200">
          <h2 className="text-lg font-bold mb-4">MJIIT Laboratories</h2>
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
          {/* Search Section */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Search Labs</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search for labs or lab heads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Search Filter Dropdown */}
              <div className="sm:w-48">
                <select
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value as typeof searchFilter)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Search All</option>
                  <option value="name">Lab Name</option>
                  <option value="head">Lab Head</option>
                </select>
              </div>
              
              {/* Clear Button */}
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            
            {/* Search Results Info */}
            {searchQuery && (
              <div className="mt-3 text-sm text-gray-600">
                Found {filteredLabs.length} result(s) for "{searchQuery}"
                {searchFilter !== 'all' && ` in ${searchFilter}`}
              </div>
            )}
          </div>

          {/* Category Header Section */}
          <div className="mb-6"> 
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-800">
                {selectedCategory} Labs
                {searchQuery && ` - Search Results`}
              </h1>
              <p className="text-sm text-gray-600">
                {filteredLabs.length} lab(s) {searchQuery ? 'found' : 'available'}
              </p>
            </div>
          </div>

          {/* Labs Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredLabs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchQuery ? (
                  <div>
                    <p className="text-lg mb-2">No labs found matching your search</p>
                    <p className="text-sm">Try adjusting your search terms or filter options</p>
                  </div>
                ) : (
                  <p>No labs available in this category</p>
                )}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/4">Lab Name</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Lab Head</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Lab Types</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/4">Research Focus</th>
                    <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLabs.map((lab) => (
                    <tr 
                      key={lab.id}
                      onClick={() => handleLabClick(lab.id)}
                      className="hover:bg-blue-50 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 group-hover:text-blue-600">
                          {lab.name}
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {lab.description?.substring(0, 60) || ''}...
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OurLabs;