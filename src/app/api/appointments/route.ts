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
    const status = url.searchParams.get("status");

    // Create query
    let query = supabase
      .from("appointments")
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

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status);
    }

    // Execute query with ordering
    const { data: appointments, error: appointmentsError } = await query.order(
      "date",
      { ascending: true }
    );

    if (appointmentsError) {
      return NextResponse.json(
        { error: "Failed to fetch appointments" },
        { status: 500 }
      );
    }

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
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

    // Validate the request body
    const { appointmentSchema, validateRequest } = await import(
      "@/lib/validation"
    );
    const validation = await validateRequest(request, appointmentSchema);

    if (!validation.success) {
      return (validation as { success: false; error: NextResponse<unknown> }).error;
    }

    const appointmentData = validation.data;

    // Verify that the dog belongs to the user
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .select("id")
      .eq("id", appointmentData.dog_id)
      .eq("owner_id", user.id)
      .single();

    if (dogError || !dog) {
      return NextResponse.json(
        { error: "Dog not found or not owned by user" },
        { status: 403 }
      );
    }

    // If veterinarian_id is provided, verify it exists
    if (appointmentData.veterinarian_id) {
      const { data: vet, error: vetError } = await supabase
        .from("veterinarians")
        .select("id")
        .eq("id", appointmentData.veterinarian_id)
        .single();

      if (vetError || !vet) {
        return NextResponse.json(
          { error: "Veterinarian not found" },
          { status: 404 }
        );
      }
    }

    // Insert the appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert(appointmentData)
      .select()
      .single();

    if (appointmentError) {
      console.error("Error creating appointment:", appointmentError);
      return NextResponse.json(
        {
          error: "Failed to create appointment",
          details: appointmentError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
