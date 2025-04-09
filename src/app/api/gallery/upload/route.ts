import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const dogId = formData.get('dogId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // If a dog_id is provided, verify that the dog belongs to the user
    if (dogId) {
      const { data: dog, error: dogError } = await supabase
        .from('dogs')
        .select('id')
        .eq('id', dogId)
        .eq('owner_id', user.id)
        .single();
      
      if (dogError || !dog) {
        return NextResponse.json({ error: 'Dog not found or not owned by user' }, { status: 403 });
      }
    }
    
    // Generate a unique file name
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${user.id}/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);
    
    if (uploadError) {
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);
    
    // Parse tags if provided
    const parsedTags = tags ? JSON.parse(tags) : [];
    
    // Create a record in the gallery_images table
    const { data: image, error: imageError } = await supabase
      .from('gallery_images')
      .insert({
        owner_id: user.id,
        dog_id: dogId || null,
        title: title || fileName,
        description: description || '',
        url: publicUrl,
        storage_path: filePath,
        tags: parsedTags,
        is_favorite: false
      })
      .select()
      .single();
    
    if (imageError) {
      // If there was an error creating the database record, delete the uploaded file
      await supabase.storage
        .from('gallery')
        .remove([filePath]);
      
      return NextResponse.json({ error: 'Failed to create image record' }, { status: 500 });
    }
    
    return NextResponse.json(image);
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
