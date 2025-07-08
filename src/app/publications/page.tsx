'use client';

import React, { useState, useMemo, useEffect } from 'react';
import ConditionalNavbar from '@/components/admin-sidebar/conditional-navbar';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { PublicationLogic, type Publication, type PublicationFilters } from '@/hooks/logic/publication-logic';
import { PUBLICATION_TYPES, PUBLICATION_CATEGORIES } from '@/constants/publication-options';
import { PublicationFilters as PublicationFiltersComponent } from '@/components/admin-components/publications/publication-filters';
import { PublicationPieChart, type AggregatedTypeCount } from '@/components/pub-piechart';
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
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<PublicationFilters>({
    year: 'all',
    month: 'all',
    category: 'all',
    type: 'all',
    searchText: '',
  });

  const {
    publications,
    loading,
    error,
    refreshPublications,
    totalCount,
    fetchPublicationTypeCounts,
  } = PublicationLogic();

  useEffect(() => {
    refreshPublications({ page: currentPage, itemsPerPage, filters });
  }, [currentPage, itemsPerPage, filters, refreshPublications]);

  // For charts and stats
  const [selectedChartYear, setSelectedChartYear] = useState(new Date().getFullYear().toString());
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = useMemo(() => {
    const monthsArr: number[] = Array.from({ length: 12 }, () => 0);
    publications
      .filter(pub => pub.date && new Date(pub.date).getFullYear().toString() === selectedChartYear)
      .forEach(pub => {
        const month = new Date(pub.date).getMonth();
        if (month >= 0 && month < 12 && monthsArr[month] !== undefined) {
          monthsArr[month]++;
        }
      });
    return monthsArr;
  }, [publications, selectedChartYear]);
  const chartData = months.map((month, index) => ({
    month,
    publications: monthlyData[index]
  }));

  // Calculate statistics
  const currentYear = new Date().getFullYear().toString();
  const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);
  const totalPublications = totalCount;
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


  // Pagination logic for display
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedPublications = publications;

  // Pie chart aggregated data
  const [pieChartData, setPieChartData] = useState<AggregatedTypeCount[]>([]);
  useEffect(() => {
    fetchPublicationTypeCounts(filters).then(setPieChartData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);


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
      <h3 className="text-xl font-semibold">Monthly Publications</h3>      <select
        value={selectedChartYear}
        onChange={(e) => setSelectedChartYear(e.target.value)}
        className="p-2 border border-gray-300 rounded text-sm"
                aria-label="Select year for chart"
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
    <PublicationPieChart aggregatedData={pieChartData} />
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
                  {publications.length}
                </span>
              </h3>
            </div>


            {/* Filters */}
            <PublicationFiltersComponent
              filters={{
                category: (filters.category ?? '') as typeof PUBLICATION_CATEGORIES[number] | 'all',
                type: (filters.type ?? '') as typeof PUBLICATION_TYPES[number] | 'all',
                year: filters.year ?? '',
                month: filters.month ?? '',
                searchText: filters.searchText ?? '',
                dateFrom: filters.dateFrom ?? '',
                dateTo: filters.dateTo ?? '',
              }}
              publicationTypes={PUBLICATION_TYPES}
              publicationCategories={PUBLICATION_CATEGORIES}
              onFiltersChange={updated => {
                setFilters(prev => ({ ...prev, ...updated }));
                setCurrentPage(1);
              }}
            />
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
                {paginatedPublications.length > 0 ? (
                  paginatedPublications.map(pub => (
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
          {/* Pagination controls */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              Previous
            </button>
            <span className="px-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </ConditionalNavbar>
  );
};

export default PublicationsDashboard;