import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await request.json();

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `French Bulldog ${prompt}`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    const imageUrl = response.data[0].url;

    // Save generated image to gallery
    const { data: savedImage, error: saveError } = await supabase
      .from('gallery_images')
      .insert({
        owner_id: user.id,
        url: imageUrl,
        title: prompt,
        is_ai_generated: true
      })
      .select()
      .single();

    if (saveError) {
      return NextResponse.json({ error: 'Failed to save generated image' }, { status: 500 });
    }

    return NextResponse.json(savedImage);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}