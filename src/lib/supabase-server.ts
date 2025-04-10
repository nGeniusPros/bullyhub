import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createServerSupabaseClient = async () => {
  try {
    const cookieStore = await cookies();

    // Check if environment variables are defined
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Missing Supabase environment variables');
    }

    return createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          async get(name: string) {
            try {
              return (await cookieStore.get(name))?.value;
            } catch (error) {
              console.error(`Error getting cookie ${name}:`, error);
              return undefined;
            }
          },
          async set(name: string, value: string, options: any) {
            try {
              await cookieStore.set({ name, value, ...options });
            } catch (error) {
              console.error(`Error setting cookie ${name}:`, error);
            }
          },
          async remove(name: string, options: any) {
            try {
              await cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              console.error(`Error removing cookie ${name}:`, error);
            }
          },
        },
      }
    );
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
