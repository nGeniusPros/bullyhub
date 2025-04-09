import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const DOG_API_KEY = 'live_QTXVxRVbZz6jjQf6FeSGiy6NMoN1eS3Ez10bY2mmbyIwJWqIyRMqVtFAYgmAO56N';
const DOG_API_URL = 'https://api.thedogapi.com/v1';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '20';
    const breed = 'french bulldog'; // Hardcoded for French Bulldogs

    // Fetch from Dog API
    const dogApiResponse = await fetch(
      `${DOG_API_URL}/images/search?limit=${limit}&breed_ids=113&order=RANDOM`,
      {
        headers: {
          'x-api-key': DOG_API_KEY
        }
      }
    );
    const externalImages = await dogApiResponse.json();

    // Fetch user's uploaded images
    const { data: userImages } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    return NextResponse.json({
      external: externalImages,
      uploaded: userImages || []
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}