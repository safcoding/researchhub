'use client'
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header>
      <div className="bg-[#159b8a] text-white text-sm py-2 px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>+60 3-2203-1200</span>
          <span>research.mjiit@utm.my</span>
        </div>
        <div className="flex items-center gap-3">
            <Link href="https://www.facebook.com/mjiitutm/" aria-label="Facebook">
            <img src="/assets/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
            </Link>
            <Link href="https://www.instagram.com/mjiitutm/" aria-label="Instagram">
            <img src="/assets/icons/instagram.svg" alt="Instagram" className="w-5 h-5" />
            </Link>
            <Link href="https://x.com/MJIITOFFICIAL/" aria-label="X">
            <img src="/assets/icons/x.svg" alt="X" className="w-5 h-5" />
            </Link>
        </div>
        <div className="hidden md:flex gap-4">
          <Link href="https://www.utm.my/" target="_blank" className="hover:underline">UTM Official</Link>
          <Link href="https://mjiit.utm.my/" className="hover:underline">MJIIT</Link>
        </div>
      </div>
      <div className="bg-[#2b9167] py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="https://mjiit.utm.my/wp-content/uploads/2024/11/logo-mjiit.png"
            alt="Mjiit Logo"
            width={120}
            height={60}
            className="mr-4"
          />
        </div>
        <nav className="flex-1 flex items-center gap-8">
          <Link href="/" className="font-bold text-lg text-white hover:text-gray-200">Home</Link>
          <Link href="/about" className="font-bold text-lg text-white hover:text-gray-200">About</Link>
          <Link href="#" className="font-bold text-lg text-white hover:text-gray-200">Grants</Link>
          <Link href="#" className="font-bold text-lg text-white hover:text-gray-200">Publications</Link>
          <Link href="#" className="font-bold text-lg text-white hover:text-gray-200">Labs</Link>
          <Link href="/events" className="font-bold text-lg text-white hover:text-gray-200">Announcements</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;