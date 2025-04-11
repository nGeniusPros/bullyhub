// netlify/functions/social-media-integration.js
import { createClient } from '@supabase/supabase-js';
import { createResponse, handleOptions } from '../utils/cors-headers';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Ayrshare API configuration
const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY || 'A2169CA6-7EBF48E1-9DE30279-EF74AD03';
const AYRSHARE_BASE_URL = 'https://app.ayrshare.com/api';

export async function handler(event, context) {
  if (!['POST', 'GET', 'DELETE'].includes(event.httpMethod)) {
    return createResponse(405, { error: 'Method Not Allowed' });
  }

  try {
    if (event.httpMethod === 'POST') {
      return await createSocialPost(event);
    }

    if (event.httpMethod === 'GET') {
      const params = new URLSearchParams(event.queryStringParameters);
      const postId = params.get('postId');

      if (postId) {
        return await getSocialPost(postId);
      } else {
        return await getSocialPosts();
      }
    }

    if (event.httpMethod === 'DELETE') {
      const params = new URLSearchParams(event.queryStringParameters);
      const postId = params.get('postId');

      if (!postId) {
        return createResponse(400, { error: 'Post ID is required' });
      }

      return await deleteSocialPost(postId);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return createResponse(500, { error: 'Internal Server Error' });
  }
}

// Create a new social media post
async function createSocialPost(event) {
  try {
    const postData = JSON.parse(event.body);
    const { text, platforms, mediaUrls, scheduleDate, hashtags, dogId, userId } = postData;

    if (!text || !platforms || !platforms.length) {
      return createResponse(400, { error: 'Text and at least one platform are required' });
    }

    const response = await fetch(`${AYRSHARE_BASE_URL}/post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post: text,
        platforms: platforms,
        mediaUrls: mediaUrls || [],
        title: postData.title,
        scheduleDate: scheduleDate,
        hashtags: hashtags || []
      })
    });

    const result = await response.json();

    if (!result.id) {
      return createResponse(500, { error: 'Failed to create post on social media', details: result });
    }

    const { data: savedPost, error: saveError } = await supabase
      .from('social_posts')
      .insert({
        user_id: userId,
        post_text: text,
        platforms: platforms,
        media_urls: mediaUrls || [],
        ayrshare_post_id: result.id,
        status: result.status,
        dog_id: dogId || null,
        hashtags: hashtags || [],
        schedule_date: scheduleDate,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving post to database:', saveError);
    }

    return createResponse(200, {
      success: true,
      postId: result.id,
      status: result.status,
      postDetails: savedPost || null
    });
  } catch (error) {
    console.error('Error creating social post:', error);
    return createResponse(500, { error: 'Failed to create social media post' });
  }
}

// Get a specific social media post
async function getSocialPost(postId) {
  try {
    const response = await fetch(`${AYRSHARE_BASE_URL}/post/${postId}`, {
      headers: {
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      }
    });

    const result = await response.json();

    const { data: dbPost, error: dbError } = await supabase
      .from('social_posts')
      .select('*')
      .eq('ayrshare_post_id', postId)
      .single();

    if (dbError) {
      console.error('Error fetching post from database:', dbError);
    }

    return createResponse(200, {
      ayrshareData: result,
      databaseData: dbPost || null
    });
  } catch (error) {
    console.error('Error fetching social post:', error);
    return createResponse(500, { error: 'Failed to fetch social media post' });
  }
}

// Get all social media posts
async function getSocialPosts() {
  try {
    const response = await fetch(`${AYRSHARE_BASE_URL}/history`, {
      headers: {
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      }
    });

    const result = await response.json();

    let analytics = null;
    try {
      const analyticsResponse = await fetch(`${AYRSHARE_BASE_URL}/analytics`, {
        headers: {
          'Authorization': `Bearer ${AYRSHARE_API_KEY}`
        }
      });
      analytics = await analyticsResponse.json();
    } catch (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
    }

    return createResponse(200, {
      posts: result,
      analytics: analytics
    });
  } catch (error) {
    console.error('Error fetching social posts:', error);
    return createResponse(500, { error: 'Failed to fetch social media posts' });
  }
}

// Delete a social media post
async function deleteSocialPost(postId) {
  try {
    const response = await fetch(`${AYRSHARE_BASE_URL}/post/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      }
    });

    const result = await response.json();

    const { error: dbError } = await supabase
      .from('social_posts')
      .delete()
      .eq('ayrshare_post_id', postId);

    if (dbError) {
      console.error('Error deleting post from database:', dbError);
    }

    return createResponse(200, {
      success: true,
      message: 'Post deleted successfully',
      details: result
    });
  } catch (error) {
    console.error('Error deleting social post:', error);
    return createResponse(500, { error: 'Failed to delete social media post' });
  }
}
