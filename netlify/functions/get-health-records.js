const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  try {
    const dogId = event.queryStringParameters?.dog_id || null;

    if (!dogId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing dog_id" }),
      };
    }

    // Step 1: Get dna_test_results for this dog
    const { data: dnaResults, error: dnaError } = await supabase
      .from("dna_test_results")
      .select("id")
      .eq("dog_id", dogId);

    if (dnaError) {
      console.error("Supabase error (dna_test_results):", dnaError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: dnaError.message }),
      };
    }

    const dnaIds = (dnaResults || []).map((r) => r.id);

    if (dnaIds.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }

    // Step 2: Get health_markers linked to these dna_test_results
    const { data: healthMarkers, error: healthError } = await supabase
      .from("health_markers")
      .select("*")
      .in("dna_test_result_id", dnaIds);

    if (healthError) {
      console.error("Supabase error (health_markers):", healthError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: healthError.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(healthMarkers),
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unexpected error" }),
    };
  }
};
