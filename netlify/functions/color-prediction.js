// netlify/functions/color-prediction.js
import { createClient } from "@supabase/supabase-js";
import { createResponse, handleOptions } from "../utils/cors-headers";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function handler(event, context) {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return createResponse(405, { error: "Method Not Allowed" });
  }

  try {
    // Parse the incoming request body
    const data = JSON.parse(event.body);
    const { sireId, damId } = data;

    if (!sireId || !damId) {
      return createResponse(400, { error: "Missing required fields" });
    }

    // Get sire details with DNA test results
    const { data: sire, error: sireError } = await supabase
      .from("dogs")
      .select(
        `
        id,
        name,
        breed,
        color,
        dna_tests:dna_test_results(
          id,
          provider,
          test_date,
          genetic_markers(id, locus, alleles, description)
        )
      `,
      )
      .eq("id", sireId)
      .single();

    if (sireError) {
      console.error("Error fetching sire:", sireError);
      return createResponse(500, { error: "Failed to fetch sire details" });
    }

    // Get dam details with DNA test results
    const { data: dam, error: damError } = await supabase
      .from("dogs")
      .select(
        `
        id,
        name,
        breed,
        color,
        dna_tests:dna_test_results(
          id,
          provider,
          test_date,
          genetic_markers(id, locus, alleles, description)
        )
      `,
      )
      .eq("id", damId)
      .single();

    if (damError) {
      console.error("Error fetching dam:", damError);
      return createResponse(500, { error: "Failed to fetch dam details" });
    }

    // Get color genetics data
    const { data: colorGenetics, error: colorGeneticsError } = await supabase
      .from("color_genetics")
      .select("*");

    if (colorGeneticsError) {
      console.error("Error fetching color genetics:", colorGeneticsError);
      // Continue with basic prediction if color genetics data is not available
    }

    // Get color inheritance data
    const { data: colorInheritance, error: colorInheritanceError } =
      await supabase.from("color_inheritance").select("*");

    if (colorInheritanceError) {
      console.error("Error fetching color inheritance:", colorInheritanceError);
      // Continue with basic prediction if color inheritance data is not available
    }

    // Analyze genetic markers and predict colors
    const predictions = predictColors(
      sire,
      dam,
      colorGenetics,
      colorInheritance,
    );

    return createResponse(200, {
      predictions: predictions,
      parentColors: {
        sire: sire.color,
        dam: dam.color,
      },
      confidence: calculateConfidence(sire, dam),
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return createResponse(500, { error: "Internal Server Error" });
  }
}

// Function to predict colors based on genetic data
function predictColors(sire, dam, colorGenetics, colorInheritance) {
  // If we have detailed genetic markers and color inheritance data, use them
  if (hasDetailedGeneticData(sire, dam) && colorGenetics && colorInheritance) {
    return predictColorsFromGenetics(
      sire,
      dam,
      colorGenetics,
      colorInheritance,
    );
  }

  // Otherwise, use basic color prediction based on parents' colors
  return basicColorPrediction(sire.color, dam.color);
}

// Check if we have detailed genetic data
function hasDetailedGeneticData(sire, dam) {
  return (
    sire.dna_tests &&
    sire.dna_tests.length > 0 &&
    sire.dna_tests[0].genetic_markers &&
    sire.dna_tests[0].genetic_markers.length > 0 &&
    dam.dna_tests &&
    dam.dna_tests.length > 0 &&
    dam.dna_tests[0].genetic_markers &&
    dam.dna_tests[0].genetic_markers.length > 0
  );
}

// Predict colors from detailed genetic data
function predictColorsFromGenetics(sire, dam, colorGenetics, colorInheritance) {
  // This would be a complex implementation based on genetic inheritance
  // For now, we'll use a simplified version

  // Try to find a matching color inheritance record
  const sireColor = colorGenetics.find(
    (cg) => cg.color_name.toLowerCase() === sire.color.toLowerCase(),
  );
  const damColor = colorGenetics.find(
    (cg) => cg.color_name.toLowerCase() === dam.color.toLowerCase(),
  );

  if (sireColor && damColor) {
    const inheritanceRecord = colorInheritance.find(
      (ci) =>
        (ci.parent1_color_id === sireColor.id &&
          ci.parent2_color_id === damColor.id) ||
        (ci.parent1_color_id === damColor.id &&
          ci.parent2_color_id === sireColor.id),
    );

    if (inheritanceRecord && inheritanceRecord.possible_offspring_colors) {
      // Convert the inheritance record to our prediction format
      return inheritanceRecord.possible_offspring_colors.map((poc) => ({
        color:
          colorGenetics.find((cg) => cg.id === poc.color_id)?.color_name ||
          "Unknown",
        percentage: poc.probability * 100,
        description:
          colorGenetics.find((cg) => cg.id === poc.color_id)?.description ||
          "Unknown color",
      }));
    }
  }

  // Fall back to basic prediction if no matching inheritance record
  return basicColorPrediction(sire.color, dam.color);
}

// Basic color prediction based on parents' colors
function basicColorPrediction(sireColor, damColor) {
  // Simplified color prediction logic for French Bulldogs
  const predictions = [];

  // Standardize colors
  sireColor = sireColor.toLowerCase();
  damColor = damColor.toLowerCase();

  // Both parents same color
  if (sireColor === damColor) {
    predictions.push({
      color: capitalizeFirstLetter(sireColor),
      percentage: 70,
      description: `Same color as parents (${capitalizeFirstLetter(
        sireColor,
      )})`,
    });

    // Add some variation
    if (sireColor.includes("blue")) {
      predictions.push({
        color: "Blue",
        percentage: 30,
        description: "Blue coat (dilute black)",
      });
    } else if (sireColor.includes("fawn")) {
      predictions.push({
        color: "Cream",
        percentage: 30,
        description: "Lighter variant of fawn",
      });
    } else if (sireColor.includes("brindle")) {
      predictions.push({
        color: "Dark Brindle",
        percentage: 30,
        description: "Darker variant of brindle",
      });
    } else {
      // Default variation
      predictions.push({
        color: "Variant",
        percentage: 30,
        description: "Color variant based on recessive genes",
      });
    }
  }
  // Different colors
  else {
    // Add both parent colors with different probabilities
    predictions.push({
      color: capitalizeFirstLetter(sireColor),
      percentage: 40,
      description: `Same color as sire (${capitalizeFirstLetter(sireColor)})`,
    });

    predictions.push({
      color: capitalizeFirstLetter(damColor),
      percentage: 40,
      description: `Same color as dam (${capitalizeFirstLetter(damColor)})`,
    });

    // Add a blend or variation
    let blendColor;
    let blendDescription;

    if (
      (sireColor.includes("blue") && damColor.includes("fawn")) ||
      (damColor.includes("blue") && sireColor.includes("fawn"))
    ) {
      blendColor = "Blue Fawn";
      blendDescription = "Dilute fawn coat";
    } else if (
      (sireColor.includes("blue") && damColor.includes("brindle")) ||
      (damColor.includes("blue") && sireColor.includes("brindle"))
    ) {
      blendColor = "Blue Brindle";
      blendDescription = "Brindle pattern on blue base";
    } else if (
      (sireColor.includes("fawn") && damColor.includes("brindle")) ||
      (damColor.includes("fawn") && sireColor.includes("brindle"))
    ) {
      blendColor = "Fawn Brindle";
      blendDescription = "Light brindle pattern on fawn base";
    } else if (
      (sireColor.includes("black") || damColor.includes("black")) &&
      (sireColor.includes("tan") || damColor.includes("tan"))
    ) {
      blendColor = "Black and Tan";
      blendDescription = "Black coat with tan points";
    } else {
      blendColor = "Mixed";
      blendDescription = "Mixed color from both parents";
    }

    predictions.push({
      color: blendColor,
      percentage: 20,
      description: blendDescription,
    });
  }

  return predictions;
}

// Calculate confidence level based on available data
function calculateConfidence(sire, dam) {
  let confidence = 0.5; // Base confidence

  // Increase confidence if we have DNA tests
  if (sire.dna_tests && sire.dna_tests.length > 0) confidence += 0.1;
  if (dam.dna_tests && dam.dna_tests.length > 0) confidence += 0.1;

  // Increase confidence if we have genetic markers
  if (
    sire.dna_tests &&
    sire.dna_tests.length > 0 &&
    sire.dna_tests[0].genetic_markers &&
    sire.dna_tests[0].genetic_markers.length > 0
  ) {
    confidence += 0.1;
  }

  if (
    dam.dna_tests &&
    dam.dna_tests.length > 0 &&
    dam.dna_tests[0].genetic_markers &&
    dam.dna_tests[0].genetic_markers.length > 0
  ) {
    confidence += 0.1;
  }

  // Cap at 0.9 since predictions are never 100% certain
  return Math.min(confidence, 0.9);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
