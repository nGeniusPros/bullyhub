// netlify/edge-functions/color-prediction-cached.js

/**
 * Edge function for color prediction with caching
 * This function caches color prediction results for better performance
 */

// Simple in-memory cache (in a real implementation, you would use KV store or similar)
const cache = new Map();
const CACHE_TTL = 3600 * 1000; // 1 hour in milliseconds

export default async (request, context) => {
  // Only handle POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });
  }

  // Handle OPTIONS request for CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });
  }

  try {
    // Parse the request body
    const data = await request.json();
    const { sireId, damId } = data;

    if (!sireId || !damId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Create a cache key from the request parameters
    const cacheKey = `color-prediction:${sireId}:${damId}`;

    // Check if we have a cached result
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      
      // Check if the cache is still valid
      if (Date.now() - cachedData.timestamp < CACHE_TTL) {
        console.log(`Cache hit for ${cacheKey}`);
        
        // Return the cached result with a cache header
        return new Response(JSON.stringify(cachedData.data), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-Cache': 'HIT',
            'X-Cache-Age': `${Math.floor((Date.now() - cachedData.timestamp) / 1000)}s`
          }
        });
      } else {
        // Cache expired, remove it
        cache.delete(cacheKey);
      }
    }

    // Cache miss, forward the request to the original function
    const originalFunctionUrl = '/.netlify/functions/color-prediction';
    
    const response = await fetch(new URL(originalFunctionUrl, request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // Get the response data
    const responseData = await response.json();

    // Store in cache
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });

    console.log(`Cache miss for ${cacheKey}, stored new result`);

    // Return the response with cache headers
    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
