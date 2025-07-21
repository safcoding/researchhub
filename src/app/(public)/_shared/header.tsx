'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import { Mail } from 'lucide-react';
const Header = () => {
  return (
    <header>
      <div className="bg-[#159b8a] text-white text-sm py-2 px-4 flex justify-between items-center">
        <div className="flex items-center gap-3 justify-start">
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            +60 3-2203-1200
          </span>
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            research.mjiit@utm.my
          </span>
            <Link href="https://www.facebook.com/mjiitutm/" aria-label="Facebook">
            <Image src="/assets/icons/facebook.svg" alt="Facebook" 
            width={20}
            height={20}
            />
            </Link>
            <Link href="https://www.instagram.com/mjiitofficial/" aria-label="Instagram">
            <Image src="/assets/icons/instagram.svg" alt="Instagram"
            width={20}
            height={20}
            />
            </Link>
            <Link href="https://x.com/MJIITOFFICIAL/" aria-label="X">
            <Image src="/assets/icons/x.svg" alt="X"
            width={20}
            height={20}
            />
            </Link>
        </div>
        <div className="hidden md:flex gap-4">
          <Link href="/login" target="_blank" className="hover:underline">Login</Link>
          <Link href="https://www.utm.my/" target="_blank" className="hover:underline">UTM Official</Link>
          <Link href="https://mjiit.utm.my/" className="hover:underline">MJIIT</Link>
        </div>
      </div>
      <div className="bg-[#2b9167] py-6 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-lg text-white hover:text-gray-200">
            <Image
            src="/assets/icons/researchUnit.png"
            alt="Mjiit Logo"
            width={400}
            height={200}
            className="mr-4"
            />
          </Link>
        </div>
        <nav className="flex-1 flex items-center gap-8">
          <Link href="/" className="font-bold text-lg text-white hover:text-gray-200">Home</Link>
          <Link href="/about" className="font-bold text-lg text-white hover:text-gray-200">About</Link>
          <Link href="/partners" className="font-bold text-lg text-white hover:text-gray-200">Our Partners</Link>
          <Link href="/grants" className="font-bold text-lg text-white hover:text-gray-200">Grants</Link>
          <Link href="/publications" className="font-bold text-lg text-white hover:text-gray-200">Publications</Link>
          <Link href="/labs" className="font-bold text-lg text-white hover:text-gray-200">Labs</Link>
          <Link href="/events" className="font-bold text-lg text-white hover:text-gray-200">Events</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;