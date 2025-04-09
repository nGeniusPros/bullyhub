// netlify/functions/stud-receptionist.js
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { createResponse, handleOptions } from "../utils/cors-headers";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const { femaleId, message, breedingProgramId } = data;

    if (!femaleId || !message) {
      return createResponse(400, { error: "Missing required fields" });
    }

    // Get female dog details
    const { data: femaleDog, error: femaleError } = await supabase
      .from("dogs")
      .select("*, health_records(*), dna_tests(*)")
      .eq("id", femaleId)
      .single();

    if (femaleError) {
      console.error("Error fetching female dog:", femaleError);
      return createResponse(500, {
        error: "Failed to fetch female dog details",
      });
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

    // Get available studs
    const { data: availableStuds, error: studsError } = await supabase
      .from("dogs")
      .select("*, health_records(*), dna_tests(*), stud_services(*)")
      .eq("gender", "male")
      .eq("stud_available", true);

    if (studsError) {
      console.error("Error fetching available studs:", studsError);
      return createResponse(500, { error: "Failed to fetch available studs" });
    }

    // Use OpenAI to analyze compatibility and generate response
    const prompt = `
      You are an AI Stud Receptionist for a dog breeding service called Bully Hub.

      Female Dog Information:
      ${JSON.stringify(femaleDog, null, 2)}

      Available Studs:
      ${JSON.stringify(availableStuds, null, 2)}

      ${
        breedingProgram
          ? `Breeding Program: ${JSON.stringify(breedingProgram, null, 2)}`
          : ""
      }

      Client Message:
      "${message}"

      Based on the female dog's health records, DNA tests, and the available studs,
      provide recommendations for the most compatible studs. Consider genetic diversity,
      health clearances, and color genetics. Be professional but friendly in your response.
    `;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI Stud Receptionist for a dog breeding service.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
    });

    // Store the interaction in the database
    await supabase.from("stud_receptionist_interactions").insert([
      {
        female_dog_id: femaleId,
        breeding_program_id: breedingProgramId,
        client_message: message,
        ai_response: aiResponse.choices[0].message.content,
        created_at: new Date().toISOString(),
      },
    ]);

    return createResponse(200, {
      message: "Stud receptionist response generated",
      response: aiResponse.choices[0].message.content,
      recommendedStuds: availableStuds.slice(0, 3), // Just for example, in reality the AI would determine this
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return createResponse(500, { error: "Internal Server Error" });
  }
}
