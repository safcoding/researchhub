-- Add 'Others' to the category check constraint
-- This migration updates the events table to allow 'Others' as a valid category

-- Drop the existing check constraint
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_category_check;

-- Add the new constraint that includes 'Others'
ALTER TABLE events ADD CONSTRAINT events_category_check 
    CHECK (category IN ('Conference', 'Workshop', 'Seminar', 'Grant', 'Competition', 'Networking', 'Others'));

-- Verify the constraint was added correctly
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'events'::regclass 
AND conname = 'events_category_check';
