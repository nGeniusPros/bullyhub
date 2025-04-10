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

async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Create extensions
    console.log('Creating extensions...');
    const { error: extensionsError } = await supabase.rpc('execute_sql', {
      query: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    });
    if (extensionsError) throw extensionsError;

    // Create custom types
    console.log('Creating custom types...');
    const { error: typesError } = await supabase.rpc('execute_sql', {
      query: `
        CREATE TYPE user_role AS ENUM ('breeder', 'petOwner');
        CREATE TYPE dna_provider AS ENUM ('AnimalGenetics', 'Embark', 'Other');
        CREATE TYPE health_status AS ENUM ('Clear', 'Carrier', 'At Risk');
        CREATE TYPE risk_level AS ENUM ('Low', 'Medium', 'High');
      `
    });
    if (typesError) throw typesError;

    // Create tables
    console.log('Creating tables...');
    const { error: tablesError } = await supabase.rpc('execute_sql', {
      query: `
        CREATE TABLE profiles (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          first_name TEXT,
          last_name TEXT,
          role user_role NOT NULL DEFAULT 'petOwner',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          PRIMARY KEY (id)
        );

        CREATE TABLE dogs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          breed TEXT NOT NULL,
          date_of_birth DATE,
          color TEXT,
          owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
          is_stud BOOLEAN DEFAULT FALSE,
          breeding_program_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (tablesError) throw tablesError;

    // Create test user
    console.log('Creating test user...');
    const { error: createUserError } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'password123',
      email_confirmed_at: new Date().toISOString(),
    });
    if (createUserError) throw createUserError;

    console.log('Database setup completed successfully!');

  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
