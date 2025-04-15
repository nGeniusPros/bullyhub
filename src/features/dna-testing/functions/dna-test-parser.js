// DNA Testing Feature - DNA Test Parser Function

/**
 * Parse DNA test results from various providers
 *
 * This function accepts DNA test data in various formats and parses it into
 * a standardized structure for storage in the database.
 */
export const createHandler = ({ createResponse, handleOptions, supabase }) => async (event, context) => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (event.httpMethod !== "POST") {
    return createResponse(405, { error: "Method not allowed" });
  }

  try {
    const { dogId, testType, testProvider, testData, rawData } = JSON.parse(event.body);

    if (!dogId || !testType || !testProvider || !testData) {
      return createResponse(400, {
        error: "Missing required fields",
        required: ["dogId", "testType", "testProvider", "testData"]
      });
    }

    // Verify the dog exists and the user has permission
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .select("id, owner_id")
      .eq("id", dogId)
      .single();

    if (dogError || !dog) {
      console.error("Error fetching dog:", dogError);
      return createResponse(404, { error: "Dog not found" });
    }

    // Parse the test data based on the provider
    const parsedResults = await parseTestData(testType, testProvider, testData);

    // Store the results in the database
    const { data: testResult, error: testError } = await supabase
      .from("dna_test_results")
      .insert({
        dog_id: dogId,
        test_type: testType,
        test_provider: testProvider,
        test_date: new Date().toISOString(),
        results: parsedResults,
        raw_results: rawData || JSON.stringify(testData)
      })
      .select()
      .single();

    if (testError) {
      console.error("Error storing test results:", testError);
      return createResponse(500, { error: "Failed to store test results" });
    }

    return createResponse(200, {
      success: true,
      message: "DNA test results parsed and stored successfully",
      testId: testResult.id,
      parsedResults
    });
  } catch (error) {
    console.error("Error processing DNA test:", error);
    return createResponse(500, { error: "Internal server error" });
  }
};

/**
 * Parse test data based on provider and test type
 * @param {string} testType - The type of test
 * @param {string} testProvider - The provider of the test
 * @param {object} testData - The raw test data
 * @returns {object} Parsed test results
 */
async function parseTestData(testType, testProvider, testData) {
  // Get genetic markers from the database for reference
  const { data: geneticMarkers } = await supabase
    .from("genetic_markers")
    .select("*")
    .eq("marker_type", testType === "health-markers" ? "health" : "color");

  const markers = geneticMarkers || [];

  // Standardized results object
  const results = {
    provider: testProvider,
    type: testType,
    timestamp: new Date().toISOString(),
    markers: {}
  };

  // Parse based on provider
  switch (testProvider.toLowerCase()) {
    case "embark":
      return parseEmbarkResults(testType, testData, markers, results);

    case "wisdom panel":
    case "wisdompanel":
      return parseWisdomPanelResults(testType, testData, markers, results);

    case "paw print genetics":
    case "pawprintgenetics":
      return parsePawPrintResults(testType, testData, markers, results);

    default:
      // Generic parser for unknown providers
      return parseGenericResults(testType, testData, markers, results);
  }
}

/**
 * Parse Embark test results
 */
function parseEmbarkResults(testType, testData, markers, results) {
  // Embark-specific parsing logic
  if (testType === "color-genetics") {
    // Parse color genetics
    if (testData.traits) {
      Object.entries(testData.traits).forEach(([trait, value]) => {
        const marker = markers.find(m =>
          m.marker_name.toLowerCase() === trait.toLowerCase() ||
          m.gene_symbol.toLowerCase() === trait.toLowerCase()
        );

        if (marker) {
          results.markers[marker.gene_symbol] = {
            name: marker.marker_name,
            value: value,
            description: marker.description
          };
        } else {
          // For unknown markers, still include them
          results.markers[trait] = {
            name: trait,
            value: value
          };
        }
      });
    }
  } else if (testType === "health-markers") {
    // Parse health markers
    if (testData.health_conditions) {
      testData.health_conditions.forEach(condition => {
        const marker = markers.find(m =>
          m.condition_name?.toLowerCase() === condition.name?.toLowerCase()
        );

        results.markers[condition.name] = {
          name: condition.name,
          value: condition.status || "unknown",
          risk: condition.risk || "unknown",
          description: marker?.description || condition.description
        };
      });
    }
  }

  return results;
}

/**
 * Parse Wisdom Panel test results
 */
function parseWisdomPanelResults(testType, testData, markers, results) {
  // Wisdom Panel-specific parsing logic
  // Implementation similar to Embark but adjusted for Wisdom Panel's format
  return results;
}

/**
 * Parse Paw Print Genetics test results
 */
function parsePawPrintResults(testType, testData, markers, results) {
  // Paw Print Genetics-specific parsing logic
  // Implementation similar to Embark but adjusted for Paw Print's format
  return results;
}

/**
 * Generic parser for unknown providers
 */
function parseGenericResults(testType, testData, markers, results) {
  // Try to match keys in testData with known genetic markers
  Object.entries(testData).forEach(([key, value]) => {
    const marker = markers.find(m =>
      m.marker_name.toLowerCase() === key.toLowerCase() ||
      m.gene_symbol.toLowerCase() === key.toLowerCase()
    );

    if (marker) {
      results.markers[marker.gene_symbol] = {
        name: marker.marker_name,
        value: value,
        description: marker.description
      };
    } else {
      // For unknown markers, still include them
      results.markers[key] = {
        name: key,
        value: value
      };
    }
  });

  return results;
}
