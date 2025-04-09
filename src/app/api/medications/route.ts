import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

    // Get URL parameters
    const url = new URL(request.url);
    const dogId = url.searchParams.get("dogId");

    // Create query
    let query = supabase
      .from("medications")
      .select(
        `
        *,
        dog:dogs(id, name, breed, color)
      `
      )
      .eq("dogs.owner_id", user.id);

    // Filter by dog ID if provided
    if (dogId) {
      query = query.eq("dog_id", dogId);
    }

    // Execute query with ordering
    const { data: medications, error: medicationsError } = await query.order(
      "start_date",
      { ascending: false }
    );

    if (medicationsError) {
      return NextResponse.json(
        { error: "Failed to fetch medications" },
        { status: 500 }
      );
    }

    return NextResponse.json(medications);
  } catch (error) {
    console.error("Error fetching medications:", error);
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

    // Parse the request body
    const medicationData = await request.json();

    // Verify that the dog belongs to the user
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .select("id")
      .eq("id", medicationData.dog_id)
      .eq("owner_id", user.id)
      .single();

    if (dogError || !dog) {
      return NextResponse.json(
        { error: "Dog not found or not owned by user" },
        { status: 403 }
      );
    }

    // Insert the medication
    const { data: medication, error: medicationError } = await supabase
      .from("medications")
      .insert(medicationData)
      .select()
      .single();

    if (medicationError) {
      return NextResponse.json(
        { error: "Failed to create medication" },
        { status: 500 }
      );
    }

    return NextResponse.json(medication);
  } catch (error) {
    console.error("Error creating medication:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
