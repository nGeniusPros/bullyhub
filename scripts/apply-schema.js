import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
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

async function applySchema() {
  try {
    console.log('Reading schema.sql file...');
    const schemaPath = path.resolve(__dirname, '../supabase/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Applying schema to Supabase...');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      try {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('execute_sql', { query: statement + ';' });
        
        if (error) {
          console.error(`Error executing statement: ${error.message}`);
          throw error;
        }
      } catch (error) {
        console.error(`Error executing statement: ${error.message}`);
        throw error;
      }
    }
    
    console.log('Schema applied successfully!');
    
  } catch (error) {
    console.error('Error applying schema:', error);
  }
}

applySchema();
