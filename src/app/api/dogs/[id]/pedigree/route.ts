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

    // Get the dog to verify ownership
    const { data: dog, error: dogError } = await supabase
      .from("dogs")
      .select("*, owner_id")
      .eq("id", params.id)
      .single();

    if (dogError) {
      return NextResponse.json({ error: "Dog not found" }, { status: 404 });
    }

    // Verify that the dog belongs to the user
    if (dog.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch the dog's pedigree data from the database
    // First, get the dog's parents
    const { data: parents, error: parentsError } = await supabase
      .from("dog_relationships")
      .select("parent_id, relationship_type")
      .eq("child_id", params.id);

    if (parentsError) {
      console.error("Error fetching parents:", parentsError);
      return NextResponse.json(
        { error: "Failed to fetch pedigree data" },
        { status: 500 }
      );
    }

    // Initialize pedigree object with the dog's data
    const pedigree = {
      dog: {
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
        color: dog.color,
        dateOfBirth: dog.date_of_birth,
        registrationNumber: dog.registration_number || null,
        image: dog.image_url || null,
      },
      sire: null,
      dam: null,
    };

    // Process parents
    for (const parent of parents) {
      // Get parent details
      const { data: parentDog, error: parentError } = await supabase
        .from("dogs")
        .select("*")
        .eq("id", parent.parent_id)
        .single();

      if (parentError) {
        console.error(
          `Error fetching ${parent.relationship_type}:`,
          parentError
        );
        continue;
      }

      // Format parent data
      const parentData = {
        id: parentDog.id,
        name: parentDog.name,
        breed: parentDog.breed,
        color: parentDog.color,
        dateOfBirth: parentDog.date_of_birth,
        registrationNumber: parentDog.registration_number || null,
        image: parentDog.image_url || null,
      };

      // Add to pedigree based on relationship type
      if (parent.relationship_type === "sire") {
        pedigree.sire = parentData;

        // Get grandparents (sire's parents)
        await fetchGrandparents(supabase, parentDog.id, pedigree.sire);
      } else if (parent.relationship_type === "dam") {
        pedigree.dam = parentData;

        // Get grandparents (dam's parents)
        await fetchGrandparents(supabase, parentDog.id, pedigree.dam);
      }
    }

    // If no real pedigree data is found, use placeholder data
    if (!pedigree.sire && !pedigree.dam) {
      // Add a note that this is placeholder data
      (pedigree as any).isPlaceholder = true;
    }

    return NextResponse.json(pedigree);
  } catch (error) {
    console.error("Error fetching pedigree:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to fetch grandparents
async function fetchGrandparents(supabase, parentId, parentObj) {
  try {
    const { data: grandparents, error: grandparentsError } = await supabase
      .from("dog_relationships")
      .select("parent_id, relationship_type")
      .eq("child_id", parentId);

    if (grandparentsError || !grandparents || grandparents.length === 0) {
      return;
    }

    for (const grandparent of grandparents) {
      const { data: grandparentDog, error: grandparentError } = await supabase
        .from("dogs")
        .select("*")
        .eq("id", grandparent.parent_id)
        .single();

      if (grandparentError) {
        console.error("Error fetching grandparent:", grandparentError);
        continue;
      }

      const grandparentData = {
        id: grandparentDog.id,
        name: grandparentDog.name,
        breed: grandparentDog.breed,
        color: grandparentDog.color,
        dateOfBirth: grandparentDog.date_of_birth,
        registrationNumber: grandparentDog.registration_number || null,
        image: grandparentDog.image_url || null,
      };

      if (grandparent.relationship_type === "sire") {
        parentObj.sire = grandparentData;
      } else if (grandparent.relationship_type === "dam") {
        parentObj.dam = grandparentData;
      }
    }
  } catch (error) {
    console.error("Error fetching grandparents:", error);
  }
}
