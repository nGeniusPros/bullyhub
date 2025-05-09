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

async function applyVaccinationsSchema() {
  try {
    console.log('Reading create_vaccinations_table.sql file...');
    const schemaPath = path.resolve(__dirname, '../supabase/create_vaccinations_table.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Applying vaccinations schema to Supabase...');
    
    const { error } = await supabase.rpc('execute_sql', { query: schema });
    
    if (error) {
      console.error('Error applying vaccinations schema:', error);
      throw error;
    }
    
    console.log('Vaccinations schema applied successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

applyVaccinationsSchema();
