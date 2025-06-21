'use client';

import React from 'react';
import Navbar from '@/components/navbar/navbar';
import { useSearchParams, useRouter } from 'next/navigation';
import { labsData } from '@/lib/labData';

const LabViewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const labId = Number(searchParams.get('id'));
  
  // Find the lab with the matching ID
  const lab = labsData.find(l => l.id === labId);

  if (!lab) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p>Lab not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button 
          onClick={() => router.back()} 
          className="mb-6 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Labs
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{lab.name}</h1>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{lab.location}</span>
          </div>
        </header>

        <div className="space-y-8">
          {/* Description Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Description</h2>
            <p className="text-gray-700">{lab.description}</p>
          </section>

          {/* Research Area Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Research Area</h2>
            <p className="text-gray-700">{lab.researchArea}</p>
          </section>

          {/* Equipment Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Equipment List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lab.equipment.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Lab Staff Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Lab Staff</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lab.staff.map((person) => (
                    <tr key={person.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{person.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{person.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Current Researchers Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Current Researchers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lab.researchers.map((researcher) => (
                    <tr key={researcher.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{researcher.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{researcher.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        
        </div>
      </div>
    </>
  );
};

export default LabViewPage;