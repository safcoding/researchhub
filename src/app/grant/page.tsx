'use client';
import Link from 'next/link';
import Image from 'next/image';
import StatsCard from './statcards';
import GrantsPie from './gantchart1';
import LineChart from './linechart';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';

interface GrantType {
  type: string;
  percentage: number;
}

export default function GrantsDashboard() {
  // Sample data
  const grantData = {
    stats: {
      monthly: 320000,
      quarterly: 950000,
      yearly: 4200000
    },
    types: [
      { type: 'University', percentage: 45 },
      { type: 'Private', percentage: 40 },
      { type: 'International', percentage: 35 },
      { type: 'National', percentage: 30 }
    ],
    timeline: {
      labels: ['Jan', 'Apr', 'Jul', 'Oct', 'Jan', 'Apr', 'Jul', 'Oct', 'Jan', 'Apr', 'Jul', 'Oct', 'Jan', 'Apr', 'Jul', 'Oct'],
      values: [0, 5, 10, 15, 20, 25, 30, 35, 40, 35, 30, 25, 20, 25, 30, 45]
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Grants Dashboard</h1>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard
            title="Grants Secured"
            amount={`RM${grantData.stats.monthly.toLocaleString()}`}
            period="This Month"
          />
          <StatsCard
            title="Grants Secured"
            amount={`RM${grantData.stats.quarterly.toLocaleString()}`}
            period="This Quarter"
          />
          <StatsCard
            title="Grants Secured"
            amount={`RM${grantData.stats.yearly.toLocaleString()}`}
            period="This Year"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Grants Timeline</h2>
            <div className="h-80">
              <LineChart data={grantData.timeline} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Grant Types Distribution</h2>
            <div className="h-80">
              <GrantsPie data={grantData.types} />
            </div>
          </div>
        </div>
      </main>

      {/* Shared Footer Component */}
      <Footer />
    </div>
  );
}
