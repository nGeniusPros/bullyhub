import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase URL or service role key');
  process.exit(1);
}

// Create Supabase admin client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey);

// Test table name - we'll create this temporarily for testing
const TEST_TABLE = 'test_crud_operations';

async function testCrudOperations() {
  try {
    console.log('\n=== TESTING DATABASE CRUD OPERATIONS ===\n');
    
    // Step 1: Create a temporary test table
    console.log('1. Creating temporary test table...');
    const { error: createError } = await supabase.rpc('create_test_table', {
      table_name: TEST_TABLE
    });
    
    if (createError) {
      // If the RPC function doesn't exist, create the table directly with SQL
      console.log('RPC function not found, creating table with SQL...');
      const { error: sqlError } = await supabase.rpc('exec_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS ${TEST_TABLE} (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (sqlError) {
        console.error('Error creating test table with SQL:', sqlError);
        
        // As a last resort, try using the REST API to create the table
        console.log('Attempting to create table using REST API...');
        try {
          // Check if table exists first
          const { data: tableExists } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .eq('table_name', TEST_TABLE)
            .single();
          
          if (!tableExists) {
            console.log('Table does not exist. Note: We cannot create tables through the REST API.');
            console.log('Please run the schema.sql script to set up the database schema.');
            console.log('Continuing with tests on existing tables...');
          } else {
            console.log('Table already exists, continuing with tests...');
          }
        } catch (error) {
          console.error('Error checking if table exists:', error);
        }
      } else {
        console.log('✅ Test table created successfully!');
      }
    } else {
      console.log('✅ Test table created successfully!');
    }
    
    // Step 2: Test INSERT operation on dogs table
    console.log('\n2. Testing INSERT operation on dogs table...');
    
    // First check if the dogs table exists
    const { data: dogsTableExists } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'dogs')
      .single();
    
    if (!dogsTableExists) {
      console.log('Dogs table does not exist. Skipping INSERT test.');
    } else {
      // Check if we need to create a test profile first (for foreign key constraint)
      const { data: profilesTableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'profiles')
        .single();
      
      let ownerId = null;
      
      if (profilesTableExists) {
        // Get or create a test profile
        const { data: existingProfiles } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
        
        if (existingProfiles && existingProfiles.length > 0) {
          ownerId = existingProfiles[0].id;
          console.log('Using existing profile with ID:', ownerId);
        } else {
          // Try to create a test profile
          console.log('No profiles found. Cannot create test dog without an owner.');
        }
      }
      
      if (ownerId) {
        // Create a test dog
        const testDog = {
          name: 'Test Dog',
          breed: 'Test Breed',
          color: 'Brindle',
          owner_id: ownerId,
          is_stud: false
        };
        
        const { data: insertData, error: insertError } = await supabase
          .from('dogs')
          .insert(testDog)
          .select();
        
        if (insertError) {
          console.error('Error inserting test dog:', insertError);
        } else {
          console.log('✅ INSERT operation successful!');
          console.log('Inserted dog:', insertData[0]);
          
          // Step 3: Test SELECT operation
          console.log('\n3. Testing SELECT operation...');
          const { data: selectData, error: selectError } = await supabase
            .from('dogs')
            .select('*')
            .eq('id', insertData[0].id)
            .single();
          
          if (selectError) {
            console.error('Error selecting dog:', selectError);
          } else {
            console.log('✅ SELECT operation successful!');
            console.log('Selected dog:', selectData);
            
            // Step 4: Test UPDATE operation
            console.log('\n4. Testing UPDATE operation...');
            const { data: updateData, error: updateError } = await supabase
              .from('dogs')
              .update({ name: 'Updated Test Dog' })
              .eq('id', insertData[0].id)
              .select();
            
            if (updateError) {
              console.error('Error updating dog:', updateError);
            } else {
              console.log('✅ UPDATE operation successful!');
              console.log('Updated dog:', updateData[0]);
              
              // Step 5: Test DELETE operation
              console.log('\n5. Testing DELETE operation...');
              const { error: deleteError } = await supabase
                .from('dogs')
                .delete()
                .eq('id', insertData[0].id);
              
              if (deleteError) {
                console.error('Error deleting dog:', deleteError);
              } else {
                console.log('✅ DELETE operation successful!');
              }
            }
          }
        }
      }
    }
    
    // Step 6: Clean up (drop test table if we created it)
    console.log('\n6. Cleaning up...');
    try {
      const { data: testTableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', TEST_TABLE)
        .single();
      
      if (testTableExists) {
        const { error: dropError } = await supabase.rpc('exec_sql', {
          sql_query: `DROP TABLE IF EXISTS ${TEST_TABLE};`
        });
        
        if (dropError) {
          console.error('Error dropping test table:', dropError);
        } else {
          console.log('✅ Test table dropped successfully!');
        }
      }
    } catch (error) {
      // Table doesn't exist, nothing to clean up
    }
    
    console.log('\n=== DATABASE CRUD TESTS COMPLETE ===\n');
    
  } catch (error) {
    console.error('Unexpected error during testing:', error);
  }
}

testCrudOperations();
