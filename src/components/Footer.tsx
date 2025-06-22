'use client';
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Research Hub</h3>
            <p className="text-gray-400">Advancing knowledge through innovation and collaboration</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/dbcri-office" className="text-gray-400 hover:text-white">DBCRI Office</Link></li>
              <li><Link href="https://rmc.utm.my/" target="_blank" className="text-gray-400 hover:text-white">UTM RMC</Link></li>
              <li><Link href="/downloads" className="text-gray-400 hover:text-white">Downloadable Forms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <address className="not-italic text-gray-400 leading-relaxed">
              <p>MJIT Building, UTM Kuala Lumpur Campus,</p>
              <p>Jalan Yahya Petra, 54100 Kuala Lumpur,</p>
              <p>Malaysia.</p>
              <p>Email: research.mjiit@utm.my</p>
              <p>Phone: +60 3-2203-1200</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Research Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
