import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the medication with its related data
    const { data: medication, error: medicationError } = await supabase
      .from('medications')
      .select(`
        *,
        dog:dogs(id, name, breed, color, owner_id)
      `)
      .eq('id', params.id)
      .single();
    
    if (medicationError) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }
    
    // Verify that the dog belongs to the user
    if (medication.dog[0].owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    return NextResponse.json(medication);
  } catch (error) {
    console.error('Error fetching medication:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body
    const medicationData = await request.json();
    
    // Get the medication to verify ownership
    const { data: medication, error: medicationError } = await supabase
      .from('medications')
      .select(`
        dog_id,
        dog:dogs(owner_id)
      `)
      .eq('id', params.id)
      .single();
    
    if (medicationError) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }
    
    // Verify that the dog belongs to the user
    if (medication.dog[0].owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // If the dog_id is being changed, verify that the new dog also belongs to the user
    if (medicationData.dog_id && medicationData.dog_id !== medication.dog_id) {
      const { data: newDog, error: newDogError } = await supabase
        .from('dogs')
        .select('id')
        .eq('id', medicationData.dog_id)
        .eq('owner_id', user.id)
        .single();
      
      if (newDogError || !newDog) {
        return NextResponse.json({ error: 'New dog not found or not owned by user' }, { status: 403 });
      }
    }
    
    // Update the medication
    const { data: updatedMedication, error: updateError } = await supabase
      .from('medications')
      .update(medicationData)
      .eq('id', params.id)
      .select()
      .single();
    
    if (updateError) {
      return NextResponse.json({ error: 'Failed to update medication' }, { status: 500 });
    }
    
    return NextResponse.json(updatedMedication);
  } catch (error) {
    console.error('Error updating medication:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the medication to verify ownership
    const { data: medication, error: medicationError } = await supabase
      .from('medications')
      .select(`
        dog_id,
        dog:dogs(owner_id)
      `)
      .eq('id', params.id)
      .single();
    
    if (medicationError) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }
    
    // Verify that the dog belongs to the user
    if (medication.dog[0].owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Delete the medication
    const { error: deleteError } = await supabase
      .from('medications')
      .delete()
      .eq('id', params.id);
    
    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete medication' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting medication:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
