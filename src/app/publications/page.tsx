'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/publications.css';
import Navbar from '@/components/navbar';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

type Publication = {
  id: number;
  title: string;
  author: string;
  type: string;
  category: string;
  date: string;
  year: string;
};

const PublicationsDashboard: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [selectedChartYear, setSelectedChartYear] = useState<string>('2023');

  const monthlyData = [32, 30, 124, 25, 20, 15, 0, 0, 0, 0, 0, 0];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = months.map((month, index) => ({ month, publications: monthlyData[index] }));

  // Sample data for publications
  const allPublications: Publication[] = [
    { id: 1, title: 'Advanced Machine Learning Techniques', author: 'Dr. Smith', type: 'Article', category: 'Journal', date: '2023-01-15', year: '2023' },
    { id: 2, title: 'Quantum Computing Applications', author: 'Dr. Johnson', type: 'Review', category: 'Conference', date: '2023-02-20', year: '2023' },
    { id: 3, title: 'Sustainable Energy Solutions', author: 'Dr. Lee', type: 'Article', category: 'Journal', date: '2023-03-10', year: '2023' },
    { id: 4, title: 'Neural Networks in Healthcare', author: 'Dr. Chen', type: 'Article', category: 'Journal', date: '2023-01-25', year: '2023' },
    { id: 5, title: 'Blockchain for Supply Chain', author: 'Dr. Wilson', type: 'Review', category: 'Conference', date: '2023-02-15', year: '2023' },
    { id: 6, title: 'AI in Financial Markets', author: 'Dr. Brown', type: 'Article', category: 'Journal', date: '2023-03-05', year: '2023' },
    { id: 7, title: 'Cybersecurity Trends 2023', author: 'Dr. Taylor', type: 'Article', category: 'Journal', date: '2023-01-30', year: '2023' },
    { id: 8, title: 'IoT in Smart Cities', author: 'Dr. Martinez', type: 'Review', category: 'Conference', date: '2023-02-28', year: '2023' },
    { id: 9, title: 'Biomedical Engineering Advances', author: 'Dr. Anderson', type: 'Article', category: 'Journal', date: '2023-03-15', year: '2023' },
    { id: 10, title: 'Data Privacy Regulations', author: 'Dr. Thomas', type: 'Article', category: 'Journal', date: '2022-01-10', year: '2022' },
    { id: 11, title: 'Augmented Reality in Education', author: 'Dr. White', type: 'Review', category: 'Conference', date: '2022-02-05', year: '2022' },
    { id: 12, title: 'Climate Change Modeling', author: 'Dr. Harris', type: 'Article', category: 'Journal', date: '2022-03-20', year: '2022' },
    { id: 13, title: '5G Network Security', author: 'Dr. Clark', type: 'Article', category: 'Journal', date: '2022-01-20', year: '2022' },
    { id: 14, title: 'Robotics in Manufacturing', author: 'Dr. Lewis', type: 'Review', category: 'Conference', date: '2022-02-10', year: '2022' },
    { id: 15, title: 'Genomic Data Analysis', author: 'Dr. Walker', type: 'Article', category: 'Journal', date: '2022-03-25', year: '2022' },
  ];

  // Function to generate a placeholder PDF link
  const getPdfLink = (id: number) => {
    return `https://www.utm.my/wp-content/uploads/2023/05/placeholder-publication-${id}.pdf`;
  };

  // Filtering logic
  const filteredPublications = useMemo(() => {
    return allPublications.filter(pub => {
      const matchesSearch = searchText === '' || 
        pub.title.toLowerCase().includes(searchText.toLowerCase()) || 
        pub.author.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesCategory = filterCategory === '' || 
        pub.category.toLowerCase() === filterCategory.toLowerCase();
      
      const matchesYear = filterYear === '' || 
        pub.year === filterYear;
      
      const matchesType = filterType === '' || 
        pub.type.toLowerCase() === filterType.toLowerCase();
      
      return matchesSearch && matchesCategory && matchesYear && matchesType;
    });
  }, [searchText, filterCategory, filterYear, filterType]);

  const totalPublications = allPublications.length;
  const publicationsThisYear = allPublications.filter(pub => pub.year === '2023').length;
  const publicationsThisQuarter = allPublications.filter(pub => {
    const date = new Date(pub.date);
    const quarter = Math.floor((date.getMonth() + 3) / 3);
    return pub.year === '2023' && quarter === 1;
  }).length;

  return (
    <div className="min-h-screen flex flex-col">
          <Navbar /> {/* Make sure this is the first element */}

      <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Publications Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Monthly Publications</h3>
              <select
                value={selectedChartYear}
                onChange={(e) => setSelectedChartYear(e.target.value)}
                className="p-2 border border-gray-300 rounded text-sm"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
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

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              All Publications 
              <span className="text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full ml-2">
                {filteredPublications.length}
              </span>
            </h3>
            
            <div className="flex gap-2">
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)} 
                className="border px-3 py-2 rounded text-sm"
              >
                <option value="">All Categories</option>
                <option value="Journal">Journal</option>
                <option value="Conference">Conference</option>
              </select>
              <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(e.target.value)} 
                className="border px-3 py-2 rounded text-sm"
              >
                <option value="">All Years</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)} 
                className="border px-3 py-2 rounded text-sm"
              >
                <option value="">All Types</option>
                <option value="Article">Article</option>
                <option value="Review">Review</option>
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
                  <th className="text-left px-4 py-2">Title</th>
                  <th className="text-left px-4 py-2">Author</th>
                  <th className="text-left px-4 py-2">Type</th>
                  <th className="text-left px-4 py-2">Category</th>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">PDF</th>
                </tr>
              </thead>
              <tbody>
                {filteredPublications.length > 0 ? (
                  filteredPublications.map(pub => (
                    <tr key={pub.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{pub.title}</td>
                      <td className="px-4 py-2">{pub.author}</td>
                      <td className="px-4 py-2">{pub.type}</td>
                      <td className="px-4 py-2">{pub.category}</td>
                      <td className="px-4 py-2">{pub.date}</td>
                      <td className="px-4 py-2">
                        <a 
                          href={getPdfLink(pub.id)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-1" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                            />
                          </svg>
                          View PDF
                        </a>
                      </td>
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