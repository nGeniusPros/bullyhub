/**
 * This file provides a utility function to proxy requests to Netlify Functions
 * during local development.
 */

import { NextResponse } from 'next/server';

/**
 * Proxy a request to the Netlify Functions server
 * @param request The original request
 * @param functionName The name of the Netlify function to call
 * @returns The response from the Netlify function
 */
export async function proxyToNetlifyFunction(request: Request, functionName: string) {
  try {
    // Determine the Netlify Functions server URL
    // In development, this is http://localhost:9999/.netlify/functions/
    const netlifyFunctionsUrl = process.env.NETLIFY_FUNCTIONS_URL || 'http://localhost:9999/.netlify/functions';
    
    // Build the URL for the Netlify function
    const url = `${netlifyFunctionsUrl}/${functionName}`;
    
    // Get the request method and body
    const method = request.method;
    let body = null;
    
    // Only include body for non-GET requests
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.text();
    }
    
    // Forward the request to the Netlify function
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error proxying to Netlify function ${functionName}:`, error);
    return NextResponse.json(
      { error: 'Failed to proxy request to Netlify function' },
      { status: 500 }
    );
  }
}
