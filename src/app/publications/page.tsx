'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import { PublicationLogic } from '@/hooks/publication-logic';
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
  
  // Filtering logic
  const filteredPublications = useMemo(() => {
    return publications.filter(pub => {
      const matchesSearch = searchText === '' || 
        pub.title.toLowerCase().includes(searchText.toLowerCase()) || 
        pub.journal.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesCategory = filterCategory === '' || 
        pub.category.toLowerCase() === filterCategory.toLowerCase();
      
      const matchesYear = filterYear === '' || 
        new Date(pub.date).getFullYear().toString() === filterYear;
      
      const matchesType = filterType === '' || 
        pub.type.toLowerCase() === filterType.toLowerCase();
      
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-xl">Loading publications...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-xl text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Publications Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
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
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Publications', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="publications" stroke="#0056b3" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
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
        </div>

        {/* Publications Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">
                All Publications 
                <span className="text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full ml-2">
                  {filteredPublications.length}
                </span>
              </h3>

              <Link 
                href="/publication-add"
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center transition-colors"
              >

                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
                Add Publication
              </Link>
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
                <option value="">All Types</option>
                <option value="Article">Article</option>
                <option value="Conference">Conference</option>
                <option value="Book Chapter">Book Chapter</option>
                <option value="Book">Book</option>
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
                      <td className="px-4 py-2">{pub.journal}</td>
                      <td className="px-4 py-2">{pub.type}</td>
                      <td className="px-4 py-2">{pub.category}</td>
                      <td className="px-4 py-2">{pub.impact}</td>
                      <td className="px-4 py-2">{pub.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                      No publications found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Research Hub</h3>
              <p className="text-gray-400">Advancing knowledge through innovation</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/labs" className="text-gray-400 hover:text-white">Our Labs</Link></li>
                <li><Link href="/research" className="text-gray-400 hover:text-white">Research</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/grants" className="text-gray-400 hover:text-white">Grants</Link></li>
                <li><Link href="/publications" className="text-gray-400 hover:text-white">Publications</Link></li>
                <li><Link href="/announcements" className="text-gray-400 hover:text-white">Announcements</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <address className="not-italic text-gray-400">
                <p>Jalan Yahya Petra</p>
                <p>Kuala Lumpur, 54100</p>
                <p>Malaysia</p>
                <p>research@utm.my</p>
                <p>+60 3-2203-1200</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} UTM ResearchHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicationsDashboard;