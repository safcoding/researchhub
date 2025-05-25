import Link from 'next/link';

export function Navbar() {
  return (
    <>      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#e0e0e0' }}>        <div style={{ display: 'flex', alignItems: 'center' }}>          <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/UTM-LOGO.png" alt="UTM Logo" style={{ height: '40px', marginRight: '10px' }}/>
          <div>
            {/* 
              Link component from Next.js that makes the ResearchHub title clickable
              - href="/": Routes the user to the homepage when clicked
              - style={{ textDecoration: 'none', color: 'inherit' }}: Removes the default underline and keeps the original text color
            */}
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              {/* 
                - margin: 0: Removes default margin for cleaner layout
                - fontSize: '18px': Sets the text size
                - cursor: 'pointer': Changes cursor to a hand icon on hover to indicate clickability
              */}
              <h1 style={{ margin: 0, fontSize: '18px', cursor: 'pointer' }}><b>ResearchHub</b></h1>
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '100px' }}>
          <a href="https://www.utm.my/" target="_blank" style={{ textDecoration: 'none', color: '#333' }}>UTM</a>
          <a href="https://mjiit.utm.my/" target="_blank" style={{ textDecoration: 'none', color: '#333' }}>UTM MJIIT</a>
          <a href="/login" style={{ textDecoration: 'none', color: '#333' }}>Login</a>
        </div>
      </nav>

      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-6">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/about" className="hover:underline">About</Link>              <Link href="/labs" className="hover:underline">Our Labs</Link>
              <Link href="/publications" className="hover:underline">Publications</Link>
                {/* Grants dropdown with hover functionality */}
              <div className="relative group">
                <div className="flex items-center hover:underline cursor-pointer">
                  <Link href="/grant" className="hover:no-underline">Grants</Link>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  <Link href="/grant" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    View Grants
                  </Link>
                  <Link href="/grant-db" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Add Grant
                  </Link>
                </div>
              </div>
              
              <Link href="/announcements" className="hover:underline">Announcements</Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}