// src/components/navbar.tsx
'use client'
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import MJIIT from '@/images/mjiit.png'; //added image

const Navbar = () => {

  return (
    <div>
     {/* Top Navigation #0A867D */}
        <header style={{ backgroundColor: '#2B9167' }} className="text-white py-2 px-4">
          <div className="max-w-screen-sm ml-auto flex justify-end items-center">
            <nav className="flex space-x-4">
              <a
                href="https://www.utm.my/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                UTM
              </a>
              <a
                href="https://mjiit.utm.my/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                UTM MJIIT
              </a>
              <Link href="/admin/login" className="hover:underline">
                Login
              </Link>
            </nav>
          </div>
        </header>




      {/* Middle Navigation */}
      <nav className="flex items-center justify-between p-3 bg-gray-100">
        <div className="flex items-center">
          <Image 
            src={MJIIT}
            alt="Mjiit Logo"
            width={380}
            height={380}
            className="mr-3"
          />
          </div>
          <div className="text-left">
              <Link href="/" className="text-3xl font-bold hover:text-gray-700 block">
                ResearchHub
              </Link>
          </div>
      </nav>



      {/* Main Navigation */}
      <header style={{ backgroundColor: '#0A867D' }} className="text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-6">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/grants" className="hover:underline">Grants</Link>
              <Link href="/publications" className="hover:underline">Publications</Link>
              <Link href="/labs" className="hover:underline">Labs</Link>
              <Link href="/announcements" className="hover:underline">Announcements</Link>

            </nav>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;