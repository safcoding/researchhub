// src/components/navbar.tsx
'use client'
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
        <div className="flex gap-8 items-center">
          <a href="https://www.utm.my/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">UTM</a>
          <a href="https://mjiit.utm.my/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">UTM MJIIT</a>
          <Link href="/admin/login" className="text-lg font-bold hover:text-gray-700">Login</Link>
        </div>
      </nav>

      {/* Main Navigation */}
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-6">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/announcements" className="hover:underline">Announcements</Link>
              <Link href="/labs/overview" className="hover:underline">Labs</Link>
              <Link href="/publications" className="hover:underline">Publications</Link>
              <Link href="/grant" className="hover:underline">Grants</Link>
  
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;