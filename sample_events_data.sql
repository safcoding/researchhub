-- Sample Events Data for Research Hub
-- Run this SQL in your Supabase SQL Editor after creating the events table

INSERT INTO events (
    title, 
    description, 
    date, 
    time, 
    location, 
    category, 
    organizer, 
    registration_required, 
    registration_deadline, 
    contact_email, 
    image, 
    priority, 
    status
) VALUES 

-- Conference Events
(
    'International Research Conference 2025',
    'Join leading researchers from around the world to discuss cutting-edge innovations in technology, engineering, and sustainable development. This premier conference will feature keynote speakers, research presentations, and networking opportunities.',
    '2025-07-15',
    '9:00 AM - 6:00 PM',
    'Razak Tower, UTM Kuala Lumpur',
    'Conference',
    'MJIIT Research Office',
    true,
    '2025-06-15',
    'conference@utm.my',
    '/api/placeholder/400/250',
    'High',
    'Registration Open'
),

(
    'Sustainable Technology Research Symposium',
    'Showcasing research in renewable energy, environmental technology, and sustainable development. Featuring poster presentations and panel discussions with industry experts.',
    '2025-07-30',
    '9:30 AM - 5:30 PM',
    'UTM Innovation Center',
    'Conference',
    'Environmental Engineering Department',
    true,
    '2025-07-15',
    'sustainability@utm.my',
    '/api/placeholder/400/250',
    'Medium',
    'Registration Open'
),

(
    'Asia-Pacific Engineering Research Summit',
    'Annual summit bringing together engineering researchers from across the Asia-Pacific region to share breakthrough discoveries and establish collaborative partnerships.',
    '2025-09-20',
    '8:00 AM - 7:00 PM',
    'KLCC Convention Centre',
    'Conference',
    'UTM International Relations',
    true,
    '2025-08-20',
    'summit@utm.my',
    '/api/placeholder/400/250',
    'High',
    'Upcoming'
),

-- Workshop Events
(
    'AI and Machine Learning Workshop',
    'A hands-on workshop covering the latest developments in artificial intelligence and machine learning applications in research. Participants will gain practical experience with industry-standard tools and techniques.',
    '2025-06-20',
    '10:00 AM - 4:00 PM',
    'BK-12, MJIIT Building',
    'Workshop',
    'Computer Science Department',
    true,
    '2025-06-10',
    'ai-workshop@utm.my',
    '/api/placeholder/400/250',
    'High',
    'Registration Open'
),

(
    'Research Ethics and Integrity Workshop',
    'Essential training on research ethics, data management, and academic integrity. Mandatory for all new research students and recommended for faculty members.',
    '2025-06-12',
    '1:00 PM - 4:00 PM',
    'BK-8, Lecture Hall',
    'Workshop',
    'Research Ethics Committee',
    true,
    '2025-06-05',
    'ethics@utm.my',
    '/api/placeholder/400/250',
    'High',
    'Registration Open'
),

(
    'Advanced Data Analytics Workshop',
    'Learn cutting-edge data analytics techniques including big data processing, statistical modeling, and visualization tools for research applications.',
    '2025-08-15',
    '9:00 AM - 5:00 PM',
    'Computer Lab 3, MJIIT',
    'Workshop',
    'Data Science Research Group',
    true,
    '2025-08-01',
    'dataanalytics@utm.my',
    '/api/placeholder/400/250',
    'Medium',
    'Upcoming'
),

-- Seminar Events
(
    'Research Grant Application Seminar',
    'Learn about the latest research funding opportunities, application processes, and tips for successful grant proposals. Featuring guest speakers from major funding agencies.',
    '2025-06-05',
    '2:00 PM - 5:00 PM',
    'Sakura Hall',
    'Seminar',
    'Research Development Office',
    true,
    '2025-05-30',
    'grants@utm.my',
    '/api/placeholder/400/250',
    'High',
    'Registration Open'
),

(
    'Innovation and Technology Transfer Seminar',
    'Discover how to transform research outcomes into commercial applications. Learn about intellectual property, patent filing, and startup opportunities.',
    '2025-07-10',
    '3:00 PM - 6:00 PM',
    'Innovation Hub, UTM',
    'Seminar',
    'Technology Transfer Office',
    true,
    '2025-07-03',
    'innovation@utm.my',
    '/api/placeholder/400/250',
    'Medium',
    'Registration Open'
),

(
    'Research Publication Strategy Seminar',
    'Master the art of academic publishing with insights on journal selection, peer review process, and strategies for increasing research impact.',
    '2025-08-05',
    '2:00 PM - 5:00 PM',
    'Library Auditorium',
    'Seminar',
    'Academic Writing Center',
    true,
    '2025-07-28',
    'publications@utm.my',
    '/api/placeholder/400/250',
    'Medium',
    'Upcoming'
),

-- Grant and Competition Events
(
    'Young Researcher Excellence Award 2025',
    'Competition for outstanding research contributions by young researchers. Winners will receive recognition, funding, and opportunities for international collaboration.',
    '2025-08-10',
    'Submission Deadline: 11:59 PM',
    'Online Submission',
    'Competition',
    'MJIIT Research Committee',
    true,
    '2025-07-31',
    'awards@utm.my',
    '/api/placeholder/400/250',
    'Medium',
    'Registration Open'
),

(
    'Research Innovation Challenge',
    'Open competition for innovative research ideas with potential for commercialization. Winners receive seed funding and mentorship support.',
    '2025-09-30',
    'Proposal Deadline: 5:00 PM',
    'Online Platform',
    'Competition',
    'Innovation and Enterprise Office',
    true,
    '2025-09-15',
    'challenge@utm.my',
    '/api/placeholder/400/250',
    'High',
    'Upcoming'
),

(
    'National Science Foundation Grant Information Session',
    'Comprehensive briefing on NSF funding opportunities, application requirements, and success strategies for research grants.',
    '2025-06-25',
    '10:00 AM - 12:00 PM',
    'Conference Room A, Razak Tower',
    'Grant',
    'External Funding Office',
    true,
    '2025-06-20',
    'nsf-info@utm.my',
    '/api/placeholder/400/250',
    'High',
    'Registration Open'
),

-- Networking Events
(
    'Industry-Academia Networking Session',
    'Connect with industry leaders, explore collaboration opportunities, and learn about real-world applications of academic research. Light refreshments will be provided.',
    '2025-06-25',
    '6:00 PM - 8:00 PM',
    'MJIIT Conference Room',
    'Networking',
    'Industry Relations Office',
    true,
    '2025-06-20',
    'industry@utm.my',
    '/api/placeholder/400/250',
    'Medium',
    'Registration Open'
),

(
    'International Collaboration Opportunities Fair',
    'Explore partnerships with universities worldwide, learn about exchange programs, and discover joint research opportunities with international institutions.',
    '2025-09-15',
    '10:00 AM - 3:00 PM',
    'Main Lobby, MJIIT Building',
    'Networking',
    'International Affairs Office',
    false,
    null,
    'international@utm.my',
    '/api/placeholder/400/250',
    'Medium',
    'Upcoming'
),

(
    'Alumni Research Network Gathering',
    'Annual gathering of UTM research alumni to share experiences, discuss current projects, and explore collaboration opportunities.',
    '2025-10-12',
    '5:00 PM - 8:00 PM',
    'UTM Alumni Center',
    'Networking',
    'Alumni Affairs Office',
    true,
    '2025-10-05',
    'alumni@utm.my',
    '/api/placeholder/400/250',
    'Low',
    'Upcoming'
),

-- Additional Mixed Events
(
    'Digital Transformation in Research',
    'Explore how digital technologies are revolutionizing research methodologies, data collection, and analysis across various disciplines.',
    '2025-07-05',
    '9:00 AM - 12:00 PM',
    'Digital Innovation Lab',
    'Seminar',
    'Digital Technology Center',
    true,
    '2025-06-28',
    'digital@utm.my',
    '/api/placeholder/400/250',
    'Medium',
    'Registration Open'
),

(
    'Cybersecurity Research Workshop',
    'Intensive workshop on cybersecurity research covering threat analysis, security protocols, and emerging challenges in digital security.',
    '2025-08-22',
    '1:00 PM - 6:00 PM',
    'Cybersecurity Lab, MJIIT',
    'Workshop',
    'Cybersecurity Research Center',
    true,
    '2025-08-15',
    'cybersec@utm.my',
    '/api/placeholder/400/250',
    'High',
    'Upcoming'
),

(
    'Interdisciplinary Research Collaboration Forum',
    'Platform for researchers from different disciplines to present their work and explore potential cross-disciplinary collaborations.',
    '2025-11-08',
    '2:00 PM - 6:00 PM',
    'Multi-Purpose Hall',
    'Conference',
    'Interdisciplinary Research Office',
    true,
    '2025-10-25',
    'interdisciplinary@utm.my',
    '/api/placeholder/400/250',
    'Medium',
    'Upcoming'
),

(
    'Research Commercialization Bootcamp',
    'Intensive 3-day program covering business model development, market analysis, and funding strategies for research-based startups.',
    '2025-09-10',
    '9:00 AM - 5:00 PM (3 days)',
    'Entrepreneurship Center',
    'Workshop',
    'Business Development Office',
    true,
    '2025-08-27',
    'bootcamp@utm.my',
    '/api/placeholder/400/250',
    'High',
    'Upcoming'
);

-- Verify the data was inserted
SELECT COUNT(*) as total_events FROM events;
SELECT category, COUNT(*) as count FROM events GROUP BY category ORDER BY count DESC;
