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
      .from("health_records")
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
    const { data: healthRecords, error: healthRecordsError } =
      await query.order("record_date", { ascending: false });

    if (healthRecordsError) {
      return NextResponse.json(
        { error: "Failed to fetch health records" },
        { status: 500 }
      );
    }

    return NextResponse.json(healthRecords);
  } catch (error) {
    console.error("Error fetching health records:", error);
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
    const healthRecordData = await request.json();

    // Verify that the dog belongs to the user
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .select("id")
      .eq("id", healthRecordData.dog_id)
      .eq("owner_id", user.id)
      .single();

    if (dogError || !dog) {
      return NextResponse.json(
        { error: "Dog not found or not owned by user" },
        { status: 403 }
      );
    }

    // Insert the health record
    const { data: healthRecord, error: healthRecordError } = await supabase
      .from("health_records")
      .insert(healthRecordData)
      .select()
      .single();

    if (healthRecordError) {
      return NextResponse.json(
        { error: "Failed to create health record" },
        { status: 500 }
      );
    }

    return NextResponse.json(healthRecord);
  } catch (error) {
    console.error("Error creating health record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
