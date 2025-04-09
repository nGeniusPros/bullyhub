import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const AYRSHARE_API_KEY = 'A2169CA6-7EBF48E1-9DE30279-EF74AD03';
const AYRSHARE_BASE_URL = 'https://app.ayrshare.com/api';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postData = await request.json();
    
    // Post to social media
    const response = await fetch(`${AYRSHARE_BASE_URL}/post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post: postData.text,
        platforms: postData.platforms,
        mediaUrls: postData.mediaUrls,
        title: postData.title,
        scheduleDate: postData.scheduleDate,
        hashtags: postData.hashtags
      })
    });

    const result = await response.json();

    // Store the post in our database
    const { data: savedPost, error: saveError } = await supabase
      .from('social_posts')
      .insert({
        user_id: user.id,
        post_text: postData.text,
        platforms: postData.platforms,
        media_urls: postData.mediaUrls,
        ayrshare_post_id: result.id,
        status: result.status,
        dog_id: postData.dogId || null
      })
      .select()
      .single();

    if (saveError) {
      return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get history of posts
    const response = await fetch(`${AYRSHARE_BASE_URL}/history`, {
      headers: {
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      }
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}