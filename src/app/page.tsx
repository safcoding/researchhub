'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import ConditionalNavbar from '@/components/admin-sidebar/conditional-navbar';
import Navbar from '@/components/navbar';
// Fixed import path to match the actual file name (Footer.tsx with capital F)
import Footer from '@/components/Footer';
// Import EventLogic hook to get real announcements data
import { EventLogic, type Event } from '@/hooks/logic/event-logic';

const SUPABASE_EVENT_PICS_URL = "https://fqtizehthryjvqxqvpkl.supabase.co/storage/v1/object/public/event-pics/";

const HomePage = () => { 
  // Get events data from the EventLogic hook
  const { events, loading } = EventLogic();
  
  // Function to get the top 3 events closest to their deadline
  const getUpcomingEvents = (): Event[] => {
    const currentDate = new Date();
    
    // Filter events that have registration deadlines or event dates in the future
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      const registrationDeadline = event.registration_deadline ? new Date(event.registration_deadline) : null;
      
      // Check if event date or registration deadline is in the future
      return eventDate > currentDate || (registrationDeadline && registrationDeadline > currentDate);
    });
    
    // Sort by closest deadline (either registration deadline or event date)
    const sortedEvents = upcomingEvents.sort((a, b) => {
      const getClosestDate = (event: Event) => {
        const eventDate = new Date(event.date);
        const regDeadline = event.registration_deadline ? new Date(event.registration_deadline) : null;
        
        if (regDeadline && regDeadline > currentDate) {
          return regDeadline; // Registration is still open
        }
        return eventDate; // Use event date
      };
      
      return getClosestDate(a).getTime() - getClosestDate(b).getTime();
    });
    
    // Return top 3
    return sortedEvents.slice(0, 3);  };
  
  // Function to get the top 4 upcoming conferences
  const getUpcomingConferences = (): Event[] => {
    const currentDate = new Date();
    
    // Filter events that are conferences and in the future
    const upcomingConferences = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > currentDate && event.category === 'Conference';
    });
    
    // Sort by event date (closest first)
    const sortedConferences = upcomingConferences.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    // Return top 4
    return sortedConferences.slice(0, 4);
  };
  
  const upcomingEvents = getUpcomingEvents();
  const upcomingConferences = getUpcomingConferences();
  return (
      <ConditionalNavbar> 
      <Navbar />

           {/* Latest Announcements - Dynamic from Events */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Latest Announcements</h2>
          
          {loading ? (
            <div className="text-center">
              <p className="text-gray-600">Loading announcements...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => {
                const currentDate = new Date();
                const registrationDeadline = event.registration_deadline ? new Date(event.registration_deadline) : null;
                const isRegistrationOpen = registrationDeadline && registrationDeadline > currentDate;
                
                return (
                  <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 relative bg-gray-200">

                      {/* Event Image */}
                      <Image
                        src={
                          event.image
                            ? `${SUPABASE_EVENT_PICS_URL}${event.image}`
                            : "/placeholder.jpg"
                        }
                        alt={event.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />

                      {/* Priority badge */}
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
                        event.priority === 'High' ? 'bg-red-500 text-white' :
                        event.priority === 'Medium' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {event.priority}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-2 space-y-1">
                        <p className="text-sm text-gray-500">
                          Event Date: {new Date(event.date).toLocaleDateString()}
                        </p>
                        {event.registration_deadline && (
                          <p className={`text-sm font-medium ${
                            isRegistrationOpen ? 'text-green-600' : 'text-red-600'
                          }`}>
                            Registration {isRegistrationOpen ? 'Closes' : 'Closed'}: {new Date(event.registration_deadline).toLocaleDateString()}
                          </p>
                        )}
                        <p className="text-sm" style={{ color: '#0A867D' }}>
                            {event.category}
                          </p>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          event.status === 'Registration Open' ? 'bg-green-100 text-green-800' :
                          event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'Registration Closed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>

                        {/* Link to event details */}
                        <Link
                            href="/announcements"
                            className="font-medium"
                            style={{ color: '#0A867D' }}
                            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#066458')}
                            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#0A867D')}
                          >
                            View Details →
                          </Link>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">No upcoming announcements at the moment.</p>

              {/* Link to view all announcements */}
              <Link href="/announcements" className="text-blue-600 hover:text-blue-800 font-medium">
                View all announcements →
              </Link>
            </div>
          )}
          
          <div className="text-center mt-8">

            {/* Button to view all announcements */}
              <Link 
              href="/announcements" 
              className="inline-block px-6 py-3 rounded-lg text-white transition-colors"
              style={{ backgroundColor: '#2B9167' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = '#066458')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = '#2B9167')}
            >
              View All Announcements
            </Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Programs</h2>          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Publication Details', icon: '🎓', route: '/publications' },
              { title: 'Research Opportunities', icon: '🔬', route: '/labs' },
              { title: 'International Collaboration', icon: '🌏', route: '/about' },
              { title: 'Industry Partnership', icon: '🏭', route: '/about' },
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


                {/* Link to program details */}
                <Link
                    href={program.route}
                    className="font-medium"
                    style={{ color: '#0A867D' }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#066458')}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#0A867D')}
                  >
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>     

       {/* Upcoming Conferences - Dynamic from Events */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Conferences</h2>
          
          {loading ? (
            <div className="text-center">
              <p className="text-gray-600">Loading conferences...</p>
            </div>
          ) : upcomingConferences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingConferences.map((conference) => {
                const eventDate = new Date(conference.date);
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const month = monthNames[eventDate.getMonth()];
                const day = eventDate.getDate();
                
                return (
                  <div key={conference.id} className="flex bg-white rounded-lg shadow-md overflow-hidden">
                    <div
                            className="text-white py-4 px-6 flex flex-col items-center justify-center"
                            style={{ backgroundColor: '#0A867D' }}
                          >
                      <span className="text-2xl font-bold">{month}</span>
                      <span>{day}</span>
                    </div>
                    <div className="p-6 flex-1">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">{conference.title}</h3>
                      <p className="text-gray-600 mb-2">
                        <span className="inline-block mr-2">📍</span>
                        {conference.location || 'Location TBA'}
                      </p>
                      <p className="text-gray-600 mb-2">
                        <span className="inline-block mr-2">🕒</span>
                        {conference.time || 'Time TBA'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          conference.status === 'Registration Open' ? 'bg-green-100 text-green-800' :
                          conference.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {conference.status}
                        </span>


                        {/* Link to conference details */}
                        <Link
                            href="/announcements"
                            className="font-medium"
                            style={{ color: '#0A867D' }}
                            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#066458')}
                            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#0A867D')}
                          >
                            Details →
                          </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">No upcoming conferences at the moment.</p>
              <Link href="/announcements" className="text-blue-600 hover:text-blue-800 font-medium">
                View all events →
              </Link>
            </div>
          )}
          

          {/* Button to view all events */}
          <div className="text-center mt-8">
            <Link 
              href="/announcements" 
              className="inline-block px-6 py-3 rounded-lg text-white transition-colors"
              style={{ backgroundColor: '#2B9167' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = '#066458')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = '#2B9167')}
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </ConditionalNavbar>
  );
};

export default HomePage;