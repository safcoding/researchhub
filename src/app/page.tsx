import Image from 'next/image';
import Link from 'next/link';

import React from 'react';

const TopNavigationFlexbox = () => {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#e0e0e0' }}>      <div style={{ display: 'flex', alignItems: 'center' }}>        <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/UTM-LOGO.png" alt="UTM Logo" style={{ height: '40px', marginRight: '10px' }}/>
        <div>
          {/* 
            Home page navigation - Link component to make ResearchHub title clickable
            - Clicking on this will navigate to the home page (/)
            - Removes default link styling and maintains the current text color
          */}
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            {/* Cursor: pointer gives visual feedback that this is clickable */}
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
  );
};

const HomePage = () => {
  return (
    <div>
      <TopNavigationFlexbox />
    
      
      <NavigationFlexbox />

      {/* Achievements */}
     
      <section className="py-12 bg-gray-50">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold mb-8 text-center">Our Achievements</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {
          id: 1,
          image: '/news-1.jpg',
          date: 'October 15, 2023',
          title: 'Achievement Announcement 1',
          description: 'Congratulations to Dr. Smith for receiving the Highly Cited Researcher award...',
          link: '/news/1',
        },
        {
          id: 2,
          image: '/news-2.jpg',
          date: 'November 10, 2023',
          title: 'Achievement Announcement 2',
          description: 'Our team has published a groundbreaking paper on AI advancements...',
          link: '/news/2',
        },
        {
          id: 3,
          image: '/news-3.jpg',
          date: 'December 5, 2023',
          title: 'Achievement Announcement 3',
          description: 'We secured a major research grant for renewable energy projects...',
          link: '/news/3',
        },
      ].map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 relative">
            <Image 
              src={item.image} 
              alt={item.title} 
              fill 
              style={{ objectFit: 'cover' }} 
            />
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-2">Posted: {item.date}</p>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <Link href={item.link} className="text-blue-600 hover:text-blue-800 font-medium">
              Read more →
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Announcements */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Latest Announcements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 relative">
                  <Image 
                    src={`/news-${item}.jpg`} 
                    alt={`News ${item}`} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">Opens: October 15, 2023</p>
                  <p className="text-sm text-gray-500 mb-2">Closes: January 15, 2024</p>
                  <h3 className="text-xl font-semibold mb-2">Research Grant Announcement</h3>
                  <p className="text-gray-600 mb-4">New research grants available for reseachers...</p>
                  <p ></p>
                  <Link href="/news/1" className="text-blue-600 hover:text-blue-800 font-medium">
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Publication Details", icon: "🎓" },
              
              { title: "Research Opportunities", icon: "🔬" },
              { title: "International Collaboration", icon: "🌏" },
              { title: "Industry Partnership", icon: "🏭" },
              
            ].map((program, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-gray-600 mb-4">Discover our range of programs designed to empower the next generation.</p>
                <Link href={`/programs/${index}`} className="text-blue-600 hover:text-blue-800 font-medium">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Conferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { date: "Nov 12", title: "International Research Conference", location: "Razak Tower" },
              { date: "Nov 15", title: "Nvidia workshop", location: "BK-12" },
              { date: "Nov 20", title: "Industry-Academia Networking Session", location: "Sakura Hall" },
              { date: "Dec 05", title: "End of Year Research Showcase", location: "BK-1" },
            ].map((event, index) => (
              <div key={index} className="flex bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-700 text-white py-4 px-6 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{event.date.split(" ")[0]}</span>
                  <span>{event.date.split(" ")[1]}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-2">
                    <span className="inline-block mr-2">📍</span>
                    {event.location}
                  </p>
                  <Link href="/events" className="text-blue-600 hover:text-blue-800 font-medium">
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
};

const Dashboard = () => {
  return (
    <div>
      <header className="dashboard-header">
        <h1>Public Dashboard</h1>
      </header>

      <section className="dashboard-section">
        <h2>Statistics</h2>
        <ul>
          <li>Total Users: 1,200</li>
          <li>Active Projects: 45</li>
          <li>Events This Month: 5</li>
        </ul>
      </section>

      <section className="dashboard-section">
        <h2>Recent Updates</h2>
        <ul>
          <li>New Research Paper Published</li>
          <li>Upcoming Workshop on AI</li>
          <li>Website Maintenance Scheduled</li>
        </ul>
      </section>

      <footer className="dashboard-footer">
        <p>&copy; 2025 ResearchHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

/*
const NavigationFlexbox = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', padding: '10px', backgroundColor: '#2941ba' }}>
      <a href="/" style={{ textDecoration: 'none', color: 'white' }}>Home</a>
      <a href="/about" style={{ textDecoration: 'none', color: 'white' }}>About</a>
      <a href="/labs" style={{ textDecoration: 'none', color: 'white' }}>Our Labs</a>
      <a href="/publications" style={{ textDecoration: 'none', color: 'white' }}>Publications</a>
      <a href="/grant" style={{ textDecoration: 'none', color: 'white' }}>Grants</a>
      <a href="/announcements" style={{ textDecoration: 'none', color: 'white' }}>Announcements</a>
    </nav>
  );
};
*/

const NavigationFlexbox = () => {
  return (
    <header className="bg-blue-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
       
          <nav className="flex space-x-6">
            <a href="/" className="hover:underline">Home</a>
            <a href="/about" className="hover:underline">About</a>
            <a href="/labs" className="hover:underline">Our Labs</a>
            <a href="/publications" className="hover:underline">Publications</a>
            <a href="/grant" className="hover:underline">Grants</a>
            <a href="/announcements" className="hover:underline">Announcements</a>
            <a href="/grant-db" className="hover:underline">Grant Add</a>
          </nav>
        </div>
        
      </div>
    </header>
  );
};



export default HomePage;
export { Dashboard, NavigationFlexbox };