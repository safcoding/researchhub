'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import StatsCard from './statcards';
import GrantsPie from './gantchart1';
import LineChart from './linechart';
import ConditionalNavbar from '@/components/admin-sidebar/conditional-navbar'; 
import Footer from '@/components/Footer';
import { GrantLogic } from '@/hooks/logic/grant-logic';
import Navbar from '@/components/navbar';

export default function GrantsDashboard() {
  const { 
    grants,
    loading, 
    error, 
    fetchDashboardStats,
    getGrantStats, 
    getGrantTypeData, 
    getSponsorCategoryData,
    getTimelineData,
    getTotalApprovedAmount
  } = GrantLogic();

  // Fetch optimized dashboard data
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <ConditionalNavbar />
        <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading grant data...</div>
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

  // Only calculate analytics if we have grants data
  if (!grants || grants.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <ConditionalNavbar />
        <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">No grant data available...</div>
          </div>
        </main>
      </div>
    );
  }

  const stats = getGrantStats();
  const grantTypeData = getGrantTypeData();
  const sponsorData = getSponsorCategoryData();
  const timelineData = getTimelineData();
  const totalAmount = getTotalApprovedAmount();


  return (
    <ConditionalNavbar>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Grants Dashboard</h1>
        </div>
        
        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatsCard 
            title="Total Approved" 
            amount={`RM${totalAmount.toLocaleString()}`} 
            period="All Time" 
          />
          <StatsCard 
            title="This Month" 
            amount={`RM${stats.monthly.toLocaleString()}`} 
            period="New Grants" 
          />
          <StatsCard 
            title="This Quarter" 
            amount={`RM${stats.quarterly.toLocaleString()}`} 
            period="Total Value" 
          />
          <StatsCard 
            title="This Year" 
            amount={`RM${stats.yearly.toLocaleString()}`} 
            period="Annual Total" 
          />
        </div>

        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Line Chart - Spans full width */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cumulative Grants Value for {new Date().getFullYear()}</h2>
            <p className="text-sm text-gray-600 mb-4">Running total of grant amounts received throughout {new Date().getFullYear()} (RM)</p>
            <div className="h-80">
              <LineChart data={timelineData} />
            </div>
          </div>

          {/* Grant Types Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Grant Types</h2>
            <div className="h-80">
              <GrantsPie data={grantTypeData} />
            </div>
          </div>

          {/* Sponsor Categories */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sponsor Categories</h2>
            <div className="h-80">
              <GrantsPie data={sponsorData} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </ConditionalNavbar>

  );
}
