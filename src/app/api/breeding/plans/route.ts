import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
// import { dnaAnalysisService } from '@/lib/dna-analysis-service';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user's profile to check if they're a breeder
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    // Get all breeding plans for the user
    const { data: breedingPlans, error: plansError } = await supabase
      .from('breeding_plans')
      .select(`
        *,
        breeding_program:breeding_programs(id, name, program_type, color_focus),
        sire:dogs!breeding_plans_sire_id_fkey(id, name, breed, color),
        dam:dogs!breeding_plans_dam_id_fkey(id, name, breed, color)
      `)
      .eq(profile.role === 'breeder' ? 'breeder_id' : 'owner_id', user.id)
      .order('created_at', { ascending: false });
    
    if (plansError) {
      console.error('Error fetching breeding plans:', plansError);
      return NextResponse.json({ error: 'Failed to fetch breeding plans' }, { status: 500 });
    }
    
    return NextResponse.json(breedingPlans);
  } catch (error) {
    console.error('Error in GET /api/breeding/plans:', error);
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
    
    // Get the user's profile to check if they're a breeder
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    if (profile.role !== 'breeder') {
      return NextResponse.json({ error: 'Only breeders can create breeding plans' }, { status: 403 });
    }
    
    // Parse the request body
    const planData = await request.json();
    
    // Verify that the breeding program belongs to the user
    if (planData.breeding_program_id) {
      const { data: program, error: programError } = await supabase
        .from('breeding_programs')
        .select('id')
        .eq('id', planData.breeding_program_id)
        .eq('breeder_id', user.id)
        .single();
      
      if (programError || !program) {
        return NextResponse.json({ error: 'Breeding program not found or not owned by user' }, { status: 403 });
      }
    }
    
    // Verify that the sire belongs to the user or is a stud service
    const { data: sire, error: sireError } = await supabase
      .from('dogs')
      .select('id, owner_id, is_stud')
      .eq('id', planData.sire_id)
      .single();
    
    if (sireError || !sire) {
      return NextResponse.json({ error: 'Sire not found' }, { status: 404 });
    }
    
    if (sire.owner_id !== user.id && !sire.is_stud) {
      return NextResponse.json({ error: 'Sire must be owned by user or be a stud service' }, { status: 403 });
    }
    
    // Verify that the dam belongs to the user
    const { data: dam, error: damError } = await supabase
      .from('dogs')
      .select('id, owner_id')
      .eq('id', planData.dam_id)
      .eq('owner_id', user.id)
      .single();
    
    if (damError || !dam) {
      return NextResponse.json({ error: 'Dam not found or not owned by user' }, { status: 403 });
    }
    
    // Create the breeding plan
    // const sireData = await dnaAnalysisService.getDogDna(sire.id);
    // const damData = await dnaAnalysisService.getDogDna(dam.id);
    
    // const plan = await dnaAnalysisService.createBreedingPlan({
    //   sire_dna: sireData,
    //   dam_dna: damData,
    //   plan_data: {
    //     planned_date: planData.planned_date,
    //     notes: planData.notes
    //   }
    // });

    const { data: newPlan, error: planError } = await supabase
      .from('breeding_plans')
      .insert({
        ...planData
      })
      .select()
      .single();
    
    if (planError) {
      console.error('Error creating breeding plan:', planError);
      return NextResponse.json({ error: 'Failed to create breeding plan' }, { status: 500 });
    }
    
    return NextResponse.json(newPlan);
  } catch (error) {
    console.error('Error in POST /api/breeding/plans:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
