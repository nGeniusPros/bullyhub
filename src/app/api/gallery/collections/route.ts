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
    
    // Get all collections owned by the user
    const { data: collections, error: collectionsError } = await supabase
      .from('gallery_collections')
      .select(`
        *,
        cover_image:gallery_images(id, url)
      `)
      .eq('owner_id', user.id)
      .order('name');
    
    if (collectionsError) {
      return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
    }
    
    // For each collection, get the count of images
    const collectionsWithCounts = await Promise.all(
      collections.map(async (collection) => {
        const { count, error: countError } = await supabase
          .from('gallery_collection_images')
          .select('*', { count: 'exact', head: true })
          .eq('collection_id', collection.id);
        
        return {
          ...collection,
          image_count: countError ? 0 : count || 0
        };
      })
    );
    
    return NextResponse.json(collectionsWithCounts);
  } catch (error) {
    console.error('Error fetching collections:', error);
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
    const collectionData = await request.json();
    
    // Add the owner_id to the collection data
    collectionData.owner_id = user.id;
    
    // If a cover_image_id is provided, verify that the image belongs to the user
    if (collectionData.cover_image_id) {
      const { data: image, error: imageError } = await supabase
        .from('gallery_images')
        .select('id')
        .eq('id', collectionData.cover_image_id)
        .eq('owner_id', user.id)
        .single();
      
      if (imageError || !image) {
        return NextResponse.json({ error: 'Cover image not found or not owned by user' }, { status: 403 });
      }
    }
    
    // Insert the collection
    const { data: collection, error: collectionError } = await supabase
      .from('gallery_collections')
      .insert(collectionData)
      .select()
      .single();
    
    if (collectionError) {
      return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
    }
    
    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
