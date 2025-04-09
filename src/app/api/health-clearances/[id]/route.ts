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

    // Get the health clearance with its related data
    const { data: healthClearance, error: healthClearanceError } =
      await supabase
        .from("health_clearances")
        .select(
          `
        *,
        dog:dogs(id, name, breed, color, owner_id)
      `
        )
        .eq("id", params.id)
        .single();

    if (healthClearanceError) {
      return NextResponse.json(
        { error: "Health clearance not found" },
        { status: 404 }
      );
    }

    // Verify that the dog belongs to the user
    if (healthClearance.dog[0].owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Format the response
    const formattedClearance = {
      id: healthClearance.id,
      dogId: healthClearance.dog_id,
      dogName: healthClearance.dog.name,
      dogBreed: healthClearance.dog.breed,
      dogColor: healthClearance.dog.color,
      test: healthClearance.test,
      date: healthClearance.date,
      result: healthClearance.result,
      status: healthClearance.status,
      expiryDate: healthClearance.expiry_date,
      verificationNumber: healthClearance.verification_number,
      notes: healthClearance.notes,
      documents: healthClearance.documents,
      createdAt: healthClearance.created_at,
    };

    return NextResponse.json(formattedClearance);
  } catch (error) {
    console.error("Error fetching health clearance:", error);
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
    const clearanceData = await request.json();

    // Get the health clearance to verify ownership
    const { data: healthClearance, error: healthClearanceError } =
      await supabase
        .from("health_clearances")
        .select(
          `
        dog_id,
        dog:dogs(owner_id)
      `
        )
        .eq("id", params.id)
        .single();

    if (healthClearanceError) {
      return NextResponse.json(
        { error: "Health clearance not found" },
        { status: 404 }
      );
    }

    // Verify that the dog belongs to the user
    if (healthClearance.dog[0].owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update the health clearance
    const { data: updatedClearance, error: updateError } = await supabase
      .from("health_clearances")
      .update({
        test: clearanceData.test,
        date: clearanceData.date,
        result: clearanceData.result,
        status: clearanceData.status,
        expiry_date: clearanceData.expiryDate,
        verification_number: clearanceData.verificationNumber,
        notes: clearanceData.notes,
        documents: clearanceData.documents,
      })
      .eq("id", params.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update health clearance" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: updatedClearance.id,
      dogId: updatedClearance.dog_id,
      test: updatedClearance.test,
      date: updatedClearance.date,
      result: updatedClearance.result,
      status: updatedClearance.status,
      expiryDate: updatedClearance.expiry_date,
      verificationNumber: updatedClearance.verification_number,
      notes: updatedClearance.notes,
      documents: updatedClearance.documents,
      createdAt: updatedClearance.created_at,
    });
  } catch (error) {
    console.error("Error updating health clearance:", error);
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

    // Get the health clearance to verify ownership
    const { data: healthClearance, error: healthClearanceError } =
      await supabase
        .from("health_clearances")
        .select(
          `
        dog_id,
        dog:dogs(owner_id)
      `
        )
        .eq("id", params.id)
        .single();

    if (healthClearanceError) {
      return NextResponse.json(
        { error: "Health clearance not found" },
        { status: 404 }
      );
    }

    // Verify that the dog belongs to the user
    if (healthClearance.dog[0].owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the health clearance
    const { error: deleteError } = await supabase
      .from("health_clearances")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete health clearance" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting health clearance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
