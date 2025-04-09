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
    
    // Get all health clearances for dogs owned by the user
    const { data: healthClearances, error: healthClearancesError } = await supabase
      .from('health_clearances')
      .select(`
        *,
        dog:dogs(id, name, breed, color)
      `)
      .eq('dogs.owner_id', user.id);
    
    if (healthClearancesError) {
      return NextResponse.json({ error: 'Failed to fetch health clearances' }, { status: 500 });
    }
    
    // Format the response
    const formattedClearances = healthClearances.map(clearance => ({
      id: clearance.id,
      dogId: clearance.dog_id,
      dogName: clearance.dog?.name,
      test: clearance.test,
      date: clearance.date,
      result: clearance.result,
      status: clearance.status,
      expiryDate: clearance.expiry_date,
      verificationNumber: clearance.verification_number,
      notes: clearance.notes,
      documents: clearance.documents,
      createdAt: clearance.created_at
    }));
    
    return NextResponse.json(formattedClearances);
  } catch (error) {
    console.error('Error fetching health clearances:', error);
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
    const clearanceData = await request.json();
    
    // Verify that the dog belongs to the user
    const { data: dog, error: dogError } = await supabase
      .from('dogs')
      .select('id')
      .eq('id', clearanceData.dogId)
      .eq('owner_id', user.id)
      .single();
    
    if (dogError || !dog) {
      return NextResponse.json({ error: 'Dog not found or not owned by user' }, { status: 403 });
    }
    
    // Insert the health clearance
    const { data: newClearance, error: insertError } = await supabase
      .from('health_clearances')
      .insert({
        dog_id: clearanceData.dogId,
        test: clearanceData.test,
        date: clearanceData.date,
        result: clearanceData.result,
        status: clearanceData.status,
        expiry_date: clearanceData.expiryDate,
        verification_number: clearanceData.verificationNumber,
        notes: clearanceData.notes,
        documents: clearanceData.documents
      })
      .select()
      .single();
    
    if (insertError) {
      return NextResponse.json({ error: 'Failed to create health clearance' }, { status: 500 });
    }
    
    return NextResponse.json({
      id: newClearance.id,
      dogId: newClearance.dog_id,
      test: newClearance.test,
      date: newClearance.date,
      result: newClearance.result,
      status: newClearance.status,
      expiryDate: newClearance.expiry_date,
      verificationNumber: newClearance.verification_number,
      notes: newClearance.notes,
      documents: newClearance.documents,
      createdAt: newClearance.created_at
    });
  } catch (error) {
    console.error('Error creating health clearance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
