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
    
    // Get the reminder with its related data
    const { data: reminder, error: reminderError } = await supabase
      .from('reminders')
      .select(`
        *,
        dog:dogs(id, name, breed, color)
      `)
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .single();
    
    if (reminderError) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }
    
    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Error fetching reminder:', error);
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
    const reminderData = await request.json();
    
    // Verify that the reminder belongs to the user
    const { data: reminder, error: reminderError } = await supabase
      .from('reminders')
      .select('id')
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .single();
    
    if (reminderError || !reminder) {
      return NextResponse.json({ error: 'Reminder not found or not owned by user' }, { status: 403 });
    }
    
    // If a dog_id is provided, verify that the dog belongs to the user
    if (reminderData.dog_id) {
      const { data: dog, error: dogError } = await supabase
        .from('dogs')
        .select('id')
        .eq('id', reminderData.dog_id)
        .eq('owner_id', user.id)
        .single();
      
      if (dogError || !dog) {
        return NextResponse.json({ error: 'Dog not found or not owned by user' }, { status: 403 });
      }
    }
    
    // Update the reminder
    const { data: updatedReminder, error: updateError } = await supabase
      .from('reminders')
      .update(reminderData)
      .eq('id', params.id)
      .select()
      .single();
    
    if (updateError) {
      return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 });
    }
    
    return NextResponse.json(updatedReminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
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
    
    // Verify that the reminder belongs to the user
    const { data: reminder, error: reminderError } = await supabase
      .from('reminders')
      .select('id')
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .single();
    
    if (reminderError || !reminder) {
      return NextResponse.json({ error: 'Reminder not found or not owned by user' }, { status: 403 });
    }
    
    // Delete the reminder
    const { error: deleteError } = await supabase
      .from('reminders')
      .delete()
      .eq('id', params.id);
    
    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
