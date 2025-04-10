import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

async function applyDropFunction() {
  try {
    console.log('Applying drop_all_tables function...');
    
    // Read the drop function SQL
    const dropFunctionPath = path.resolve(__dirname, '../supabase/functions/drop_all_tables.sql');
    const dropFunctionSql = fs.readFileSync(dropFunctionPath, 'utf8');

    // Execute the SQL
    const { error } = await supabase.rpc('execute_sql', { query: dropFunctionSql });
    
    if (error) {
      console.error('Error applying drop function:', error);
      throw error;
    }

    console.log('Drop function applied successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

applyDropFunction();
