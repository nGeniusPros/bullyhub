// This script creates a test user with a confirmed email in Supabase
// Run with: node scripts/create-test-user.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or service role key');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test user credentials
const email = 'test@example.com';
const password = 'password123';

async function createTestUser() {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log(`User ${email} already exists. Updating...`);
      
      // Update user to confirm email
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { email_confirm: true }
      );
      
      if (updateError) {
        throw updateError;
      }
      
      console.log(`User ${email} has been updated and email confirmed.`);
    } else {
      // Create a new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      
      if (createError) {
        throw createError;
      }
      
      console.log(`User ${email} has been created with confirmed email.`);
    }

    console.log('\nTest User Credentials:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('\nYou can now log in at http://localhost:3000/login with these credentials.');
    
  } catch (error) {
    console.error('Error creating test user:', error.message);
  }
}

createTestUser();
