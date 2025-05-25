import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fqtizehthryjvqxqvpkl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdGl6ZWh0aHJ5anZxeHF2cGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NDQ5NzAsImV4cCI6MjA2MDUyMDk3MH0.ydPnhIFnCiUUaCIrSHyFNp49Fewd-QpZangTPleKc_o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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