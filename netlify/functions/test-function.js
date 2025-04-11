// netlify/functions/test-function.js
import { createResponse, handleOptions } from "../utils/cors-headers.js";
import { } from "../utils/monitoring.js";

export const handler = async (event, context) => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  try {
    console.log('test-function called with event:', JSON.stringify(event));
    
    // Return environment variables (redacted for security)
    const envVars = {
      SUPABASE_URL_EXISTS: !!process.env.SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY_EXISTS: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_ANON_KEY_EXISTS: !!process.env.SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NODE_ENV: process.env.NODE_ENV
    };

    return createResponse(200, {
      message: "Test function executed successfully",
      timestamp: new Date().toISOString(),
      environment: envVars
    });
  } catch (error) {
    console.error('Error in test function:', error);
    return createResponse(500, { 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
