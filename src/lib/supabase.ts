import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zkkcghydjylbnzmraxqr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpra2NnaHlkanlsYm56bXJheHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTUzODYsImV4cCI6MjA4NzI3MTM4Nn0.UkEjf79qep1CEJzgaBVnNVNPQdNqlo1FIbjf_h7XFqQ';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);