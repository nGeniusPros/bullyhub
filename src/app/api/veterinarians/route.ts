00000000000000000000000000000000000import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query veterinarians for the current user
    const { data: veterinarians, error } = await supabase
      .from("veterinarians")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching veterinarians:", error);
      return NextResponse.json(
        { error: "Failed to fetch veterinarians" },
        { status: 500 }
      );
    }

    return NextResponse.json(veterinarians);
  } catch (error) {
    console.error("Error in veterinarians API:", error);
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
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate the request body
    const { veterinarianSchema, validateRequest } = await import(
      "@/lib/validation"
    );
    const validation = await validateRequest(request, veterinarianSchema);

    if (!validation.success) {
      return (validation as { success: false; error: NextResponse<unknown> }).error;
    }

    const veterinarianData = validation.data;

    // Add user_id to the veterinarian data
    (veterinarianData as any).user_id = user.id;

    // Insert the veterinarian
    const { data, error } = await supabase
      .from("veterinarians")
      .insert(veterinarianData)
      .select();

    if (error) {
      console.error("Error creating veterinarian:", error);
      return NextResponse.json(
        {
          error: "Failed to create veterinarian",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error in veterinarians API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
