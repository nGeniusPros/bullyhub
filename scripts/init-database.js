#!/usr/bin/env node
/**
 * Database Initialization Script
 * 
 * This script executes SQL schema files to create the necessary tables in the Supabase database.
 * It reads the SQL files from the features directory and executes them against the database.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing required environment variables.');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Path to features directory
const featuresDir = path.join(__dirname, '..', 'src', 'features');

// Function to execute SQL file
async function executeSqlFile(filePath, featureName) {
  try {
    console.log(`Executing SQL schema for ${featureName}...`);
    
    // Read SQL file
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
      
      if (error) {
        console.error(`Error executing SQL for ${featureName}:`, error);
        return false;
      }
    }
    
    console.log(`✅ Successfully initialized ${featureName} schema`);
    return true;
  } catch (error) {
    console.error(`Error processing SQL file for ${featureName}:`, error);
    return false;
  }
}

// Main function
async function initializeDatabase() {
  console.log('Starting database initialization...');
  
  // Get all feature directories
  const features = fs.readdirSync(featuresDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  let successCount = 0;
  let failCount = 0;
  
  // Process each feature
  for (const feature of features) {
    const schemaPath = path.join(featuresDir, feature, 'data', 'schema.sql');
    
    // Check if schema file exists
    if (fs.existsSync(schemaPath)) {
      const success = await executeSqlFile(schemaPath, feature);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }
  }
  
  console.log('\nDatabase initialization complete.');
  console.log(`✅ Successfully initialized ${successCount} feature schemas.`);
  
  if (failCount > 0) {
    console.log(`❌ Failed to initialize ${failCount} feature schemas.`);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase().catch(error => {
  console.error('Unhandled error during database initialization:', error);
  process.exit(1);
});
