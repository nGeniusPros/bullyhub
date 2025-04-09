import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import dns from 'dns';
import { promisify } from 'util';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== Bully Hub Connection Diagnostics ===');
console.log('');

// Check if environment variables are set
console.log('1. Checking environment variables...');
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set:', supabaseUrl);
}

if (!supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set');
}

if (!supabaseUrl || !supabaseKey) {
  console.error('\nPlease set the missing environment variables in .env.local');
  process.exit(1);
}

// Check DNS resolution
console.log('\n2. Checking DNS resolution...');
const lookup = promisify(dns.lookup);
try {
  const hostname = new URL(supabaseUrl).hostname;
  const { address } = await lookup(hostname);
  console.log(`✅ DNS resolution successful for ${hostname}: ${address}`);
} catch (error) {
  console.error(`❌ DNS resolution failed: ${error.message}`);
}

// Check network connectivity
console.log('\n3. Checking network connectivity...');
try {
  const response = await fetch(supabaseUrl);
  console.log(`✅ Network connectivity successful: ${response.status} ${response.statusText}`);
} catch (error) {
  console.error(`❌ Network connectivity failed: ${error.message}`);
}

// Create Supabase client
console.log('\n4. Testing Supabase connection...');
const supabase = createClient(supabaseUrl, supabaseKey);

// Test authentication
console.log('\n5. Testing authentication...');
try {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error(`❌ Authentication test failed: ${error.message}`);
  } else {
    console.log('✅ Authentication test successful');
    console.log(`   Session: ${data.session ? 'Active' : 'None'}`);
  }
} catch (error) {
  console.error(`❌ Authentication test failed: ${error.message}`);
}

// Test database query
console.log('\n6. Testing database query...');
try {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);
  
  if (error) {
    console.error(`❌ Database query failed: ${error.message}`);
    
    // Check if it's a permissions issue
    if (error.code === 'PGRST301') {
      console.log('   This appears to be a permissions issue. Check your Supabase RLS policies.');
    }
    // Check if it's a schema issue
    else if (error.code === '42P01') {
      console.log('   This appears to be a schema issue. The "profiles" table may not exist.');
    }
  } else {
    console.log(`✅ Database query successful: ${data.length} records returned`);
  }
} catch (error) {
  console.error(`❌ Database query failed: ${error.message}`);
}

console.log('\n=== Diagnostics Complete ===');
