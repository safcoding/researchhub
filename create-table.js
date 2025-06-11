const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createEventsTable() {
  console.log('Creating events table...');
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        location TEXT NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('Conference', 'Workshop', 'Seminar', 'Grant', 'Competition', 'Networking')),
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
    
    CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
    CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
    CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
    CREATE INDEX IF NOT EXISTS idx_events_priority ON events(priority);
  `;

  // Try using .from() to create the table
  try {
    // First, just try to query the events table to see if it exists
    const { data, error } = await supabase.from('events').select('*').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('Events table does not exist. Please create it manually in Supabase dashboard.');
      console.log('Use the SQL from create_events_table.sql file');
      return false;
    } else if (error) {
      console.error('Error checking table:', error);
      return false;
    } else {
      console.log('Events table already exists!');
      console.log(`Found ${data.length} events in the table`);
      return true;
    }
  } catch (e) {
    console.error('Error:', e);
    return false;
  }
}

async function insertSampleData() {
  console.log('Inserting sample data...');
  
  const sampleEvents = [
    {
      title: 'International Research Conference 2025',
      description: 'Join leading researchers from around the world to discuss cutting-edge innovations in technology, engineering, and sustainable development. This premier conference will feature keynote speakers, research presentations, and networking opportunities.',
      date: '2025-07-15',
      time: '9:00 AM - 6:00 PM',
      location: 'Razak Tower, UTM Kuala Lumpur',
      category: 'Conference',
      organizer: 'MJIIT Research Office',
      registration_required: true,
      registration_deadline: '2025-06-15',
      contact_email: 'conference@utm.my',
      image: '/api/placeholder/400/250',
      priority: 'High',
      status: 'Registration Open'
    },
    {
      title: 'AI and Machine Learning Workshop',
      description: 'A hands-on workshop covering the latest developments in artificial intelligence and machine learning applications in research. Participants will gain practical experience with industry-standard tools and techniques.',
      date: '2025-06-20',
      time: '10:00 AM - 4:00 PM',
      location: 'BK-12, MJIIT Building',
      category: 'Workshop',
      organizer: 'Computer Science Department',
      registration_required: true,
      registration_deadline: '2025-06-10',
      contact_email: 'ai-workshop@utm.my',
      image: '/api/placeholder/400/250',
      priority: 'High',
      status: 'Registration Open'
    }
  ];

  const { data, error } = await supabase
    .from('events')
    .insert(sampleEvents)
    .select();

  if (error) {
    console.error('Error inserting sample data:', error);
    return false;
  }

  console.log('Sample data inserted successfully:', data);
  return true;
}

async function main() {
  const tableExists = await createEventsTable();
  
  if (tableExists) {
    // Check if table is empty and insert sample data if needed
    const { data: existingEvents, error } = await supabase
      .from('events')
      .select('*')
      .limit(1);
    
    if (!error && existingEvents.length === 0) {
      await insertSampleData();
    }
  }
}

main().catch(console.error);
