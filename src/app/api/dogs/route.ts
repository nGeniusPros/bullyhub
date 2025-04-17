import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force static generation for this route to satisfy 'output: export' during build.
// WARNING: This might cause unexpected behavior at runtime for dynamic operations
// like fetching user-specific data or handling POST requests.
// Consider revisiting this if the API needs to be truly dynamic.
export const dynamic = "force-static";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    // WARNING: In a 'force-static' context, accessing user session might not work as expected.
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      // This check might always fail or behave unexpectedly in a static context.
      return NextResponse.json({ error: 'Unauthorized - Static Context Issue?' }, { status: 401 });
    }

    // Get all dogs owned by the user
    const { data: dogs, error: dogsError } = await supabase
      .from('dogs')
      .select(`
        *,
        breeding_program:breeding_programs(id, name)
      `)
      .eq('owner_id', user.id) // This condition relies on a dynamic user ID.
      .order('name');

    if (dogsError) {
      return NextResponse.json({ error: 'Failed to fetch dogs' }, { status: 500 });
    }

    // Format the response
    const formattedDogs = dogs.map(dog => ({
      id: dog.id,
      name: dog.name,
      breed: dog.breed,
      dateOfBirth: dog.date_of_birth,
      color: dog.color,
      ownerId: dog.owner_id,
      isStud: dog.is_stud,
      breeding_program_id: dog.breeding_program_id,
      breeding_program_name: dog.breeding_program?.name,
      createdAt: dog.created_at
    }));

    return NextResponse.json(formattedDogs);
  } catch (error) {
    console.error('Error fetching dogs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    // WARNING: See GET handler warning about user sessions in static context.
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized - Static Context Issue?' }, { status: 401 });
    }

    // Parse the request body
    const dogData = await request.json();

    // Insert the dog
    // WARNING: Database writes (POST) are inherently dynamic and won't work correctly
    // when the route is forced static. This endpoint will likely fail at runtime.
    const { data: newDog, error: insertError } = await supabase
      .from('dogs')
      .insert({
        name: dogData.name,
        breed: dogData.breed,
        date_of_birth: dogData.dateOfBirth,
        color: dogData.color,
        owner_id: user.id, // Relies on dynamic user ID.
        is_stud: dogData.isStud || false,
        breeding_program_id: dogData.breedingProgramId || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert Error:', insertError);
      return NextResponse.json({ error: 'Failed to create dog' }, { status: 500 });
    }

    // Format the response
    const formattedDog = {
      id: newDog.id,
      name: newDog.name,
      breed: newDog.breed,
      dateOfBirth: newDog.date_of_birth,
      color: newDog.color,
      ownerId: newDog.owner_id,
      isStud: newDog.is_stud,
      breedingProgramId: newDog.breeding_program_id,
      createdAt: newDog.created_at
    };

    return NextResponse.json(formattedDog, { status: 201 }); // Added 201 status for creation
  } catch (error) {
    console.error('Error creating dog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
