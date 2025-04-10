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

async function resetDatabase() {
  try {
    console.log('Starting database reset...');

    // Drop all tables
    console.log('Dropping tables...');
    const dropTables = await supabase.rpc('drop_all_tables');
    if (dropTables.error) {
      console.error('Error dropping tables:', dropTables.error);
    }

    // Apply new schema
    console.log('Applying new schema...');
    const schemaPath = path.resolve(__dirname, '../supabase/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements and execute
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    for (const statement of statements) {
      try {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('execute_sql', { query: statement + ';' });
        
        if (error) {
          console.error(`Error executing statement: ${error.message}`);
        }
      } catch (error) {
        console.error(`Error executing statement: ${error.message}`);
      }
    }

    // Create test user
    console.log('Creating test user...');
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const testUser = users.users.find(u => u.email === 'test@example.com');
    if (testUser) {
      console.log('Test user already exists. Updating...');
      const { error: updateError } = await supabase.auth.admin.updateUser(testUser.id, {
        email_confirmed_at: new Date().toISOString(),
      });
      if (updateError) throw updateError;
    } else {
      console.log('Creating new test user...');
      const { error: createError } = await supabase.auth.admin.createUser({
        email: 'test@example.com',
        password: 'password123',
        email_confirmed_at: new Date().toISOString(),
      });
      if (createError) throw createError;
    }

    console.log('Database reset completed successfully!');

  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();
