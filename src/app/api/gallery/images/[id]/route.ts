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
    
    // Get the image with its related data
    const { data: image, error: imageError } = await supabase
      .from('gallery_images')
      .select(`
        *,
        dog:dogs(id, name, breed, color)
      `)
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .single();
    
    if (imageError) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    return NextResponse.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
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
    const imageData = await request.json();
    
    // Verify that the image belongs to the user
    const { data: image, error: imageError } = await supabase
      .from('gallery_images')
      .select('id')
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .single();
    
    if (imageError || !image) {
      return NextResponse.json({ error: 'Image not found or not owned by user' }, { status: 403 });
    }
    
    // If a dog_id is provided, verify that the dog belongs to the user
    if (imageData.dog_id) {
      const { data: dog, error: dogError } = await supabase
        .from('dogs')
        .select('id')
        .eq('id', imageData.dog_id)
        .eq('owner_id', user.id)
        .single();
      
      if (dogError || !dog) {
        return NextResponse.json({ error: 'Dog not found or not owned by user' }, { status: 403 });
      }
    }
    
    // Update the image
    const { data: updatedImage, error: updateError } = await supabase
      .from('gallery_images')
      .update(imageData)
      .eq('id', params.id)
      .select()
      .single();
    
    if (updateError) {
      return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
    }
    
    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error('Error updating image:', error);
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
    
    // Verify that the image belongs to the user
    const { data: image, error: imageError } = await supabase
      .from('gallery_images')
      .select('storage_path')
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .single();
    
    if (imageError || !image) {
      return NextResponse.json({ error: 'Image not found or not owned by user' }, { status: 403 });
    }
    
    // Delete the image from storage
    if (image.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([image.storage_path]);
      
      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }
    
    // Delete the image from the database
    const { error: deleteError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', params.id);
    
    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
