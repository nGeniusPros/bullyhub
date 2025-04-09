import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { BreedingProgram } from "@/types";

// Mock data for development
const mockBreedingPrograms = [
  {
    id: "1",
    breederId: "mock-user-id",
    name: "Blue French Bulldog Program",
    description:
      "Focused on producing healthy blue French Bulldogs with excellent temperament and structure.",
    goals: [
      "Improve health and reduce common breed issues",
      "Maintain proper French Bulldog structure",
      "Produce consistent blue coat color",
    ],
    programType: "rare",
    colorFocus: "Blue",
    healthProtocols: [
      {
        protocolName: "Hip Evaluation",
        description: "OFA or PennHIP evaluation",
        required: true,
        frequency: "Once before breeding",
      },
      {
        protocolName: "BOAS Assessment",
        description: "Brachycephalic Obstructive Airway Syndrome evaluation",
        required: true,
        frequency: "Once before breeding",
      },
    ],
    costRange: { min: 3500, max: 5500 },
    specialConsiderations: [
      "Focus on open nostrils and improved breathing",
      "Careful selection for proper structure",
    ],
    dogCount: 4,
    litterCount: 2,
    createdAt: "2023-08-15T00:00:00.000Z",
  },
  {
    id: "2",
    breederId: "mock-user-id",
    name: "Standard Brindle Program",
    description:
      "Traditional brindle French Bulldogs with excellent conformation and show potential.",
    goals: [
      "Produce show-quality French Bulldogs",
      "Maintain excellent brindle patterning",
      "Focus on breed standard conformation",
    ],
    programType: "standard",
    colorFocus: "Brindle",
    healthProtocols: [
      {
        protocolName: "Cardiac Evaluation",
        description: "Heart examination by cardiologist",
        required: true,
        frequency: "Annually",
      },
      {
        protocolName: "Patella Evaluation",
        description: "OFA patella evaluation",
        required: true,
        frequency: "Once before breeding",
      },
    ],
    costRange: { min: 2500, max: 4000 },
    specialConsiderations: [
      "Focus on proper movement",
      "Emphasis on correct head structure",
    ],
    dogCount: 6,
    litterCount: 3,
    createdAt: "2023-06-10T00:00:00.000Z",
  },
];

export async function GET() {
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

    // Get the user's profile to check if they're a breeder
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get breeding programs for the current user
    const { data: breedingPrograms, error: programsError } = await supabase
      .from("breeding_programs")
      .select(
        `
        *,
        dogs:dogs(id, name, breed, color),
        litters:litters(id)
      `
      )
      .eq("breeder_id", user.id);

    if (programsError) {
      console.error("Failed to fetch breeding programs:", programsError);
      return NextResponse.json(
        { error: "Failed to fetch breeding programs" },
        { status: 500 }
      );
    }

    // Format the response
    const formattedPrograms = (breedingPrograms || []).map((program) => ({
      id: program.id,
      breederId: program.breeder_id,
      name: program.name,
      description: program.description,
      goals: program.goals || [],
      programType: program.program_type,
      colorFocus: program.color_focus,
      healthProtocols: program.health_protocols || [],
      costRange: program.cost_range || { min: 0, max: 0 },
      specialConsiderations: program.special_considerations || [],
      dogCount: program.dogs?.length || 0,
      litterCount: program.litters?.length || 0,
      createdAt: program.created_at,
    }));

    return NextResponse.json(formattedPrograms);
  } catch (error) {
    console.error("Error fetching breeding programs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Get the user's profile to check if they're a breeder
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.role !== "breeder") {
      return NextResponse.json(
        { error: "Only breeders can create breeding programs" },
        { status: 403 }
      );
    }

    // Validate the request body
    const { breedingProgramSchema, validateRequest } = await import(
      "@/lib/validation"
    );
    const validation = await validateRequest(request, breedingProgramSchema);

    if (!validation.success) {
      return (validation as { success: false; error: NextResponse<unknown> }).error;
    }

    const programData = validation.data;

    // Insert the breeding program
    const { data: newProgram, error: insertError } = await supabase
      .from("breeding_programs")
      .insert({
        breeder_id: user.id,
        name: programData.name,
        description: programData.description,
        goals: programData.goals,
        program_type: programData.programType,
        color_focus: programData.colorFocus,
        health_protocols: programData.healthProtocols,
        cost_range: programData.costRange,
        special_considerations: programData.specialConsiderations,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting breeding program:", insertError);
      return NextResponse.json(
        {
          error: "Failed to create breeding program",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    // Format the response
    const formattedProgram: BreedingProgram = {
      id: newProgram.id,
      breederId: newProgram.breeder_id,
      name: newProgram.name,
      description: newProgram.description,
      goals: newProgram.goals || [],
      programType: newProgram.program_type as
        | "standard"
        | "rare"
        | "specialized",
      colorFocus: newProgram.color_focus,
      healthProtocols: newProgram.health_protocols || [],
      costRange: newProgram.cost_range || { min: 0, max: 0 },
      specialConsiderations: newProgram.special_considerations || [],
      createdAt: newProgram.created_at,
    };

    return NextResponse.json(formattedProgram);
  } catch (error) {
    console.error("Error creating breeding program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
