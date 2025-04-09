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
    
    // Get the appointment with its related data
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        *,
        dog:dogs(id, name, breed, color, owner_id)
      `)
      .eq('id', params.id)
      .single();
    
    if (appointmentError) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    // Verify that the dog belongs to the user
    if (appointment.dog[0].owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
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
    const appointmentData = await request.json();
    
    // Get the appointment to verify ownership
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        dog_id,
        dog:dogs(owner_id)
      `)
      .eq('id', params.id)
      .single();
    
    if (appointmentError) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    // Verify that the dog belongs to the user
    if (appointment.dog[0].owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // If the dog_id is being changed, verify that the new dog also belongs to the user
    if (appointmentData.dog_id && appointmentData.dog_id !== appointment.dog_id) {
      const { data: newDog, error: newDogError } = await supabase
        .from('dogs')
        .select('id')
        .eq('id', appointmentData.dog_id)
        .eq('owner_id', user.id)
        .single();
      
      if (newDogError || !newDog) {
        return NextResponse.json({ error: 'New dog not found or not owned by user' }, { status: 403 });
      }
    }
    
    // Update the appointment
    const { data: updatedAppointment, error: updateError } = await supabase
      .from('appointments')
      .update(appointmentData)
      .eq('id', params.id)
      .select()
      .single();
    
    if (updateError) {
      return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
    
    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
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
    
    // Get the appointment to verify ownership
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        dog_id,
        dog:dogs(owner_id)
      `)
      .eq('id', params.id)
      .single();
    
    if (appointmentError) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    // Verify that the dog belongs to the user
    if (appointment.dog[0].owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Delete the appointment
    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .eq('id', params.id);
    
    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
