import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the stud service details
    const { data: studService, error: studServiceError } = await supabase
      .from('stud_services')
      .select(`
        *,
        stud:dogs(
          id, 
          name, 
          breed, 
          color, 
          date_of_birth,
          owner_id,
          profiles:owner_id(first_name, last_name, email)
        )
      `)
      .eq('id', params.id)
      .single();
    
    if (studServiceError || !studService) {
      console.error('Error fetching stud service:', studServiceError);
      return NextResponse.json({ error: 'Stud service not found' }, { status: 404 });
    }
    
    return NextResponse.json(studService);
  } catch (error) {
    console.error('Error in stud service API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
