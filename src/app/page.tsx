import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ConditionalNavbar from '@/components/admin-sidebar/conditional-navbar';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';

const HomePage = () => { 
  return (
      <ConditionalNavbar> 
      <Navbar />
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
                  <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} />
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
                  <p className="text-gray-600 mb-4">New research grants available for researchers...</p>
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
              { title: 'Publication Details', icon: '🎓' },
              { title: 'Research Opportunities', icon: '🔬' },
              { title: 'International Collaboration', icon: '🌏' },
              { title: 'Industry Partnership', icon: '🏭' },
            ].map((program, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-gray-600 mb-4">
                  Discover our range of programs designed to empower the next generation.
                </p>
                <Link
                  href={`/programs/${index}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
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
              { date: 'Nov 12', title: 'International Research Conference', location: 'Razak Tower' },
              { date: 'Nov 15', title: 'Nvidia workshop', location: 'BK-12' },
              { date: 'Nov 20', title: 'Industry-Academia Networking Session', location: 'Sakura Hall' },
              { date: 'Dec 05', title: 'End of Year Research Showcase', location: 'BK-1' },
            ].map((event, index) => (
              <div key={index} className="flex bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-700 text-white py-4 px-6 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{event.date.split(' ')[0]}</span>
                  <span>{event.date.split(' ')[1]}</span>
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

      <Footer />
    </ConditionalNavbar>
  );
};

export default HomePage;