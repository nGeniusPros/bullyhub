import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
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

    // Get the dog with its related data
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .select(
        `
        *,
        breeding_program:breeding_programs(id, name)
      `
      )
      .eq("id", params.id)
      .single();

    if (dogError) {
      return NextResponse.json({ error: "Dog not found" }, { status: 404 });
    }

    // Verify that the dog belongs to the user
    if (dog.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Format the response
    const formattedDog = {
      id: dog.id,
      name: dog.name,
      breed: dog.breed,
      dateOfBirth: dog.date_of_birth,
      color: dog.color,
      ownerId: dog.owner_id,
      isStud: dog.is_stud,
      profileImageUrl: dog.profile_image_url,
      weight: dog.weight,
      height: dog.height,
      microchipNumber: dog.microchip_number,
      registrationNumber: dog.registration_number,
      breeding_program_id: dog.breeding_program_id,
      breeding_program_name: dog.breeding_program?.name,
      createdAt: dog.created_at,
    };

    return NextResponse.json(formattedDog);
  } catch (error) {
    console.error("Error fetching dog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
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
    const dogData = await request.json();

    // Get the dog to verify ownership
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .select("owner_id")
      .eq("id", params.id)
      .single();

    if (dogError) {
      return NextResponse.json({ error: "Dog not found" }, { status: 404 });
    }

    // Verify that the dog belongs to the user
    if (dog.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update the dog
    const { data: updatedDog, error: updateError } = await supabase
      .from("dogs")
      .update({
        name: dogData.name,
        breed: dogData.breed,
        date_of_birth: dogData.dateOfBirth,
        color: dogData.color,
        is_stud: dogData.isStud || false,
        breeding_program_id: dogData.breedingProgramId || null,
      })
      .eq("id", params.id)
      .select(
        `
        *,
        breeding_program:breeding_programs(id, name)
      `
      )
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update dog" },
        { status: 500 }
      );
    }

    // Format the response
    const formattedDog = {
      id: updatedDog.id,
      name: updatedDog.name,
      breed: updatedDog.breed,
      dateOfBirth: updatedDog.date_of_birth,
      color: updatedDog.color,
      ownerId: updatedDog.owner_id,
      isStud: updatedDog.is_stud,
      breeding_program_id: updatedDog.breeding_program_id,
      breeding_program_name: updatedDog.breeding_program?.name,
      createdAt: updatedDog.created_at,
    };

    return NextResponse.json(formattedDog);
  } catch (error) {
    console.error("Error updating dog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
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

    // Get the dog to verify ownership
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .select("owner_id")
      .eq("id", params.id)
      .single();

    if (dogError) {
      return NextResponse.json({ error: "Dog not found" }, { status: 404 });
    }

    // Verify that the dog belongs to the user
    if (dog.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the dog
    const { error: deleteError } = await supabase
      .from("dogs")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete dog" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting dog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
