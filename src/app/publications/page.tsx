'use client';

import { useEffect } from 'react';
import ConditionalNavbar from '@/components/admin-sidebar/conditional-navbar';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { PublicationLogic } from '@/hooks/logic/publication-logic';
import { PublicationPieChart } from '@/components/pub-piechart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

// Stats Card Component (similar to grants)
const StatsCard = ({ title, amount, period }: { title: string; amount: string; period: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center h-40">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="text-4xl font-bold">{amount}</div>
    <p className="text-sm text-gray-600 mt-1">{period}</p>
  </div>
);

export default function PublicationsDashboard() {
  const { 
    loading, 
    error, 
    totalCount,
    analyticsLoaded,
    fetchDashboardStats,
    getPublicationStats, 
    getPublicationTypeData,
    getCategoryCounts,
    getTimelineData,
    getTotalPublications
  } = PublicationLogic();

  // Fetch optimized dashboard data
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (loading || !analyticsLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <ConditionalNavbar />
        <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading publications data... (Analytics: {analyticsLoaded ? 'Ready' : 'Loading'})</div>
          </div>
        </main>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <ConditionalNavbar />
        <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-red-600">Error: {error}</div>
          </div>
        </main>
      </div>
    );
  }

  // Check if we have data using totalCount instead of publications array
  if (totalCount === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <ConditionalNavbar />
        <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">No publications data available... (Total: {totalCount})</div>
          </div>
        </main>
      </div>
    );
  }

  // Debug: Check what data we have
  console.log('Dashboard Debug:', { totalCount, loading, error });

  const stats = getPublicationStats();
  const publicationTypeData = getPublicationTypeData();
  const categoryData = getCategoryCounts();
  const timelineData = getTimelineData();

  // Debug analytics data
  console.log('Analytics Debug:', { 
    stats, 
    publicationTypeDataLength: publicationTypeData.length,
    categoryDataLength: categoryData.length,
    timelineDataLength: timelineData.length 
  });

  return (
    <ConditionalNavbar>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Publications Dashboard</h1>
        </div>
        
        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatsCard 
            title="Total Publications" 
            amount={totalCount.toLocaleString()} 
            period="All Time" 
          />
          <StatsCard 
            title="This Month" 
            amount={stats.monthly.toLocaleString()} 
            period="New Publications" 
          />
          <StatsCard 
            title="This Quarter" 
            amount={stats.quarterly.toLocaleString()} 
            period="Total Count" 
          />
          <StatsCard 
            title="This Year" 
            amount={stats.yearly.toLocaleString()} 
            period="Annual Total" 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Line Chart - Spans full width */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cumulative Publications for {new Date().getFullYear()}</h2>
            <p className="text-sm text-gray-600 mb-4">Running total of publications throughout {new Date().getFullYear()}</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Cumulative Publications', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value, name) => [`${value} total`, 'Cumulative Publications']}
                    labelFormatter={(label) => `${label} ${new Date().getFullYear()}`}
                  />
                  <Line type="monotone" dataKey="publications" stroke="#2B9167" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Publication Types Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Publication Types</h2>
            <div className="h-80">
              <PublicationPieChart aggregatedData={publicationTypeData} />
            </div>
          </div>

          {/* Categories Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Publication Categories</h2>
            <div className="h-80">
              <PublicationPieChart aggregatedData={categoryData} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </ConditionalNavbar>
  );
}