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
    
    // Get the collection with its related data
    const { data: collection, error: collectionError } = await supabase
      .from('gallery_collections')
      .select(`
        *,
        cover_image:gallery_images(id, url)
      `)
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .single();
    
    if (collectionError) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }
    
    // Get all images in the collection
    const { data: images, error: imagesError } = await supabase
      .from('gallery_collection_images')
      .select(`
        image_id,
        image:gallery_images(*)
      `)
      .eq('collection_id', params.id);
    
    if (imagesError) {
      return NextResponse.json({ error: 'Failed to fetch collection images' }, { status: 500 });
    }
    
    // Format the response
    const response = {
      ...collection,
      images: images.map(item => item.image)
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching collection:', error);
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
    const collectionData = await request.json();
    
    // Verify that the collection belongs to the user
    const { data: collection, error: collectionError } = await supabase
      .from('gallery_collections')
      .select('id')
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .single();
    
    if (collectionError || !collection) {
      return NextResponse.json({ error: 'Collection not found or not owned by user' }, { status: 403 });
    }
    
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
    
    // Update the collection
    const { data: updatedCollection, error: updateError } = await supabase
      .from('gallery_collections')
      .update(collectionData)
      .eq('id', params.id)
      .select()
      .single();
    
    if (updateError) {
      return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
    }
    
    return NextResponse.json(updatedCollection);
  } catch (error) {
    console.error('Error updating collection:', error);
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
    
    // Verify that the collection belongs to the user
    const { data: collection, error: collectionError } = await supabase
      .from('gallery_collections')
      .select('id')
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .single();
    
    if (collectionError || !collection) {
      return NextResponse.json({ error: 'Collection not found or not owned by user' }, { status: 403 });
    }
    
    // Delete the collection
    const { error: deleteError } = await supabase
      .from('gallery_collections')
      .delete()
      .eq('id', params.id);
    
    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
