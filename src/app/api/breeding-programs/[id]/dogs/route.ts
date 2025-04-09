import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(
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
    const { dogIds } = await request.json();

    if (!Array.isArray(dogIds) || dogIds.length === 0) {
      return NextResponse.json({ error: "No dogs selected" }, { status: 400 });
    }

    // Update the dogs to associate them with the breeding program
    const { error: updateError } = await supabase
      .from("dogs")
      .update({ breeding_program_id: params.id })
      .in("id", dogIds)
      .eq("owner_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to add dogs to breeding program" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding dogs to breeding program:", error);
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
    const { dogId } = await request.json();

    if (!dogId) {
      return NextResponse.json({ error: "No dog specified" }, { status: 400 });
    }

    // Update the dog to remove it from the breeding program
    const { error: updateError } = await supabase
      .from("dogs")
      .update({ breeding_program_id: null })
      .eq("id", dogId)
      .eq("owner_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to remove dog from breeding program" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing dog from breeding program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
