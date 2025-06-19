-- Quick fix for the database constraint
-- Run this SQL directly in your Supabase dashboard SQL editor

-- First, let's see the current constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'events'::regclass 
AND contype = 'c';

-- Drop the existing check constraint for category
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_category_check;

-- Add the new constraint that includes 'Others'
ALTER TABLE events ADD CONSTRAINT events_category_check 
    CHECK (category IN ('Conference', 'Workshop', 'Seminar', 'Grant', 'Competition', 'Networking', 'Others'));

-- Verify the new constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'events'::regclass 
AND conname = 'events_category_check';
