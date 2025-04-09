// netlify/functions/dna-test-integration.js
import { createClient } from "@supabase/supabase-js";
import { createResponse, handleOptions } from "../utils/cors-headers";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function handler(event, context) {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return createResponse(405, { error: "Method Not Allowed" });
  }

  try {
    // Parse the incoming request body
    const data = JSON.parse(event.body);
    const { dogId, testType, testResults } = data;

    if (!dogId || !testType || !testResults) {
      return createResponse(400, { error: "Missing required fields" });
    }

    // Store the DNA test results in Supabase
    const { data: dnaTest, error } = await supabase
      .from("dna_tests")
      .insert([
        {
          dog_id: dogId,
          test_type: testType,
          results: testResults,
          test_date: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Error storing DNA test:", error);
      return createResponse(500, { error: "Failed to store DNA test results" });
    }

    return createResponse(200, {
      message: "DNA test results stored successfully",
      data: dnaTest,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return createResponse(500, { error: "Internal Server Error" });
  }
}
