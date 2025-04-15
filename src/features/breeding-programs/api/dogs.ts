// Breeding Programs Feature - Dogs API Handler
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { breedingProgramQueries } from "../data/queries";

/**
 * Add dogs to a breeding program
 */
export async function addDogsToProgram(
  request: NextRequest,
  programId: string
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

    // Parse the request body
    const { dogIds } = await request.json();

    if (!Array.isArray(dogIds) || dogIds.length === 0) {
      return NextResponse.json({ error: "No dogs selected" }, { status: 400 });
    }

    // Add dogs to the breeding program
    await breedingProgramQueries.addDogsToProgram(programId, dogIds, user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error adding dogs to breeding program:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

/**
 * Remove a dog from a breeding program
 */
export async function removeDogFromProgram(
  request: NextRequest,
  programId: string
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

    // Parse the request body
    const { dogId } = await request.json();

    if (!dogId) {
      return NextResponse.json({ error: "No dog specified" }, { status: 400 });
    }

    // Remove the dog from the breeding program
    await breedingProgramQueries.removeDogFromProgram(programId, dogId, user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error removing dog from breeding program:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
