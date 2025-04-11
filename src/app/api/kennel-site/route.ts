import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the subdomain from the request headers (set by middleware)
    const subdomain = request.headers.get("x-subdomain");
    
    if (!subdomain) {
      return NextResponse.json(
        { error: "No subdomain provided" },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Query the database for the kennel website data
    const { data: kennelWebsite, error } = await supabase
      .from("kennel_websites")
      .select(`
        *,
        breeder:breeder_id(
          id,
          first_name,
          last_name
        )
      `)
      .eq("site_name", subdomain)
      .single();

    if (error) {
      console.error("Error fetching kennel website:", error);
      return NextResponse.json(
        { error: "Failed to fetch kennel website data" },
        { status: 500 }
      );
    }

    if (!kennelWebsite) {
      return NextResponse.json(
        { error: "Kennel website not found" },
        { status: 404 }
      );
    }

    // If the website is not published, return a 404
    if (!kennelWebsite.published) {
      return NextResponse.json(
        { error: "Kennel website not published" },
        { status: 404 }
      );
    }

    // Fetch additional data needed for the template
    const breederId = kennelWebsite.breeder_id;

    // Fetch dogs owned by the breeder
    const { data: dogs, error: dogsError } = await supabase
      .from("dogs")
      .select("*")
      .eq("owner_id", breederId);

    if (dogsError) {
      console.error("Error fetching dogs:", dogsError);
    }

    // Fetch stud dogs
    const { data: studDogs, error: studDogsError } = await supabase
      .from("dogs")
      .select("*")
      .eq("owner_id", breederId)
      .eq("is_stud", true);

    if (studDogsError) {
      console.error("Error fetching stud dogs:", studDogsError);
    }

    // Fetch litters
    const { data: litters, error: littersError } = await supabase
      .from("litters")
      .select("*")
      .eq("breeder_id", breederId);

    if (littersError) {
      console.error("Error fetching litters:", littersError);
    }

    // Return the kennel website data and related data
    return NextResponse.json({
      kennelWebsite,
      dogs: dogs || [],
      studDogs: studDogs || [],
      litters: litters || [],
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
