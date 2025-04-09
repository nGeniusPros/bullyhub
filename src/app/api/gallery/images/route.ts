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
    const isFavorite = url.searchParams.get("isFavorite");

    // Create query
    let query = supabase
      .from("gallery_images")
      .select(
        `
        *,
        dog:dogs(id, name, breed, color)
      `
      )
      .eq("owner_id", user.id);

    // Filter by dog ID if provided
    if (dogId) {
      query = query.eq("dog_id", dogId);
    }

    // Filter by favorite status if provided
    if (isFavorite === "true") {
      query = query.eq("is_favorite", true);
    }

    // Execute query with ordering
    const { data: images, error: imagesError } = await query.order(
      "created_at",
      { ascending: false }
    );

    if (imagesError) {
      return NextResponse.json(
        { error: "Failed to fetch images" },
        { status: 500 }
      );
    }

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
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
    const imageData = await request.json();

    // Add the owner_id to the image data
    imageData.owner_id = user.id;

    // If a dog_id is provided, verify that the dog belongs to the user
    if (imageData.dog_id) {
      const { data: dog, error: dogError } = await supabase
        .from("dogs")
        .select("id")
        .eq("id", imageData.dog_id)
        .eq("owner_id", user.id)
        .single();

      if (dogError || !dog) {
        return NextResponse.json(
          { error: "Dog not found or not owned by user" },
          { status: 403 }
        );
      }
    }

    // Insert the image
    const { data: image, error: imageError } = await supabase
      .from("gallery_images")
      .insert(imageData)
      .select()
      .single();

    if (imageError) {
      return NextResponse.json(
        { error: "Failed to create image" },
        { status: 500 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error creating image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
