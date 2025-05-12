import Link from 'next/link';

export function Navbar() {
  return (
    <>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#e0e0e0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/UTM-LOGO.png" alt="UTM Logo" style={{ height: '40px', marginRight: '10px' }}/>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px' }}><b>UTM ResearchHub</b></h1>
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
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/labs" className="hover:underline">Our Labs</Link>
              <Link href="/publications" className="hover:underline">Publications</Link>
              <Link href="/grant" className="hover:underline">Grants</Link>
              <Link href="/announcements" className="hover:underline">Announcements</Link>
              <Link href="/grant-db" className="hover:underline">Grant Add</Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}