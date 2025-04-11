// netlify/functions/create-breeding-plan.js
import { createClient } from "@supabase/supabase-js";
import { createResponse, handleOptions } from "../utils/cors-headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function handler(event, context) {
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (event.httpMethod !== "POST") {
    return createResponse(405, { error: "Method Not Allowed" });
  }

  try {
    const data = JSON.parse(event.body);
    const { sireId, damId, breedingProgramId, plannedDate, notes } = data;

    if (!sireId || !damId || !breedingProgramId || !plannedDate) {
      return createResponse(400, { error: "Missing required fields" });
    }

    // Call compatibility function for sire
    const sireCompatibility = await fetch(
      `${process.env.URL}/.netlify/functions/breeding-program-compatibility`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dogId: sireId, breedingProgramId }),
      },
    ).then((res) => res.json());

    // Call compatibility function for dam
    const damCompatibility = await fetch(
      `${process.env.URL}/.netlify/functions/breeding-program-compatibility`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dogId: damId, breedingProgramId }),
      },
    ).then((res) => res.json());

    // Call COI calculator
    const coiResult = await fetch(
      `${process.env.URL}/.netlify/functions/coi-calculator`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sireId, damId }),
      },
    ).then((res) => res.json());

    // Call color prediction
    const colorPrediction = await fetch(
      `${process.env.URL}/.netlify/functions/color-prediction`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sireId, damId }),
      },
    ).then((res) => res.json());

    // Check compatibility
    const fullyCompatible =
      sireCompatibility.overallCompatibility === "Fully Compatible" &&
      damCompatibility.overallCompatibility === "Fully Compatible" &&
      coiResult.coi <= 6.25; // enforce COI threshold

    if (!fullyCompatible) {
      return createResponse(400, {
        error: "Pairing not fully compatible",
        sireCompatibility,
        damCompatibility,
        coiResult,
      });
    }

    // Insert new litter (breeding plan)
    const { data: litter, error: insertError } = await supabase
      .from("litters")
      .insert([
        {
          breeding_program_id: breedingProgramId,
          sire_id: sireId,
          dam_id: damId,
          whelping_date: plannedDate,
          puppy_count: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          notes,
          compatibility_report: {
            sireCompatibility,
            damCompatibility,
            coiResult,
            colorPrediction,
          },
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting litter:", insertError);
      return createResponse(500, { error: "Failed to create breeding plan" });
    }

    return createResponse(200, { litter });
  } catch (error) {
    console.error("Error creating breeding plan:", error);
    return createResponse(500, { error: "Internal Server Error" });
  }
}
