// Temporary database fix utility
// This file can be used to fix the database constraint

import { supabase } from './db-connect';

export async function fixCategoryConstraint() {
  try {
    console.log('Attempting to fix category constraint...');
    
    // Drop the existing constraint
    const dropResult = await supabase.rpc('sql', {
      query: 'ALTER TABLE events DROP CONSTRAINT IF EXISTS events_category_check;'
    });
    
    console.log('Drop constraint result:', dropResult);
    
    // Add new constraint with Others
    const addResult = await supabase.rpc('sql', {
      query: `ALTER TABLE events ADD CONSTRAINT events_category_check 
              CHECK (category IN ('Conference', 'Workshop', 'Seminar', 'Grant', 'Competition', 'Networking', 'Others'));`
    });
    
    console.log('Add constraint result:', addResult);
    
    return { success: true, dropResult, addResult };
  } catch (error) {
    console.error('Error fixing constraint:', error);
    return { success: false, error };
  }
}
