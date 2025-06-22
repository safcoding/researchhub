'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ConditionalNavbar from '@/components/admin-sidebar/conditional-navbar';
import Navbar from '@/components/navbar';
// Fixed import path to match the actual file name (Footer.tsx with capital F)
import Footer from '@/components/Footer';
import { useAboutContent } from '@/hooks/about-content';

export default function AboutPage() {
  const { aboutContent, loading } = useAboutContent();
  
  return (
      <ConditionalNavbar>
      <Navbar /> 
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-8 text-center">{aboutContent.title}</h1>
              
              <div className="mb-12 relative h-64 md:h-96">
                <Image 
                  src="/api/placeholder/1200/600" 
                  alt="MJIIT Research Center" 
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg shadow-md"
                />
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-xl mb-6">
                  {aboutContent.intro_paragraph}
                </p>
                
                <p className="mb-6">
                  {aboutContent.main_paragraph}
                </p>                
                <p className="mb-6">
                  {aboutContent.conclusion_paragraph}
                </p>
                <p className="text-xl font-semibold mb-8 text-center">
                  {aboutContent.closing_statement}
                </p>
              </div>
              
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                  <div className="text-4xl mb-4">🔬</div>
                  <h3 className="text-xl font-semibold mb-2">Research Support</h3>
                  <p className="text-gray-600">Access resources, templates, and guidelines to support your research journey.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
                  <p className="text-gray-600">Connect with fellow researchers and explore collaborative opportunities.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-2">Impact Tracking</h3>
                  <p className="text-gray-600">Share and showcase your research achievements and measure your impact.</p>
                </div>
              </div>
              
              <div className="mt-16">
                <h2 className="text-3xl font-bold mb-6">Contact the Research Office</h2>
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <p className="mb-3"><strong>Location:</strong> MJIIT Building, UTM Kuala Lumpur Campus</p>
                  <p className="mb-3"><strong>Email:</strong> research.mjiit@utm.my</p>
                  <p className="mb-3"><strong>Phone:</strong> +60 3-2203-1200</p>
                  <p className="mb-6"><strong>Office Hours:</strong> Monday to Friday, 8:30 AM - 5:00 PM</p>
                  <Link href="/contact" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Get in Touch
                  </Link>                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </ConditionalNavbar>
  );
}