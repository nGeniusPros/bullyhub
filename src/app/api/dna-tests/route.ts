import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get all DNA tests for dogs owned by the user
    const { data: dnaTests, error: dnaTestsError } = await supabase
      .from('dna_test_results')
      .select(`
        *,
        dog:dogs(id, name, breed, color),
        genetic_markers(*),
        health_markers(*)
      `)
      .eq('dogs.owner_id', user.id);
    
    if (dnaTestsError) {
      return NextResponse.json({ error: 'Failed to fetch DNA tests' }, { status: 500 });
    }
    
    // Format the response
    const formattedTests = dnaTests.map(test => ({
      id: test.id,
      dogId: test.dog_id,
      dogName: test.dog?.name,
      provider: test.provider,
      testDate: test.test_date,
      markers: test.genetic_markers.map((marker: any) => ({
        locus: marker.locus,
        alleles: marker.alleles,
        description: marker.description
      })),
      healthMarkers: test.health_markers.map((marker: any) => ({
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

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body
    const testData = await request.json();
    
    // Verify that the dog belongs to the user
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
      return NextResponse.json({ error: 'Failed to create DNA test' }, { status: 500 });
    }
    
    // Insert genetic markers
    if (testData.markers && testData.markers.length > 0) {
      const geneticMarkers = testData.markers.map((marker: any) => ({
        dna_test_id: newTest.id,
        locus: marker.locus,
        alleles: marker.alleles,
        description: marker.description
      }));
      
      const { error: markersError } = await supabase
        .from('genetic_markers')
        .insert(geneticMarkers);
      
      if (markersError) {
        return NextResponse.json({ error: 'Failed to insert genetic markers' }, { status: 500 });
      }
    }
    
    // Insert health markers
    if (testData.healthMarkers && testData.healthMarkers.length > 0) {
      const healthMarkers = testData.healthMarkers.map((marker: any) => ({
        dna_test_id: newTest.id,
        condition: marker.condition,
        status: marker.status
      }));
      
      const { error: healthMarkersError } = await supabase
        .from('health_markers')
        .insert(healthMarkers);
      
      if (healthMarkersError) {
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
    });
  } catch (error) {
    console.error('Error creating DNA test:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
