import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const Navbar = () => {
  return (
    <div>
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-3 bg-gray-100">
        <div className="flex items-center">
          <Image 
            src="https://upload.wikimedia.org/wikipedia/commons/8/81/UTM-LOGO.png"
            alt="UTM Logo"
            width={40}
            height={40}
            className="mr-3"
          />
          <Link href="/" className="text-lg font-bold hover:text-gray-700">
            ResearchHub
          </Link>
        </div>
        <div className="flex gap-8">
          <a href="https://www.utm.my/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">UTM</a>
          <a href="https://mjiit.utm.my/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">UTM MJIIT</a>
          <Link href="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
        </div>
      </nav>

      {/* Main Navigation */}
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-6">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/about" className="hover:underline">About</Link>
              
              {/* Grants dropdown with hover functionality */}
              <div className="relative group">
                <div className="flex items-center hover:underline cursor-pointer">
                  <Link href="/grant" className="hover:no-underline">Grant</Link>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  <Link href="/grant" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    View Grants
                  </Link>
                  <Link href="/grant-db" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Add Grant
                  </Link>
                </div>
              </div>

              {/* Grants dropdown with hover functionality */}
              <div className="relative group">
                <div className="flex items-center hover:underline cursor-pointer">
                  <Link href="/grant" className="hover:no-underline">Publication</Link>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  <Link href="/publications" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    View Publication
                  </Link>
                  <Link href="/publications-add" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Add Publication
                  </Link>
                </div>
              </div>

              <div className="relative group">            
                <div className="flex items-center hover:underline cursor-pointer">
                  <Link href="/announcements" className="hover:no-underline">Announcements</Link>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  <Link href="/announcements" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    View Announcements
                  </Link>
                  <Link href="/announcement-crud" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Add Announcement
                  </Link>
              </div>
            </div>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;