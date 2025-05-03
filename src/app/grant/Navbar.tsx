import Link from "next/link";

export default function Navbar() {
    return (
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">UTM OFFICIAL</h1>
            <nav className="flex space-x-6">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Our Labs</a>
              <a href="#" className="hover:underline">Publications</a>
              <Link href="/grants" className="hover:underline text-gray-700 hover:text-blue-600"></Link>
              <a href="#" className="hover:underline">Announcements</a>
              <a href="#" className="hover:underline">ResearchHub</a>
            </nav>
          </div>
          <button className="bg-white text-blue-800 px-4 py-2 rounded">Login</button>
        </div>
      </header>
    );
  }