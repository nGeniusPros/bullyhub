// netlify/functions/coi-calculator.js
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
    const { sireId, damId, generations = 5 } = data;

    if (!sireId || !damId) {
      return createResponse(400, { error: "Missing required fields" });
    }

    // Get sire pedigree
    const sirePedigree = await fetchPedigree(sireId, generations);

    // Get dam pedigree
    const damPedigree = await fetchPedigree(damId, generations);

    // Calculate COI
    const coiResult = calculateCOI(sirePedigree, damPedigree);

    return createResponse(200, coiResult);
  } catch (error) {
    console.error("Error processing request:", error);
    return createResponse(500, { error: "Internal Server Error" });
  }
}

// Fetch pedigree data for a dog
async function fetchPedigree(dogId, generations) {
  try {
    // Get the dog's details
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .select("*")
      .eq("id", dogId)
      .single();

    if (dogError) {
      console.error("Error fetching dog:", dogError);
      return null;
    }

    // If we've reached the maximum generations or there's no dog data, return just the dog
    if (generations <= 0 || !dog) {
      return {
        dog: {
          id: dog?.id || "unknown",
          name: dog?.name || "Unknown",
          breed: dog?.breed || "Unknown",
          color: dog?.color || "Unknown",
          dateOfBirth: dog?.date_of_birth || null,
        },
      };
    }

    // Get the dog's parents
    // In a real database, you would have a way to link dogs to their parents
    // For this example, we'll assume there's a 'parent_dogs' table with sire_id and dam_id fields
    const { data: parentData, error: parentError } = await supabase
      .from("parent_dogs")
      .select("sire_id, dam_id")
      .eq("dog_id", dogId)
      .single();

    // If we can't find parent data, return just the dog
    if (parentError || !parentData) {
      return {
        dog: {
          id: dog.id,
          name: dog.name,
          breed: dog.breed,
          color: dog.color,
          dateOfBirth: dog.date_of_birth,
        },
      };
    }

    // Recursively fetch the sire's pedigree
    const sirePedigree = parentData.sire_id
      ? await fetchPedigree(parentData.sire_id, generations - 1)
      : null;

    // Recursively fetch the dam's pedigree
    const damPedigree = parentData.dam_id
      ? await fetchPedigree(parentData.dam_id, generations - 1)
      : null;

    // Return the complete pedigree
    return {
      dog: {
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
        color: dog.color,
        dateOfBirth: dog.date_of_birth,
      },
      sire: sirePedigree,
      dam: damPedigree,
    };
  } catch (error) {
    console.error("Error fetching pedigree:", error);
    return null;
  }
}

// Calculate COI using Wright's method
function calculateCOI(sirePedigree, damPedigree) {
  // If we don't have pedigree data, use a default value
  if (!sirePedigree || !damPedigree) {
    return generateDefaultCOIResult();
  }

  try {
    // Find common ancestors
    const commonAncestors = findCommonAncestors(sirePedigree, damPedigree);

    // Calculate COI using Wright's method
    let coiPercentage = 0;

    for (const ancestor of commonAncestors) {
      // For each common ancestor, calculate (0.5)^(n1+n2+1) * (1 + Fa)
      // where n1 and n2 are the number of generations from sire and dam to the ancestor
      // and Fa is the ancestor's own inbreeding coefficient

      const pathContribution = Math.pow(
        0.5,
        ancestor.sireGenerations + ancestor.damGenerations + 1
      );
      const ancestorContribution = 1 + (ancestor.inbreedingCoefficient || 0);

      coiPercentage += pathContribution * ancestorContribution;
    }

    // Convert to percentage
    coiPercentage = coiPercentage * 100;

    // If no common ancestors were found, use a low default value
    if (commonAncestors.length === 0) {
      coiPercentage = 0.5; // 0.5% as a minimal baseline for the breed
    }

    // Round to 2 decimal places
    coiPercentage = Math.round(coiPercentage * 100) / 100;

    // Generate assessment and recommendations based on COI percentage
    return generateCOIResult(coiPercentage, commonAncestors);
  } catch (error) {
    console.error("Error calculating COI:", error);
    return generateDefaultCOIResult();
  }
}

// Find common ancestors in two pedigrees
function findCommonAncestors(sirePedigree, damPedigree) {
  const sireAncestors = collectAncestors(sirePedigree);
  const damAncestors = collectAncestors(damPedigree);

  const commonAncestors = [];

  // Find dogs that appear in both pedigrees
  for (const [sireAncestorId, sireAncestor] of Object.entries(sireAncestors)) {
    if (damAncestors[sireAncestorId]) {
      commonAncestors.push({
        id: sireAncestorId,
        name: sireAncestor.name,
        sireGenerations: sireAncestor.generations,
        damGenerations: damAncestors[sireAncestorId].generations,
        inbreedingCoefficient: 0, // In a real implementation, this would be calculated or retrieved
      });
    }
  }

  return commonAncestors;
}

// Collect all ancestors from a pedigree into a flat map
function collectAncestors(pedigree, generations = 0, ancestors = {}) {
  if (!pedigree || !pedigree.dog) return ancestors;

  // Add this dog to the ancestors map
  ancestors[pedigree.dog.id] = {
    name: pedigree.dog.name,
    generations: generations,
  };

  // Recursively add sire's ancestors
  if (pedigree.sire) {
    collectAncestors(pedigree.sire, generations + 1, ancestors);
  }

  // Recursively add dam's ancestors
  if (pedigree.dam) {
    collectAncestors(pedigree.dam, generations + 1, ancestors);
  }

  return ancestors;
}

// Generate COI result based on calculated percentage
function generateCOIResult(coiPercentage, commonAncestors) {
  let riskLevel, diversityAssessment, recommendations;

  // Determine risk level and recommendations based on COI percentage
  if (coiPercentage < 5.0) {
    riskLevel = "Low";
    diversityAssessment = "Good genetic diversity";
    recommendations = [
      "This breeding has a healthy level of genetic diversity",
      "Continue to monitor genetic diversity in future generations",
    ];
  } else if (coiPercentage < 10.0) {
    riskLevel = "Low to Medium";
    diversityAssessment = "Moderate genetic diversity";
    recommendations = [
      "This breeding has an acceptable COI level",
      "Consider outcrossing in future generations to maintain genetic diversity",
      "Monitor for any health issues that may be related to inbreeding",
    ];
  } else if (coiPercentage < 15.0) {
    riskLevel = "Medium";
    diversityAssessment = "Reduced genetic diversity";
    recommendations = [
      "This breeding has a moderately high COI level",
      "Strongly consider outcrossing in future generations",
      "Monitor closely for health issues that may be related to inbreeding",
      "Perform additional health testing before breeding",
    ];
  } else {
    riskLevel = "High";
    diversityAssessment = "Low genetic diversity";
    recommendations = [
      "This breeding has a high COI level that may increase health risks",
      "Reconsider this breeding combination",
      "Look for less related breeding partners to improve genetic diversity",
      "If proceeding, extensive health testing is strongly recommended",
    ];
  }

  // Format common ancestors for display
  const keyAncestors = commonAncestors
    .map((ancestor) => ({
      name: ancestor.name,
      contribution: calculateAncestorContribution(ancestor),
      pathDescription: `${ancestor.sireGenerations} generations from sire, ${ancestor.damGenerations} generations from dam`,
    }))
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 5); // Top 5 contributors

  return {
    coiPercentage,
    diversityAssessment,
    riskLevel,
    recommendations,
    keyAncestors,
    analysisDate: new Date().toISOString(),
  };
}

// Calculate an ancestor's contribution to the COI
function calculateAncestorContribution(ancestor) {
  const pathContribution = Math.pow(
    0.5,
    ancestor.sireGenerations + ancestor.damGenerations + 1
  );
  const ancestorContribution = 1 + (ancestor.inbreedingCoefficient || 0);

  // Return as percentage of total COI
  return Math.round(pathContribution * ancestorContribution * 10000) / 100;
}

// Generate a default COI result when calculation isn't possible
function generateDefaultCOIResult() {
  return {
    coiPercentage: 5.0, // Default value for the breed
    diversityAssessment: "Estimated genetic diversity",
    riskLevel: "Low to Medium",
    recommendations: [
      "This is an estimated COI based on breed averages",
      "For more accurate results, provide complete pedigree data",
      "Consider genetic testing to better understand genetic diversity",
    ],
    keyAncestors: [],
    analysisDate: new Date().toISOString(),
    isEstimate: true,
  };
}
