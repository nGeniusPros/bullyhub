// DNA Testing Feature - Get DNA Data Function

/**
 * Get DNA test data for a dog
 *
 * This function retrieves DNA test results for a specific dog,
 * with optional filtering by test type and provider.
 */
export const createHandler = ({ createResponse, handleOptions, supabase }) => async (event, context) => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (event.httpMethod !== "GET") {
    return createResponse(405, { error: "Method not allowed" });
  }

  try {
    const params = new URLSearchParams(event.queryStringParameters);
    const dogId = params.get("dogId");
    const testType = params.get("testType");
    const testProvider = params.get("testProvider");
    const testId = params.get("testId");

    if (testId) {
      // Get a specific test by ID
      const { data: test, error } = await supabase
        .from("dna_test_results")
        .select("*")
        .eq("id", testId)
        .single();

      if (error) {
        console.error("Error fetching DNA test:", error);
        return createResponse(404, { error: "DNA test not found" });
      }

      return createResponse(200, test);
    }

    if (!dogId) {
      return createResponse(400, { error: "Missing required dogId parameter" });
    }

    // Verify the dog exists
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .select("id")
      .eq("id", dogId)
      .single();

    if (dogError || !dog) {
      console.error("Error fetching dog:", dogError);
      return createResponse(404, { error: "Dog not found" });
    }

    // Build the query
    let query = supabase
      .from("dna_test_results")
      .select("*")
      .eq("dog_id", dogId);

    if (testType) {
      query = query.eq("test_type", testType);
    }

    if (testProvider) {
      query = query.eq("test_provider", testProvider);
    }

    // Order by test date, newest first
    query = query.order("test_date", { ascending: false });

    const { data: tests, error } = await query;

    if (error) {
      console.error("Error fetching DNA tests:", error);
      return createResponse(500, { error: "Failed to fetch DNA tests" });
    }

    // Get genetic markers for reference
    const { data: geneticMarkers } = await supabase
      .from("genetic_markers")
      .select("*");

    // Enrich the test results with marker information
    const enrichedTests = tests.map(test => {
      const enrichedResults = { ...test.results };

      // Add marker information to each result
      if (test.results.markers) {
        Object.entries(test.results.markers).forEach(([key, value]) => {
          const marker = geneticMarkers?.find(m =>
            m.gene_symbol.toLowerCase() === key.toLowerCase() ||
            m.marker_name.toLowerCase() === key.toLowerCase()
          );

          if (marker) {
            enrichedResults.markers[key] = {
              ...value,
              description: marker.description || value.description,
              inheritance_pattern: marker.inheritance_pattern,
              possible_values: marker.possible_values
            };
          }
        });
      }

      return {
        ...test,
        results: enrichedResults
      };
    });

    return createResponse(200, {
      tests: enrichedTests,
      summary: generateTestSummary(tests)
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return createResponse(500, { error: "Internal server error" });
  }
};

/**
 * Generate a summary of DNA tests
 * @param {Array} tests - Array of DNA test results
 * @returns {Object} Summary object
 */
function generateTestSummary(tests) {
  const summary = {
    totalTests: tests.length,
    byType: {},
    byProvider: {}
  };

  // Count tests by type and provider
  tests.forEach(test => {
    // Count by type
    if (!summary.byType[test.test_type]) {
      summary.byType[test.test_type] = 0;
    }
    summary.byType[test.test_type]++;

    // Count by provider
    if (!summary.byProvider[test.test_provider]) {
      summary.byProvider[test.test_provider] = 0;
    }
    summary.byProvider[test.test_provider]++;
  });

  // Get the latest test
  if (tests.length > 0) {
    const latestTest = tests[0]; // Already sorted by date
    summary.latestTest = {
      id: latestTest.id,
      type: latestTest.test_type,
      provider: latestTest.test_provider,
      date: latestTest.test_date
    };
  }

  return summary;
}
