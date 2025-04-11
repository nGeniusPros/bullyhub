// netlify/functions/db-check.js
import { supabase } from '../utils/supabase-client.js';
import { createResponse, handleOptions } from '../utils/cors-headers.js';
import { } from '../utils/monitoring.js';

export const handler = async (event, context) => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  try {
    console.log('db-check function called with event:', JSON.stringify(event));
    
    // Check if Supabase client is initialized
    if (!supabase) {
      return createResponse(500, { 
        error: 'Supabase client not initialized',
        message: 'The Supabase client could not be initialized. Check environment variables.'
      });
    }

    // Check if tables exist
    const tables = ['appointments', 'veterinarians', 'dogs', 'health_clearances'];
    const results = {};

    for (const table of tables) {
      try {
        console.log(`Checking if ${table} table exists...`);
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);

        results[table] = {
          exists: !error,
          error: error ? error.message : null
        };

        if (error) {
          console.error(`Error checking ${table} table:`, error);
        } else {
          console.log(`${table} table exists and is accessible`);
        }
      } catch (tableError) {
        console.error(`Exception checking ${table} table:`, tableError);
        results[table] = {
          exists: false,
          error: tableError.message
        };
      }
    }

    return createResponse(200, {
      message: "Database check completed",
      timestamp: new Date().toISOString(),
      tables: results
    });
  } catch (error) {
    console.error('Error in db-check function:', error);
    return createResponse(500, { 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
