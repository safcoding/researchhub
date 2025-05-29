// src/app/grant/page.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import StatsCard from './statcards';
import GrantsPie from './gantchart1';
import LineChart from './linechart';
import Navbar from '@/components/navbar';

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
          {/* Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Grants Timeline</h2>
            <div className="h-80">
              <LineChart data={grantData.timeline} />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Grant Types Distribution</h2>
            <div className="h-80">
              <GrantsPie data={grantData.types} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer matching about page */}
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
            <p>&copy; {new Date().getFullYear()} ResearchHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}