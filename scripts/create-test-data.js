import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
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

async function createTestData() {
  try {
    // Create test user if needed
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const testUser = users.users.find(u => u.email === 'test@example.com');
    if (!testUser) {
      console.error('Test user not found. Please run create-test-user.js first.');
      process.exit(1);
    }

    // Create test profile
    const profileId = uuidv4();
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: profileId,
        first_name: 'Test',
        last_name: 'User',
        role: 'petOwner'
      }]);

    if (profileError) throw profileError;

    // Create test dog
    const dogId = uuidv4();
    const { error: dogError } = await supabase
      .from('dogs')
      .insert([{
        id: dogId,
        name: 'Test Dog',
        breed: 'Test Breed',
        date_of_birth: '2020-01-01',
        owner_id: profileId,
        is_stud: false
      }]);

    if (dogError) throw dogError;

    // Create test DNA test result
    const dnaTestId = uuidv4();
    const { error: dnaTestError } = await supabase
      .from('dna_test_results')
      .insert([{
        id: dnaTestId,
        dog_id: dogId,
        provider: 'AnimalGenetics',
        test_date: '2023-01-01'
      }]);

    if (dnaTestError) throw dnaTestError;

    console.log('Test data created successfully!');
    console.log('Profile ID:', profileId);
    console.log('Dog ID:', dogId);
    console.log('DNA Test ID:', dnaTestId);

  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
}

createTestData();
