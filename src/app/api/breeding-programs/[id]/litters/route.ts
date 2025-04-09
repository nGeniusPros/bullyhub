import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(
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
    
    // Get the breeding program to check ownership
    const { data: program, error: programError } = await supabase
      .from('breeding_programs')
      .select('breeder_id')
      .eq('id', params.id)
      .single();
    
    if (programError) {
      return NextResponse.json({ error: 'Breeding program not found' }, { status: 404 });
    }
    
    // Check if the user is the owner of the breeding program
    if (program.breeder_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Parse the request body
    const { sireId, damId, whelpingDate, puppies } = await request.json();
    
    // Validate required fields
    if (!sireId || !damId || !whelpingDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if the sire and dam belong to the user
    const { data: dogs, error: dogsError } = await supabase
      .from('dogs')
      .select('id')
      .in('id', [sireId, damId])
      .eq('owner_id', user.id);
    
    if (dogsError || !dogs || dogs.length !== 2) {
      return NextResponse.json({ error: 'Invalid sire or dam' }, { status: 400 });
    }
    
    // Create the litter
    const { data: litter, error: litterError } = await supabase
      .from('litters')
      .insert({
        breeding_program_id: params.id,
        sire_id: sireId,
        dam_id: damId,
        whelping_date: whelpingDate,
        puppy_count: puppies?.length || 0
      })
      .select()
      .single();
    
    if (litterError) {
      return NextResponse.json({ error: 'Failed to create litter' }, { status: 500 });
    }
    
    // If there are puppies, create them
    if (puppies && puppies.length > 0) {
      const puppyRecords = puppies.map((puppy: any) => ({
        litter_id: litter.id,
        name: puppy.name || null,
        color: puppy.color || null,
        gender: puppy.gender || null
      }));
      
      const { error: puppiesError } = await supabase
        .from('puppies')
        .insert(puppyRecords);
      
      if (puppiesError) {
        return NextResponse.json({ error: 'Failed to create puppies' }, { status: 500 });
      }
    }
    
    // Get the complete litter with puppies
    const { data: completeLitter, error: fetchError } = await supabase
      .from('litters')
      .select(`
        *,
        sire:dogs!litters_sire_id_fkey(id, name, color),
        dam:dogs!litters_dam_id_fkey(id, name, color),
        puppies(*)
      `)
      .eq('id', litter.id)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch complete litter' }, { status: 500 });
    }
    
    return NextResponse.json(completeLitter);
  } catch (error) {
    console.error('Error creating litter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
