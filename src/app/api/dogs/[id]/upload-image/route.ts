import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
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

    // Verify that the dog belongs to the user
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .select("id, owner_id")
      .eq("id", params.id)
      .single();

    if (dogError || !dog) {
      return NextResponse.json({ error: "Dog not found" }, { status: 404 });
    }

    if (dog.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate a unique file name
    const fileName = `${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;
    const filePath = `dogs/${params.id}/${fileName}`;

    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, file);

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("profiles").getPublicUrl(filePath);

    // Update the dog's profile image in the database
    const { error: updateError } = await supabase
      .from("dogs")
      .update({
        profile_image_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update dog profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error uploading dog profile image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
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

    // Verify that the dog belongs to the user
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .select("id, owner_id, profile_image_url")
      .eq("id", params.id)
      .single();

    if (dogError || !dog) {
      return NextResponse.json({ error: "Dog not found" }, { status: 404 });
    }

    if (dog.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // If there's a profile image, delete it from storage
    if (dog.profile_image_url) {
      // Extract the path from the URL
      const path = dog.profile_image_url.split("/").slice(-2).join("/");

      if (path) {
        // Delete the file from storage
        const { error: deleteError } = await supabase.storage
          .from("profiles")
          .remove([path]);

        if (deleteError) {
          console.error(
            "Error deleting profile image from storage:",
            deleteError
          );
          // Continue anyway to update the database
        }
      }
    }

    // Update the dog's profile in the database
    const { error: updateError } = await supabase
      .from("dogs")
      .update({
        profile_image_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update dog profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing dog profile image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
