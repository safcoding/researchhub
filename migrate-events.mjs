import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fqtizehthryjvqxqvpkl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdGl6ZWh0aHJ5anZxeHF2cGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NDQ5NzAsImV4cCI6MjA2MDUyMDk3MH0.ydPnhIFnCiUUaCIrSHyFNp49Fewd-QpZangTPleKc_o';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey
    }
  }
});

async function createEventsTable() {
  console.log('Creating events table...');

  try {
    // First, let's test the connection by trying to insert sample data
    // This will work if the table already exists, or fail gracefully if it doesn't
    console.log('Testing connection and trying to insert sample data...');

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
      },
      {
        title: 'Research Grant Application Seminar',
        description: 'Learn about the latest research funding opportunities, application processes, and tips for successful grant proposals. Featuring guest speakers from major funding agencies.',
        date: '2025-06-05',
        time: '2:00 PM - 5:00 PM',
        location: 'Sakura Hall',
        category: 'Seminar',
        organizer: 'Research Development Office',
        registration_required: true,
        registration_deadline: '2025-05-30',
        contact_email: 'grants@utm.my',
        image: '/api/placeholder/400/250',
        priority: 'High',
        status: 'Registration Open'
      },
      {
        title: 'Young Researcher Excellence Award 2025',
        description: 'Competition for outstanding research contributions by young researchers. Winners will receive recognition, funding, and opportunities for international collaboration.',
        date: '2025-08-10',
        time: 'Submission Deadline',
        location: 'Online Submission',
        category: 'Competition',
        organizer: 'MJIIT Research Committee',
        registration_required: true,
        registration_deadline: '2025-07-31',
        contact_email: 'awards@utm.my',
        image: '/api/placeholder/400/250',
        priority: 'Medium',
        status: 'Registration Open'
      },
      {
        title: 'Industry-Academia Networking Session',
        description: 'Connect with industry leaders, explore collaboration opportunities, and learn about real-world applications of academic research. Light refreshments will be provided.',
        date: '2025-06-25',
        time: '6:00 PM - 8:00 PM',
        location: 'MJIIT Conference Room',
        category: 'Networking',
        organizer: 'Industry Relations Office',
        registration_required: true,
        registration_deadline: '2025-06-20',
        contact_email: 'industry@utm.my',
        image: '/api/placeholder/400/250',
        priority: 'Medium',
        status: 'Registration Open'
      }
    ];

    const { error: insertError } = await supabase
      .from('events')
      .insert(sampleEvents);

    if (insertError) {
      console.log('Table might not exist yet. Error:', insertError.message);
      console.log('Please create the events table manually in Supabase dashboard using the SQL from create_events_table.sql');
      console.log('Or run the SQL commands directly in the Supabase SQL editor.');
    } else {
      console.log('Sample events inserted successfully!');
      console.log('Events table is ready and populated with sample data.');
    }

    console.log('Migration process completed!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

createEventsTable();
