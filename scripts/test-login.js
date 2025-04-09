import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or API key');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  try {
    console.log('Testing login with test user...');
    
    // Sign in with test user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123',
    });
    
    if (error) {
      console.error('Login error:', error);
      return;
    }
    
    console.log('Login successful!');
    console.log('User:', data.user?.email);
    console.log('Session:', !!data.session);
    
    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
    } else {
      console.log('Profile data:', profileData);
    }
    
    // Test session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
    } else {
      console.log('Session data:', {
        hasSession: !!sessionData.session,
        user: sessionData.session?.user?.email,
      });
    }
    
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

testLogin();
