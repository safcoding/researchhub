import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL='https://fqtizehthryjvqxqvpkl.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdGl6ZWh0aHJ5anZxeHF2cGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NDQ5NzAsImV4cCI6MjA2MDUyMDk3MH0.ydPnhIFnCiUUaCIrSHyFNp49Fewd-QpZangTPleKc_o'
);