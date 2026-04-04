import { createClient } from '@supabase/supabase-js';

// Add fallbacks to prevent crashes when developing locally without `.env.local`
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

// Server-side client with service role (for API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Public client (for client-side if needed)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
