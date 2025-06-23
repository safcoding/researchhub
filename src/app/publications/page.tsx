'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ConditionalNavbar from '@/components/admin-sidebar/conditional-navbar';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { PublicationLogic } from '@/hooks/publication-logic';
import { PublicationPieChart } from '@/components/pub-piechart';

// Importing the Pie chart component for publication types
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const PublicationsDashboard: React.FC = () => {
  const { publications, loading, error } = PublicationLogic();
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [selectedChartYear, setSelectedChartYear] = useState(new Date().getFullYear().toString());

  // Calculate monthly data from actual publications
  const monthlyData = useMemo(() => {
    const months = new Array(12).fill(0);
    if (!publications) return months;
    
    publications
      .filter(pub => pub.date && new Date(pub.date).getFullYear().toString() === selectedChartYear)
      .forEach(pub => {
        const month = new Date(pub.date).getMonth();
        if (month >= 0 && month < 12) {
          months[month]++;
        }
      });
    return months;
  }, [publications, selectedChartYear]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = months.map((month, index) => ({ 
    month, 
    publications: monthlyData[index] 
  }));
  
  //FILTERING LOGIC 
  const filteredPublications = useMemo(() => {
  const knownTypes = [
    'book chapter',
    'original book',
    'publication in web of science',
    'conference paper',
    'proceedings',
    'scopus'
  ];

  return publications.filter(pub => {
    const matchesSearch = searchText === '' || 
      pub.title.toLowerCase().includes(searchText.toLowerCase()) || 
      pub.journal.toLowerCase().includes(searchText.toLowerCase()) ||
      pub.author_name.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory = filterCategory === '' || 
      pub.category.toLowerCase() === filterCategory.toLowerCase();
    
    const matchesYear = filterYear === '' || 
      new Date(pub.date).getFullYear().toString() === filterYear;
    
    const pubType = pub.type.toLowerCase();

    const matchesType =
      filterType === '' || 
      filterType === 'All Types' ||
      (filterType === 'Others'
        ? !knownTypes.includes(pubType)
        : pubType === filterType.toLowerCase());

    return matchesSearch && matchesCategory && matchesYear && matchesType;
  });
}, [publications, searchText, filterCategory, filterYear, filterType]);


  // Calculate statistics
  const currentYear = new Date().getFullYear().toString();
  const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);

  const totalPublications = publications.length;
  const publicationsThisYear = publications.filter(
    pub => new Date(pub.date).getFullYear().toString() === currentYear
  ).length;
  const publicationsThisQuarter = publications.filter(pub => {
    const date = new Date(pub.date);
    const pubYear = date.getFullYear().toString();
    const pubQuarter = Math.floor((date.getMonth() + 3) / 3);
    return pubYear === currentYear && pubQuarter === currentQuarter;
  }).length;


  // Available years for filtering
  const availableYears = useMemo(() => {
    const years = new Set(publications.map(pub => 
      new Date(pub.date).getFullYear().toString()
    ));
    return Array.from(years).sort().reverse();
  }, [publications]);
  
  if (loading) {
    return (
      <ConditionalNavbar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading publications...</div>
        </div>
      </ConditionalNavbar>
    );
  }

  if (error) {
    return (
      <ConditionalNavbar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-600">Error: {error}</div>
        </div>
      </ConditionalNavbar>
    );
  }

  return (
    <ConditionalNavbar>
      <Navbar />
      <main className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Publications Dashboard</h1>

    {/* Statistics Row Above Charts */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center h-40">
        <h3 className="text-lg font-semibold mb-2">Total Publications</h3>
        <div className="text-4xl font-bold">{totalPublications}</div>
      </div>
  
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center h-40">
    <h3 className="text-lg font-semibold mb-2">Publications This Year</h3>
    <div className="text-4xl font-bold">{publicationsThisYear}</div>
  </div>
  
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center h-40">
    <h3 className="text-lg font-semibold mb-2">Publications This Quarter</h3>
    <div className="text-4xl font-bold">{publicationsThisQuarter}</div>
  </div>
</div>

{/* Charts Row */}
<div className="flex flex-col lg:flex-row gap-8 mb-8 min-w-0">
  {/* Line Chart */}
  <div className="w-full lg:flex-[2] bg-white p-6 rounded-xl shadow-md min-h-[400px]">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold">Monthly Publications</h3>
      <select
        value={selectedChartYear}
        onChange={(e) => setSelectedChartYear(e.target.value)}
        className="p-2 border border-gray-300 rounded text-sm"
      >
        {availableYears.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
    <div className="h-80 min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis label={{ value: 'Publications', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="publications" stroke="#2B9167" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>

 {/* Pie Chart */}
<div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-md">
  <h3 className="text-xl font-semibold mb-6">Publication Distribution</h3>
  <div className="flex flex-col items-center justify-center gap-6 pt-4 pb-6">
    <PublicationPieChart publications={filteredPublications} />
  </div>
</div>

</div>


        {/* Publications Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">
                All Publications 
                <span
                    className="text-sm px-2 py-1 rounded-full ml-2"
                    style={{ backgroundColor: '#D6F0E7', color: '#2B9167' }}
                  >
                  {filteredPublications.length}
                </span>
              </h3>
            </div>

            <div className="flex gap-2">
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)} 
                className="border px-3 py-2 rounded text-sm"
              >
                <option value="">All Categories</option>
                <option value="Journal">Journal</option>
                <option value="Conference">Conference</option>
                <option value="Book">Book</option>
              </select>

              <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(e.target.value)} 
                className="border px-3 py-2 rounded text-sm"
              >
                <option value="">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)} 
                className="border px-3 py-2 rounded text-sm"
              >

                {/*TYPES FILTER*/}
                <option value="All Types">All Types</option>
                <option value="BOOK CHAPTER">Book Chapter</option>
                <option value="ORIGINAL BOOK">Research Book</option>
                <option value="Scopus">Scopus</option>
                <option value="PUBLICATION IN WEB OF SCIENCE">Web of Science</option>
                <option value="CONFERENCE PAPER">Conference</option>
                <option value="PROCEEDINGS">Proceeding</option>
                <option value="Others">Others</option>
              </select>

              <input
                type="text"
                placeholder="Search titles or authors..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border px-3 py-2 rounded text-sm w-40"
              />
            </div>
          </div>

          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2">Ref No</th>
                  <th className="text-left px-4 py-2">Title</th>
                  <th className="text-left px-4 py-2">Author</th>
                  <th className="text-left px-4 py-2">Journal</th>
                  <th className="text-left px-4 py-2">Type</th>
                  <th className="text-left px-4 py-2">Category</th>
                  <th className="text-left px-4 py-2">Impact</th>
                  <th className="text-left px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPublications.length > 0 ? (
                  filteredPublications.map(pub => (
                    <tr key={pub.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{pub.pub_refno}</td>
                      <td className="px-4 py-2">{pub.title}</td>
                      <td className="px-4 py-2">{pub.author_name}</td>
                      <td className="px-4 py-2">{pub.journal}</td>
                      <td className="px-4 py-2">{pub.type}</td>
                      <td className="px-4 py-2">{pub.category}</td>
                      <td className="px-4 py-2">{pub.impact}</td>
                      <td className="px-4 py-2">{new Date(pub.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                      No publications found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </ConditionalNavbar>
  );
};

export default PublicationsDashboard;