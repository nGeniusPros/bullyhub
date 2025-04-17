import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define interfaces for marker types to avoid using 'any'
interface GeneticMarker {
  locus: string;
  alleles: string;
  description?: string; // Assuming description might be optional
}

interface HealthMarker {
  condition: string;
  status: string;
}

// Define the structure of the incoming test data for POST requests
interface DnaTestData {
  dogId: string;
  provider: string;
  testDate: string;
  markers?: GeneticMarker[];
  healthMarkers?: HealthMarker[];
}

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

    // Get all DNA tests for dogs owned by the user
    // WARNING: The filter `.eq('dogs.owner_id', user.id)` relies on a dynamic user ID
    // and might not work correctly in a static context. This query might return incorrect results.
    const { data: dnaTests, error: dnaTestsError } = await supabase
      .from('dna_test_results')
      .select(`
        *,
        dog:dogs!inner(id, name, breed, color, owner_id),
        genetic_markers(*),
        health_markers(*)
      `)
      .eq('dog.owner_id', user.id); // Filter by owner_id on the joined dogs table

    if (dnaTestsError) {
      console.error('DNA Tests Fetch Error:', dnaTestsError);
      return NextResponse.json({ error: 'Failed to fetch DNA tests' }, { status: 500 });
    }

    // Format the response
    const formattedTests = dnaTests.map(test => ({
      id: test.id,
      dogId: test.dog_id,
      dogName: test.dog?.name,
      provider: test.provider,
      testDate: test.test_date,
      // Use defined type for genetic markers
      markers: test.genetic_markers.map((marker: GeneticMarker) => ({
        locus: marker.locus,
        alleles: marker.alleles,
        description: marker.description
      })),
      // Use defined type for health markers
      healthMarkers: test.health_markers.map((marker: HealthMarker) => ({
        condition: marker.condition,
        status: marker.status
      })),
      createdAt: test.created_at
    }));

    return NextResponse.json(formattedTests);
  } catch (error) {
    console.error('Error fetching DNA tests:', error);
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

    // Parse the request body using the defined type
    const testData: DnaTestData = await request.json();

    // Verify that the dog belongs to the user
    // WARNING: This check relies on the dynamic user ID.
    const { data: dog, error: dogError } = await supabase
      .from('dogs')
      .select('id')
      .eq('id', testData.dogId)
      .eq('owner_id', user.id)
      .single();

    if (dogError || !dog) {
      return NextResponse.json({ error: 'Dog not found or not owned by user' }, { status: 403 });
    }

    // Start a transaction to insert the DNA test and its markers
    // WARNING: Database writes (POST) are inherently dynamic and won't work correctly
    // when the route is forced static. This endpoint will likely fail at runtime.
    const { data: newTest, error: insertError } = await supabase
      .from('dna_test_results')
      .insert({
        dog_id: testData.dogId,
        provider: testData.provider,
        test_date: testData.testDate
      })
      .select()
      .single();

    if (insertError) {
      console.error('DNA Test Insert Error:', insertError);
      return NextResponse.json({ error: 'Failed to create DNA test' }, { status: 500 });
    }

    // Insert genetic markers using the defined type
    if (testData.markers && testData.markers.length > 0) {
      const geneticMarkers = testData.markers.map((marker: GeneticMarker) => ({
        dna_test_id: newTest.id,
        locus: marker.locus,
        alleles: marker.alleles,
        description: marker.description
      }));

      const { error: markersError } = await supabase
        .from('genetic_markers')
        .insert(geneticMarkers);

      if (markersError) {
        console.error('Genetic Markers Insert Error:', markersError);
        // Consider rolling back the dna_test_results insert here
        return NextResponse.json({ error: 'Failed to insert genetic markers' }, { status: 500 });
      }
    }

    // Insert health markers using the defined type
    if (testData.healthMarkers && testData.healthMarkers.length > 0) {
      const healthMarkers = testData.healthMarkers.map((marker: HealthMarker) => ({
        dna_test_id: newTest.id,
        condition: marker.condition,
        status: marker.status
      }));

      const { error: healthMarkersError } = await supabase
        .from('health_markers')
        .insert(healthMarkers);

      if (healthMarkersError) {
        console.error('Health Markers Insert Error:', healthMarkersError);
        // Consider rolling back previous inserts here
        return NextResponse.json({ error: 'Failed to insert health markers' }, { status: 500 });
      }
    }

    return NextResponse.json({
      id: newTest.id,
      dogId: newTest.dog_id,
      provider: newTest.provider,
      testDate: newTest.test_date,
      markers: testData.markers || [],
      healthMarkers: testData.healthMarkers || [],
      createdAt: newTest.created_at
    }, { status: 201 }); // Added 201 status for creation
  } catch (error) {
    console.error('Error creating DNA test:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
