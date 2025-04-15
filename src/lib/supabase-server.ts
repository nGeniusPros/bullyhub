import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

// Re-export createClient for compatibility with existing code
export const createClient = supabaseCreateClient;

export const createServerSupabaseClient = async () => {
  try {
    // Check if environment variables are defined
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Missing Supabase environment variables');
    }

    return supabaseCreateClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Error creating server Supabase client:', error);
    throw new Error('Failed to connect to the database. Please try again later.');
  }
};

// Safe utility function to get a server Supabase client with error handling
export const getSafeServerSupabaseClient = async () => {
  try {
    return await createServerSupabaseClient();
  } catch (error) {
    console.error('Error getting server Supabase client:', error);
    throw new Error('Failed to connect to the database. Please try again later.');
  }
};
