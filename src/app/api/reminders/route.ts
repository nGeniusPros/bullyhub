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
    
    // Get all reminders for the user
    const { data: reminders, error: remindersError } = await supabase
      .from('reminders')
      .select(`
        *,
        dog:dogs(id, name, breed, color)
      `)
      .eq('owner_id', user.id)
      .order('due_date', { ascending: true });
    
    if (remindersError) {
      return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
    }
    
    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
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
    const reminderData = await request.json();
    
    // Add the owner_id to the reminder data
    reminderData.owner_id = user.id;
    
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
    
    // Insert the reminder
    const { data: reminder, error: reminderError } = await supabase
      .from('reminders')
      .insert(reminderData)
      .select()
      .single();
    
    if (reminderError) {
      return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
    }
    
    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
