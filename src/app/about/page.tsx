'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ConditionalNavbar from '@/components/admin-sidebar/conditional-navbar';
import Navbar from '@/components/navbar';
import organizationChartImage from '@/images/organizationchart.png'; //added image
import MrAifaa from '@/images/mraifaa.png'; //added image
import MrShaiful from '@/images/mrshaiful.png'; //added image 
import MrsAriffi from '@/images/mrsariffi.png'; //added image
import DeputyDean from '@/images/deputydean.png'; //added image


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
              
              <div className="flex flex-col md:flex-row gap-6 mb-12 items-start">

            {/* Deputy Dean Image */}
            <Image
              src={DeputyDean}
              alt="Deputy Dean"
              width={350}
              height={350}
              className="rounded-lg shadow-md object-cover flex-shrink-0"
            />

            {/* Text Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl mb-6">{aboutContent.intro_paragraph}</p>
              <p className="mb-6">{aboutContent.main_paragraph}</p>
              <p className="mb-6">{aboutContent.conclusion_paragraph}</p>
              <p className="text-xl font-semibold mb-8 text-center">{aboutContent.closing_statement}</p>
            </div>
          </div>

                        
            </>
          )}
         
          {/*Info Cards*/}
          <div>
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
        </div>
        </div>


         {/*OUR TEAM SECTION */} 
        <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Our Team </h2>

         {/*ORGANIZATION CHART IMAGE */} 
            <Image 
              src={organizationChartImage}
              alt="Organization Chart"
              width={1200}
              height={800}
              className="rounded-lg shadow-md mx-auto"
            />

            {/*HEADS OF RESEARCH ADMIN */} 
          <div className="mt-12"> 
            <h2 className="text-3xl font-bold mb-6">Staff of Research Administration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Image 
                  src={MrAifaa}
                  alt="Mr Aifaa" 
                  width={200} 
                  height={200} 
                  className="rounded-full mb-4 mx-auto"
                />
                <h3 className="text-xl font-semibold mb-2">MR. AIFAA NAZMI BIN ALI</h3>
                <p className="text-gray-600">Assistant Registrar</p>
                <p className="text-gray-600"><i>iKohza</i></p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Image 
                  src={MrShaiful} 
                  alt="Dr. Jane Smith" 
                  width={200} 
                  height={200} 
                  className="rounded-full mb-4 mx-auto"
                />
                <h3 className="text-xl font-semibold mb-2">MR. MOHD SHAIFUL BIN ZAINAL</h3>
                <p className="text-gray-600">Senior Administrative Assistant</p>
                 <p className="text-gray-600"><i>iKohza</i></p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Image 
                  src={MrsAriffi}
                  alt="Dr. Emily Johnson" 
                  width={200} 
                  height={200} 
                  className="rounded-full mb-4 mx-auto"
                />
                <h3 className="text-xl font-semibold mb-2">MRS. ARIFFI SURAYA BINTI RAHMANI</h3>
                <p className="text-gray-600">Research Officer</p>
                 <p className="text-gray-600"><i>iKohza</i></p>
              </div>
            </div>
          </div>

          {/* CONTACT SECTION */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">Contact the Research Office</h2>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <p className="mb-3"><strong>Location:</strong> MJIIT Building, UTM Kuala Lumpur Campus</p>
              <p className="mb-3"><strong>Email:</strong> research.mjiit@utm.my</p>
              <p className="mb-3"><strong>Phone:</strong> +60 3-2203-1200</p>
              <p className="mb-6"><strong>Office Hours:</strong> Monday to Friday, 8:30 AM - 5:00 PM</p>
              <Link
                href="/contact"
                className="inline-block text-white px-6 py-2 rounded-md"
                style={{ backgroundColor: '#2B9167' }}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </ConditionalNavbar>
  );
}