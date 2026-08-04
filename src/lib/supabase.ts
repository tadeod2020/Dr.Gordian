import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://zedkozfapgkloxofercm.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZGtvemZhcGdrbG94b2ZlcmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDU3MzUsImV4cCI6MjEwMDkyMTczNX0.b_bz8t99nUUaM7x4hDkg3Z7W1QroYG0KU3tzKqI1SEo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getSupabaseClient = (url?: string, key?: string) => {
  const targetUrl = url || SUPABASE_URL;
  const targetKey = key || SUPABASE_ANON_KEY;
  if (!targetUrl || !targetKey) return null;
  return createClient(targetUrl, targetKey);
};
