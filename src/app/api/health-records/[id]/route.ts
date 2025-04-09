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
    
    // Get the health record with its related data
    const { data: healthRecord, error: healthRecordError } = await supabase
      .from('health_records')
      .select(`
        *,
        dog:dogs(id, name, breed, color, owner_id)
      `)
      .eq('id', params.id)
      .single();
    
    if (healthRecordError) {
      return NextResponse.json({ error: 'Health record not found' }, { status: 404 });
    }
    
    // Verify that the dog belongs to the user
    if (healthRecord.dog[0].owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    return NextResponse.json(healthRecord);
  } catch (error) {
    console.error('Error fetching health record:', error);
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
    const healthRecordData = await request.json();
    
    // Get the health record to verify ownership
    const { data: healthRecord, error: healthRecordError } = await supabase
      .from('health_records')
      .select(`
        dog_id,
        dog:dogs(owner_id)
      `)
      .eq('id', params.id)
      .single();
    
    if (healthRecordError) {
      return NextResponse.json({ error: 'Health record not found' }, { status: 404 });
    }
    
    // Verify that the dog belongs to the user
    if (healthRecord.dog[0].owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // If the dog_id is being changed, verify that the new dog also belongs to the user
    if (healthRecordData.dog_id && healthRecordData.dog_id !== healthRecord.dog_id) {
      const { data: newDog, error: newDogError } = await supabase
        .from('dogs')
        .select('id')
        .eq('id', healthRecordData.dog_id)
        .eq('owner_id', user.id)
        .single();
      
      if (newDogError || !newDog) {
        return NextResponse.json({ error: 'New dog not found or not owned by user' }, { status: 403 });
      }
    }
    
    // Update the health record
    const { data: updatedHealthRecord, error: updateError } = await supabase
      .from('health_records')
      .update(healthRecordData)
      .eq('id', params.id)
      .select()
      .single();
    
    if (updateError) {
      return NextResponse.json({ error: 'Failed to update health record' }, { status: 500 });
    }
    
    return NextResponse.json(updatedHealthRecord);
  } catch (error) {
    console.error('Error updating health record:', error);
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
    
    // Get the health record to verify ownership
    const { data: healthRecord, error: healthRecordError } = await supabase
      .from('health_records')
      .select(`
        dog_id,
        dog:dogs(owner_id)
      `)
      .eq('id', params.id)
      .single();
    
    if (healthRecordError) {
      return NextResponse.json({ error: 'Health record not found' }, { status: 404 });
    }
    
    // Verify that the dog belongs to the user
    if (healthRecord.dog[0].owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Delete the health record
    const { error: deleteError } = await supabase
      .from('health_records')
      .delete()
      .eq('id', params.id);
    
    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete health record' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting health record:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
