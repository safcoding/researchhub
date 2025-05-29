import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/navbar';

export default function AboutPage() {
  return (
    <div>
      <Navbar /> {/* Make sure this is the first element */}

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About the MJIIT Research Portal</h1>
          
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
              Welcome to the MJIIT Research Portal – a centralized platform designed exclusively for the researchers of the Malaysia-Japan International Institute of Technology (MJIIT). This portal serves as a dedicated space to support and streamline research-related activities across the institute.
            </p>
            
            <p className="mb-6">
              Our goal is to foster a collaborative and productive research environment by providing easy access to essential information, resources, and tools. The portal includes up-to-date announcements on research grants, templates for proposal submissions, and guidelines for research documentation. Researchers can also share their progress, update achievements, and stay informed on matters related to publications, consultancies, community engagement projects, and intellectual property.
            </p>
            
            <p className="mb-6">
              Whether you're preparing a grant application, reporting research outcomes, or exploring collaborative opportunities, this platform aims to simplify and support your work. We are committed to making research at MJIIT more connected, transparent, and impactful.
            </p>
              <p className="text-xl font-semibold mb-8 text-center">
              Together, let&apos;s advance innovation and excellence in research at MJIIT.
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
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Research Hub</h3>
              <p className="text-gray-400">Advancing knowledge through innovation and collaboration</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/programs" className="text-gray-400 hover:text-white">Programs</Link></li>
                <li><Link href="/research" className="text-gray-400 hover:text-white">Research</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/library" className="text-gray-400 hover:text-white">Library</Link></li>
                <li><Link href="/career" className="text-gray-400 hover:text-white">Career Services</Link></li>
                <li><Link href="/student-life" className="text-gray-400 hover:text-white">Student Life</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="not-italic text-gray-400">
                <p>Jalan Yahya Petra</p>
                <p>Kuala Lumpur, 54100</p>
                <p>Malaysia</p>
                <p>Email: info@researchhub.edu</p>
                <p>Phone: +60 118200203</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Research Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}