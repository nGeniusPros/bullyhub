import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { BreedingProgram } from "@/types";

// Mock data for development
const mockBreedingProgramDetails = {
  "1": {
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
    dogs: [
      {
        id: "d1",
        name: "Zeus",
        breed: "French Bulldog",
        color: "Blue",
        date_of_birth: "2021-05-15",
      },
      {
        id: "d2",
        name: "Luna",
        breed: "French Bulldog",
        color: "Blue",
        date_of_birth: "2021-08-22",
      },
    ],
    litters: [
      {
        id: "l1",
        whelping_date: "2023-02-10",
        puppy_count: 4,
        sire: {
          id: "d1",
          name: "Zeus",
          color: "Blue",
        },
        dam: {
          id: "d2",
          name: "Luna",
          color: "Blue",
        },
        puppies: [
          {
            id: "p1",
            name: "Blue Boy",
            color: "Blue",
            gender: "Male",
          },
          {
            id: "p2",
            name: "Sky",
            color: "Blue",
            gender: "Female",
          },
        ],
      },
    ],
    createdAt: "2023-08-15T00:00:00.000Z",
  },
  "2": {
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
    dogs: [
      {
        id: "d3",
        name: "Max",
        breed: "French Bulldog",
        color: "Brindle",
        date_of_birth: "2020-11-05",
      },
      {
        id: "d4",
        name: "Bella",
        breed: "French Bulldog",
        color: "Brindle",
        date_of_birth: "2021-03-12",
      },
    ],
    litters: [],
    createdAt: "2023-06-10T00:00:00.000Z",
  },
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Get the breeding program
    const { data: program, error: programError } = await supabase
      .from("breeding_programs")
      .select(
        `
        *,
        dogs:dogs(id, name, breed, color, date_of_birth),
        litters:litters(
          id,
          whelping_date,
          puppy_count,
          sire:dogs!litters_sire_id_fkey(id, name, color),
          dam:dogs!litters_dam_id_fkey(id, name, color),
          puppies:puppies(id, name, color, gender)
        )
      `
      )
      .eq("id", params.id)
      .single();

    if (programError) {
      return NextResponse.json(
        { error: "Breeding program not found" },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the breeding program
    if (program.breeder_id !== user.id) {
      return NextResponse.json(
        { error: "You do not have permission to view this breeding program" },
        { status: 403 }
      );
    }

    // Format the response
    const formattedProgram: any = {
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
      dogs: program.dogs || [],
      litters: program.litters || [],
      createdAt: program.created_at,
    };

    return NextResponse.json(formattedProgram);
  } catch (error) {
    console.error("Error fetching breeding program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Get the breeding program to check ownership
    const { data: program, error: programError } = await supabase
      .from("breeding_programs")
      .select("breeder_id")
      .eq("id", params.id)
      .single();

    if (programError) {
      return NextResponse.json(
        { error: "Breeding program not found" },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the breeding program
    if (program.breeder_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse the request body
    const updateData = await request.json();

    // Update the breeding program
    const { data: updatedProgram, error: updateError } = await supabase
      .from("breeding_programs")
      .update({
        name: updateData.name,
        description: updateData.description,
        goals: updateData.goals,
        program_type: updateData.programType,
        color_focus: updateData.colorFocus,
        health_protocols: updateData.healthProtocols,
        cost_range: updateData.costRange,
        special_considerations: updateData.specialConsiderations,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update breeding program" },
        { status: 500 }
      );
    }

    // Format the response
    const formattedProgram: BreedingProgram = {
      id: updatedProgram.id,
      breederId: updatedProgram.breeder_id,
      name: updatedProgram.name,
      description: updatedProgram.description,
      goals: updatedProgram.goals || [],
      programType: updatedProgram.program_type as
        | "standard"
        | "rare"
        | "specialized",
      colorFocus: updatedProgram.color_focus,
      healthProtocols: updatedProgram.health_protocols || [],
      costRange: updatedProgram.cost_range || { min: 0, max: 0 },
      specialConsiderations: updatedProgram.special_considerations || [],
      createdAt: updatedProgram.created_at,
    };

    return NextResponse.json(formattedProgram);
  } catch (error) {
    console.error("Error updating breeding program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Get the breeding program to check ownership
    const { data: program, error: programError } = await supabase
      .from("breeding_programs")
      .select("breeder_id")
      .eq("id", params.id)
      .single();

    if (programError) {
      return NextResponse.json(
        { error: "Breeding program not found" },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the breeding program
    if (program.breeder_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the breeding program
    const { error: deleteError } = await supabase
      .from("breeding_programs")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete breeding program" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting breeding program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
