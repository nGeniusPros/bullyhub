// Simple script to test Supabase connection
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key available:', !!supabaseKey);
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection by querying the dogs table
    console.log('Querying dogs table...');
    const { data, error } = await supabase.from('dogs').select('*').limit(5);
    
    if (error) {
      console.error('Error querying dogs table:', error);
      return;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log(`Found ${data.length} dogs in the database.`);
    
    if (data.length > 0) {
      console.log('First dog:', data[0]);
    }
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
  }
}

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Run the test
testSupabaseConnection();
