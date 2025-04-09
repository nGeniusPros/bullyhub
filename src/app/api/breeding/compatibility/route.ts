import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// Initialize OpenAI client if API key is available
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const { sireId, damId, breedingProgramId } = await request.json();

    if (!sireId || !damId) {
      return NextResponse.json(
        { error: "Both sireId and damId are required" },
        { status: 400 }
      );
    }

    // Get the sire with DNA test results
    const { data: sire, error: sireError } = await supabase
      .from("dogs")
      .select(
        `
        *,
        dna_tests:dna_test_results(
          id,
          provider,
          test_date,
          genetic_markers:genetic_markers(id, locus, alleles, description),
          health_markers:health_markers(id, condition, status)
        )
      `
      )
      .eq("id", sireId)
      .single();

    if (sireError) {
      return NextResponse.json({ error: "Sire not found" }, { status: 404 });
    }

    // Get the dam with DNA test results
    const { data: dam, error: damError } = await supabase
      .from("dogs")
      .select(
        `
        *,
        dna_tests:dna_test_results(
          id,
          provider,
          test_date,
          genetic_markers:genetic_markers(id, locus, alleles, description),
          health_markers:health_markers(id, condition, status)
        )
      `
      )
      .eq("id", damId)
      .single();

    if (damError) {
      return NextResponse.json({ error: "Dam not found" }, { status: 404 });
    }

    // Verify that the user has permission to access these dogs
    // User must own at least one of the dogs
    if (sire.owner_id !== user.id && dam.owner_id !== user.id) {
      return NextResponse.json(
        { error: "You must own at least one of the dogs" },
        { status: 403 }
      );
    }

    // Get breeding program details if provided
    let breedingProgram = null;
    if (breedingProgramId) {
      const { data: program, error: programError } = await supabase
        .from("breeding_programs")
        .select("*")
        .eq("id", breedingProgramId)
        .single();

      if (!programError) {
        breedingProgram = program;
      }
    }

    // Check if we should use AI for enhanced analysis
    const useAI = openai !== null;

    // Analyze breeding compatibility
    const compatibility = await analyzeBreedingCompatibility(
      sire,
      dam,
      breedingProgram,
      useAI
    );

    // Save the analysis to the database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from("breeding_compatibility_analyses")
      .insert({
        user_id: user.id,
        sire_id: sireId,
        dam_id: damId,
        breeding_program_id: breedingProgramId,
        compatibility_score: compatibility.score,
        color_predictions: compatibility.colorPredictions,
        health_risks: compatibility.healthRisks,
        coi: compatibility.coi,
        recommendation: compatibility.recommendation,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving compatibility analysis:", saveError);
      // Continue even if saving fails
    }

    return NextResponse.json({
      sire: {
        id: sire.id,
        name: sire.name,
        breed: sire.breed,
        color: sire.color,
        hasDNA: sire.dna_tests && sire.dna_tests.length > 0,
      },
      dam: {
        id: dam.id,
        name: dam.name,
        breed: dam.breed,
        color: dam.color,
        hasDNA: dam.dna_tests && dam.dna_tests.length > 0,
      },
      score: compatibility.score,
      colorPredictions: compatibility.colorPredictions,
      healthRisks: compatibility.healthRisks,
      coi: compatibility.coi,
      recommendation: compatibility.recommendation,
      aiEnhanced: compatibility.aiEnhanced,
    });
  } catch (error) {
    console.error("Error analyzing breeding compatibility:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Analyze breeding compatibility between two dogs
async function analyzeBreedingCompatibility(
  sire,
  dam,
  breedingProgram,
  useAI = false
) {
  // Extract color information
  const sireColor = sire.color || "Unknown";
  const damColor = dam.color || "Unknown";

  // Generate color predictions based on the parents' colors
  const colorPredictions = generateColorPredictions(sireColor, damColor);

  // Analyze health risks based on DNA test results
  const healthRisks = analyzeHealthRisks(sire, dam);

  // Calculate COI (Coefficient of Inbreeding)
  // This would normally require pedigree information
  const coi = calculateMockCOI(sire, dam);

  // Calculate overall compatibility score
  const score = calculateCompatibilityScore(
    colorPredictions,
    healthRisks,
    coi,
    breedingProgram
  );

  // Generate recommendation
  let recommendation = generateRecommendation(score, healthRisks, coi);

  // Use AI to enhance the recommendation if available
  let aiEnhanced = false;
  if (useAI) {
    try {
      const enhancedRecommendation = await enhanceRecommendationWithAI(
        sire,
        dam,
        breedingProgram,
        score,
        colorPredictions,
        healthRisks,
        coi
      );

      if (enhancedRecommendation) {
        recommendation = enhancedRecommendation;
        aiEnhanced = true;
      }
    } catch (error) {
      console.error("Error enhancing recommendation with AI:", error);
      // Fall back to the standard recommendation
    }
  }

  return {
    score,
    colorPredictions,
    healthRisks,
    coi,
    recommendation,
    aiEnhanced,
  };
}

function generateColorPredictions(sireColor, damColor) {
  // This is a simplified mock implementation
  // In reality, color genetics are complex and would require detailed genetic analysis

  const colorMap = {
    Brindle: ["Brindle", "Fawn"],
    Fawn: ["Fawn", "Brindle"],
    Blue: ["Blue", "Fawn", "Brindle"],
    Chocolate: ["Chocolate", "Fawn"],
    Lilac: ["Lilac", "Blue", "Chocolate"],
    Black: ["Black", "Brindle"],
    Cream: ["Cream", "Fawn"],
    Pied: ["Pied", "Solid"],
    Merle: ["Merle", "Solid"],
    Unknown: ["Unknown"],
  };

  const sireColors = colorMap[sireColor] || ["Unknown"];
  const damColors = colorMap[damColor] || ["Unknown"];

  // Combine possible colors from both parents
  const possibleColors = [...new Set([...sireColors, ...damColors])];

  // Generate predictions with percentages
  const totalPercentage = 100;
  const predictions = [];

  if (possibleColors.length === 1) {
    predictions.push({ color: possibleColors[0], percentage: 100 });
  } else {
    // Distribute percentages among possible colors
    const basePercentage = Math.floor(totalPercentage / possibleColors.length);
    let remainingPercentage = totalPercentage;

    possibleColors.forEach((color, index) => {
      // Give slightly higher percentage to the parents' actual colors
      const isParentColor = color === sireColor || color === damColor;
      const percentage = isParentColor ? basePercentage + 10 : basePercentage;

      predictions.push({
        color,
        percentage: Math.min(percentage, remainingPercentage),
      });
      remainingPercentage -= percentage;
    });

    // Adjust percentages to ensure they sum to 100%
    if (remainingPercentage > 0 && predictions.length > 0) {
      predictions[0].percentage += remainingPercentage;
    }
  }

  // Sort by percentage (descending)
  return predictions.sort((a, b) => b.percentage - a.percentage);
}

function analyzeHealthRisks(sire, dam) {
  // This is a simplified mock implementation
  // In reality, health risk analysis would be based on detailed genetic testing

  const healthRisks = [];

  // Common health conditions in bulldogs
  const conditions = [
    "Hip Dysplasia",
    "Brachycephalic Obstructive Airway Syndrome (BOAS)",
    "Skin Allergies",
    "Cherry Eye",
    "Entropion",
    "Cardiac Issues",
  ];

  // Check for health markers in DNA tests
  const sireHealthMarkers =
    sire.dna_tests?.flatMap((test) => test.health_markers) || [];
  const damHealthMarkers =
    dam.dna_tests?.flatMap((test) => test.health_markers) || [];

  // Add health risks based on DNA test results
  const allHealthMarkers = [...sireHealthMarkers, ...damHealthMarkers];
  const testedConditions = new Set();

  allHealthMarkers.forEach((marker) => {
    if (marker && marker.condition) {
      testedConditions.add(marker.condition);

      // Determine risk level based on status
      let risk = "Low";
      if (marker.status === "At Risk") {
        risk = "High";
      } else if (marker.status === "Carrier") {
        risk = "Medium";
      }

      // Check if this condition is already in the health risks
      const existingRisk = healthRisks.find(
        (r) => r.condition === marker.condition
      );
      if (existingRisk) {
        // Update risk level if the new one is higher
        if (
          (existingRisk.risk === "Low" &&
            (risk === "Medium" || risk === "High")) ||
          (existingRisk.risk === "Medium" && risk === "High")
        ) {
          existingRisk.risk = risk;
        }
      } else {
        // Add new health risk
        healthRisks.push({
          condition: marker.condition,
          risk,
          description: `Based on DNA test results from ${
            marker.status === "At Risk" ? "both parents" : "one parent"
          }.`,
        });
      }
    }
  });

  // Add some random health risks for conditions not covered by DNA tests
  const untested = conditions.filter(
    (condition) => !testedConditions.has(condition)
  );
  const numRandomRisks = Math.min(2, untested.length);

  for (let i = 0; i < numRandomRisks; i++) {
    const randomIndex = Math.floor(Math.random() * untested.length);
    const condition = untested[randomIndex];
    untested.splice(randomIndex, 1);

    const riskLevels = ["Low", "Medium", "High"];
    const risk = riskLevels[Math.floor(Math.random() * 2)]; // Bias toward Low and Medium

    healthRisks.push({
      condition,
      risk,
      description:
        "Based on breed predisposition. Consider testing both parents.",
    });
  }

  return healthRisks;
}

function calculateMockCOI(sire, dam) {
  // This is a simplified mock implementation
  // In reality, COI calculation requires detailed pedigree information

  // Generate a random COI between 1% and 15%
  // Lower is better (less inbreeding)
  return parseFloat((Math.random() * 14 + 1).toFixed(1));
}

function calculateCompatibilityScore(
  colorPredictions,
  healthRisks,
  coi,
  breedingProgram
) {
  // This is a simplified mock implementation
  // In reality, compatibility scoring would be based on complex genetic analysis

  // Base score
  let score = 70;

  // Adjust for health risks
  const healthRiskFactor = healthRisks.reduce((total, risk) => {
    if (risk.risk === "High") return total - 10;
    if (risk.risk === "Medium") return total - 5;
    return total - 1;
  }, 0);

  score += healthRiskFactor;

  // Adjust for COI
  if (coi < 5) {
    score += 10;
  } else if (coi < 10) {
    score += 5;
  } else {
    score -= (coi - 10) * 2;
  }

  // Adjust for color predictions if there's a breeding program
  if (breedingProgram && breedingProgram.color_focus) {
    const targetColor = breedingProgram.color_focus;
    const targetColorPrediction = colorPredictions.find(
      (p) => p.color.toLowerCase() === targetColor.toLowerCase()
    );

    if (targetColorPrediction) {
      score += targetColorPrediction.percentage / 10;
    } else {
      score -= 5;
    }
  }

  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, Math.round(score)));
}

function generateRecommendation(score, healthRisks, coi) {
  // Generate a recommendation based on the compatibility score

  if (score >= 80) {
    return "Excellent match! These dogs have high genetic compatibility and low health risks. Proceed with confidence.";
  } else if (score >= 70) {
    return "Good match. These dogs have good compatibility, but consider additional health testing before breeding.";
  } else if (score >= 60) {
    return "Moderate match. Proceed with caution and ensure all health clearances are completed before breeding.";
  } else if (score >= 50) {
    return "Fair match. There are some concerns with this pairing. Consider alternative matches or consult with a veterinary geneticist.";
  } else {
    return "Not recommended. This pairing has significant health or genetic concerns. Consider alternative matches.";
  }
}

async function enhanceRecommendationWithAI(
  sire,
  dam,
  breedingProgram,
  score,
  colorPredictions,
  healthRisks,
  coi
) {
  if (!openai) return null;

  try {
    // Prepare the prompt for the AI
    const prompt = `
      I need a detailed breeding recommendation for two bulldogs based on the following information:

      Sire (Male): ${sire.name}, ${sire.breed}, ${sire.color || "unknown color"}
      Dam (Female): ${dam.name}, ${dam.breed}, ${dam.color || "unknown color"}

      Compatibility Score: ${score}/100

      Color Predictions:
      ${colorPredictions
        .map((p) => `- ${p.color}: ${p.percentage}%`)
        .join("\n")}

      Health Risks:
      ${healthRisks
        .map((r) => `- ${r.condition}: ${r.risk} risk - ${r.description}`)
        .join("\n")}

      Coefficient of Inbreeding (COI): ${coi}%

      ${
        breedingProgram
          ? `Breeding Program: ${breedingProgram.name}, focusing on ${breedingProgram.color_focus} color`
          : "No specific breeding program"
      }

      Please provide a detailed recommendation (3-4 paragraphs) that includes:
      1. An overall assessment of the match
      2. Specific health considerations and testing recommendations
      3. Expected outcomes for puppies (colors, traits)
      4. Any special considerations or warnings

      Keep the tone professional but accessible to dog breeders.
    `;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in dog breeding, genetics, and health. Provide detailed, accurate breeding recommendations.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extract and return the AI's recommendation
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return null;
  }
}
