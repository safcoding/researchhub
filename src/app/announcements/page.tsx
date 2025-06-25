'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EventLogic, type Event } from '@/hooks/event-logic';
import ConditionalNavbar from '@/components/admin-sidebar/conditional-navbar';
import Footer from '@/components/Footer';
import Navbar from '@/components/navbar';

export default function AnnouncementsPage() {
  // ===== STATE MANAGEMENT =====
  const { events, loading, error} = EventLogic();

  //const { events, loading, error, addEvent, updateEvent, deleteEvent } = EventLogic();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  //const [showEventModal, setShowEventModal] = useState(false); redundant, put it below for better finding
  const [currentPage, setCurrentPage] = useState(1);

  // State for the event info modal
  const [showInfoModal, setShowInfoModal] = useState(false);
  //for the above ^ determines if the modal/[pop] is visible or not
  const [infoModalEvent, setInfoModalEvent] = useState<Event | null>(null);
  //for the above ^ data to be shown
  

  // ===== CONSTANTS =====
  const eventsPerPage = 5;  
  const categories = ['All', 'Conference', 'Workshop', 'Seminar', 'Grant', 'Competition', 'Networking', 'Others'];
  const SUPABASE_EVENT_PICS_URL = "https://fqtizehthryjvqxqvpkl.supabase.co/storage/v1/object/public/event-pics/";

  // ===== EVENT FILTERING =====
  const filteredEvents = events.filter(event => {
    // Handle case sensitivity and potential data inconsistencies
    const eventCategory = event.category?.toString().trim();
    const selectedCategoryNormalized = selectedCategory.trim();
    
    // better category matching
    let matchesCategory = false;
    if (selectedCategoryNormalized === 'All') {
      matchesCategory = true;
    } else {
      // Try exact match first
      matchesCategory = eventCategory === selectedCategoryNormalized;
      
      // If no exact match, try case-insensitive match
      if (!matchesCategory && eventCategory) {
        matchesCategory = eventCategory.toLowerCase() === selectedCategoryNormalized.toLowerCase();
      }
    }
    
    // Check if the event matches the search query
    const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       event.organizer?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // ===== PAGINATION LOGIC =====
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // UTILITY FUNCTIONS 
  
  // Determine color for priority badges
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Determine color for status badges
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Registration Open': return 'bg-blue-100 text-blue-800';
      case 'Registration Closed': return 'bg-red-100 text-red-800';
      case 'Upcoming': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date strings for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  //Handler function, set info to the event that was clicked
  // Handle showing event info modal
  const handleShowInfo = (event: Event) => {
    setInfoModalEvent(event);
    setShowInfoModal(true);
  };

  // ===== CONDITIONAL RENDERING =====
  
  // Show loading state
  if (loading) {
    return (
      <div>
        <ConditionalNavbar />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </main>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div>
        <ConditionalNavbar />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Events</h2>
              <p className="text-red-600">{error}</p>
              <p className="text-sm text-gray-600 mt-2">
                Please make sure the events table exists in your Supabase database.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main component render
  return (
    <ConditionalNavbar>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* ===== PAGE HEADER ===== */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-center">Announcements & Events</h1>
            </div>
          </div>
          
          <div className="mb-12 text-center">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest research events, conferences, workshops, and opportunities at MJIIT. 
              Join us in advancing knowledge and fostering innovation through collaborative learning and networking.
            </p>
          </div>

          {/* ===== SEARCH AND FILTER SECTION ===== */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search input */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search events by title, description, or organizer..."
                    className="w-full p-3 pl-10 border rounded-lg focus:outline-none"
                    style={{
                      boxShadow: '0 0 0 2px #2B9167'
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Category filter buttons */}
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={selectedCategory === category ? { backgroundColor: '#2B9167' } : {}}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ===== EVENTS GRID ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Event image with badges */}
                <div className="h-48 relative">
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
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadgeColor(event.priority)}`}>
                      {event.priority} Priority
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                
                {/* Event details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#2B9167]">{event.category}</span>
                    <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">{event.description}</p>
                  
                  {/* Event metadata */}
                  <div className="space-y-2 mb-4">
                    {/* Time */}
                    <div className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {event.time}
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                    
                    {/* Organizer */}
                    <div className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {event.organizer}
                    </div>

                    {/* Registration deadline (if applicable) */}
                    {event.registration_required && event.registration_deadline && (
                      <div className="flex items-center text-sm text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Registration Deadline: {formatDate(event.registration_deadline)}
                      </div>
                    )}
                  </div>
                  
                  {/* More Info Button */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleShowInfo(event)}
                      className="w-full text-white text-center py-2 px-4 rounded transition-colors text-sm"
                      style={{ backgroundColor: '#2B9167' }}
                    >
                      More Info
                    </button>
                  </div>                
                </div>
              </div>
            ))}
          </div>

          {/* ===== PAGINATION CONTROLS ===== */}
          {filteredEvents.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              {/* Previous page button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`px-3 py-2 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page number buttons */}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 rounded-md ${
                      isCurrentPage
                        ? 'text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    style={isCurrentPage ? { backgroundColor: '#000000' } : {}}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next page button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className={`px-3 py-2 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* ===== RESULTS SUMMARY ===== */}
          {filteredEvents.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} events
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </div>
          )}

          {/* ===== NO RESULTS MESSAGE ===== */}
          {currentEvents.length === 0 && filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or category filter.</p>
            </div>
          )}

          {/* ===== CALL TO ACTION SECTION ===== */}
          <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Don&apos;t miss out on important announcements and events. Subscribe to our newsletter or contact our research office for more information about upcoming opportunities.
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="mailto:research.mjiit@utm.my"
                className="text-white px-6 py-3 rounded-lg transition-colors"
                style={{ backgroundColor: '#2B9167' }}
              >
                Contact Research Office
              </a>
              <Link 
                href="/about"
                className="px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
                style={{ border: '1px solid #2B9167', color: '#2B9167' }}
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* event model to be rendered in a bit*/}
      
      {showInfoModal && infoModalEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal header with image */}
            <div className="relative">
              <div className="h-64 relative">
                <Image
                  src={
                    infoModalEvent.image
                      ? `${SUPABASE_EVENT_PICS_URL}${infoModalEvent.image}`
                      : "/placeholder.jpg"
                  }
                  alt={infoModalEvent.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                {/* Close button */}
                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal content first div */}
              <div className="p-6">
                {/* Event category and status badges */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#2B9167] px-3 py-1 bg-green-50 rounded-full">
                    {infoModalEvent.category}
                  </span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadgeColor(infoModalEvent.priority)}`}>
                      {infoModalEvent.priority} Priority
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(infoModalEvent.status)}`}>
                      {infoModalEvent.status}
                    </span>
                  </div>
                </div>
                
                {/* Event title */}
                <h2 className="text-2xl font-bold mb-4">{infoModalEvent.title}</h2>
                
                {/* Event details*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Event Details</h3>
                    <div className="space-y-3">
                      {/* Date */}
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span><strong>Date:</strong> {formatDate(infoModalEvent.date)}</span>
                      </div>
                      
                      {/* Time */}
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Time:</strong> {infoModalEvent.time}</span>
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span><strong>Location:</strong> {infoModalEvent.location}</span>
                      </div>
                      
                      {/* Organizer */}
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span><strong>Organizer:</strong> {infoModalEvent.organizer}</span>
                      </div>
                      
                      {/* Organizer email */}
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                         
                        </svg>
                        <span><strong>Email:</strong> {infoModalEvent.contact_email}</span>
                      </div>

                    </div>
                  </div>
                  
                  {/* Registration info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Registration Info</h3>
                    <div className="space-y-3">
                      {/* Registration required */}
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Registration Required:</strong> {infoModalEvent.registration_required ? 'Yes' : 'No'}</span>
                      </div>
                      
                      {/* Registration deadline if applicable */}
                      {infoModalEvent.registration_required && infoModalEvent.registration_deadline && (
                        <div className="flex items-center text-orange-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span><strong>Registration Deadline:</strong> {formatDate(infoModalEvent.registration_deadline)}</span>
                        </div>
                      )}
                      
                      {/* Registration link not in the db*/}


          
                     
                    </div>
                  </div>
                </div>
                
                {/* Event description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{infoModalEvent.description}</p>
                  </div>
                </div>
                
              
                
                {/* Modal footer with close button */}
                <div className="flex justify-end pt-4 border-t">
                  <button 
                    onClick={() => setShowInfoModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
                
                 {/* Event website button }
                <div className="flex justify-end pt-4 border-t">
                  <button 
                    onClick={() => window.open(infoModalEvent.website, '_blank')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    More Info
                  </button>
                </div>
                */}


              </div>
            </div>
          </div>
        </div>
      )}
    </ConditionalNavbar>
  );
}