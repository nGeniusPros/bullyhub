import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

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

    // Verify that the collection belongs to the user
    const { data: collection, error: collectionError } = await supabase
      .from("gallery_collections")
      .select("id")
      .eq("id", params.id)
      .eq("owner_id", user.id)
      .single();

    if (collectionError || !collection) {
      return NextResponse.json(
        { error: "Collection not found or not owned by user" },
        { status: 403 }
      );
    }

    // Get all images in the collection
    const { data: images, error: imagesError } = await supabase
      .from("gallery_collection_images")
      .select(
        `
        image_id,
        image:gallery_images(*)
      `
      )
      .eq("collection_id", params.id);

    if (imagesError) {
      return NextResponse.json(
        { error: "Failed to fetch collection images" },
        { status: 500 }
      );
    }

    // Format the response
    const formattedImages = images.map((item) => item.image);

    return NextResponse.json(formattedImages);
  } catch (error) {
    console.error("Error fetching collection images:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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

    // Parse the request body
    const { image_ids } = await request.json();

    if (!image_ids || !Array.isArray(image_ids) || image_ids.length === 0) {
      return NextResponse.json(
        { error: "No image IDs provided" },
        { status: 400 }
      );
    }

    // Verify that the collection belongs to the user
    const { data: collection, error: collectionError } = await supabase
      .from("gallery_collections")
      .select("id")
      .eq("id", params.id)
      .eq("owner_id", user.id)
      .single();

    if (collectionError || !collection) {
      return NextResponse.json(
        { error: "Collection not found or not owned by user" },
        { status: 403 }
      );
    }

    // Verify that all images belong to the user
    const { data: images, error: imagesError } = await supabase
      .from("gallery_images")
      .select("id")
      .in("id", image_ids)
      .eq("owner_id", user.id);

    if (imagesError) {
      return NextResponse.json(
        { error: "Failed to verify image ownership" },
        { status: 500 }
      );
    }

    if (images.length !== image_ids.length) {
      return NextResponse.json(
        { error: "One or more images not found or not owned by user" },
        { status: 403 }
      );
    }

    // Prepare the data for insertion
    const collectionImages = image_ids.map((image_id) => ({
      collection_id: params.id,
      image_id,
    }));

    // Insert the collection images
    const { data: result, error: insertError } = await supabase
      .from("gallery_collection_images")
      .upsert(collectionImages, { onConflict: "collection_id,image_id" })
      .select();

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to add images to collection" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, added: result.length });
  } catch (error) {
    console.error("Error adding images to collection:", error);
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

    // Parse the request body
    const { image_id } = await request.json();

    if (!image_id) {
      return NextResponse.json(
        { error: "No image ID provided" },
        { status: 400 }
      );
    }

    // Verify that the collection belongs to the user
    const { data: collection, error: collectionError } = await supabase
      .from("gallery_collections")
      .select("id")
      .eq("id", params.id)
      .eq("owner_id", user.id)
      .single();

    if (collectionError || !collection) {
      return NextResponse.json(
        { error: "Collection not found or not owned by user" },
        { status: 403 }
      );
    }

    // Delete the image from the collection
    const { error: deleteError } = await supabase
      .from("gallery_collection_images")
      .delete()
      .eq("collection_id", params.id)
      .eq("image_id", image_id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to remove image from collection" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing image from collection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
