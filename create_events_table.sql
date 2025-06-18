-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Conference', 'Workshop', 'Seminar', 'Grant', 'Competition', 'Networking', 'Others')),
    organizer TEXT NOT NULL,
    registration_required BOOLEAN NOT NULL DEFAULT false,
    registration_deadline DATE,
    contact_email TEXT NOT NULL,
    image TEXT DEFAULT '/api/placeholder/400/250',
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
    status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Registration Open', 'Registration Closed', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_priority ON events(priority);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO events (
    title, description, date, time, location, category, organizer, 
    registration_required, registration_deadline, contact_email, image, priority, status
) VALUES 
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
    'Young Researcher Excellence Award 2025',
    'Competition for outstanding research contributions by young researchers. Winners will receive recognition, funding, and opportunities for international collaboration.',
    '2025-08-10',
    'Submission Deadline',
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
)
ON CONFLICT DO NOTHING;
