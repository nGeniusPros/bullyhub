import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export interface BreedingPlanParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  context: BreedingPlanParams
) {
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

    // Get the breeding plan with its related data
    const { data: breedingPlan, error: planError } = await supabase
      .from('breeding_plans')
      .select(`
        *,
        breeding_program:breeding_programs(id, name, program_type, color_focus, health_protocols),
        sire:dogs!breeding_plans_sire_id_fkey(id, name, breed, color, date_of_birth),
        dam:dogs!breeding_plans_dam_id_fkey(id, name, breed, color, date_of_birth)
      `)
      .eq('id', context.params.id)
      .single();

    if (planError) {
      return NextResponse.json({ error: 'Breeding plan not found' }, { status: 404 });
    }

    // Check if the user has access to this breeding plan
    if (profile.role === 'breeder' && breedingPlan.breeder_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    } else if (profile.role === 'petOwner' && breedingPlan.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(breedingPlan);
  } catch (error) {
    console.error('Error in GET /api/breeding/plans/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: BreedingPlanParams
) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the breeding plan to verify ownership
    const { data: breedingPlan, error: planError } = await supabase
      .from('breeding_plans')
      .select('breeder_id')
      .eq('id', context.params.id)
      .single();

    if (planError) {
      return NextResponse.json({ error: 'Breeding plan not found' }, { status: 404 });
    }

    // Verify that the user is the breeder who created the plan
    if (breedingPlan.breeder_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Parse the request body
    const planData = await request.json();

    // Verify that the breeding program belongs to the user if it's being changed
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

    // Verify that the sire belongs to the user or is a stud service if it's being changed
    if (planData.sire_id) {
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
    }

    // Verify that the dam belongs to the user if it's being changed
    if (planData.dam_id) {
      const { data: dam, error: damError } = await supabase
        .from('dogs')
        .select('id, owner_id')
        .eq('id', planData.dam_id)
        .eq('owner_id', user.id)
        .single();

      if (damError || !dam) {
        return NextResponse.json({ error: 'Dam not found or not owned by user' }, { status: 403 });
      }
    }

    // Update the breeding plan
    const { data: updatedPlan, error: updateError } = await supabase
      .from('breeding_plans')
      .update({
        name: planData.name,
        breeding_program_id: planData.breeding_program_id,
        sire_id: planData.sire_id,
        dam_id: planData.dam_id,
        planned_date: planData.planned_date,
        status: planData.status,
        notes: planData.notes,
        ai_recommendations: planData.ai_recommendations,
        compatibility: planData.compatibility
      })
      .eq('id', context.params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating breeding plan:', updateError);
      return NextResponse.json({ error: 'Failed to update breeding plan' }, { status: 500 });
    }

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error('Error in PUT /api/breeding/plans/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: BreedingPlanParams
) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the breeding plan to verify ownership
    const { data: breedingPlan, error: planError } = await supabase
      .from('breeding_plans')
      .select('breeder_id')
      .eq('id', context.params.id)
      .single();

    if (planError) {
      return NextResponse.json({ error: 'Breeding plan not found' }, { status: 404 });
    }

    // Verify that the user is the breeder who created the plan
    if (breedingPlan.breeder_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the breeding plan
    const { error: deleteError } = await supabase
      .from('breeding_plans')
      .delete()
      .eq('id', context.params.id);

    if (deleteError) {
      console.error('Error deleting breeding plan:', deleteError);
      return NextResponse.json({ error: 'Failed to delete breeding plan' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/breeding/plans/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
