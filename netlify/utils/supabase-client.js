import { createClient } from '@supabase/supabase-js';

// Try to use the environment variables with both naming conventions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Check for environment variables
if (!supabaseUrl) {
  console.error('Missing Supabase URL environment variable');
  throw new Error('Missing Supabase URL environment variable');
}

if (!supabaseKey) {
  console.error('Missing Supabase key environment variable');
  throw new Error('Missing Supabase key environment variable');
}

console.log('Initializing Supabase client in serverless function with URL:', supabaseUrl);

// Create the Supabase client with explicit options
let supabase;
try {
  const options = {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  };

  supabase = createClient(supabaseUrl, supabaseKey, options);
  console.log('Supabase client created successfully');
} catch (error) {
  console.error('Error creating Supabase client:', error);
  throw error;
}

export { supabase };
