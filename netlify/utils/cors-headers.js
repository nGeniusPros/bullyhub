// netlify/utils/cors-headers.js

/**
 * Returns standard CORS headers for Netlify functions
 * @returns {Object} CORS headers
 */
export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };
}

/**
 * Adds CORS headers to the provided headers object
 * @param {Object} headers - Existing headers object
 * @returns {Object} Headers with CORS headers added
 */
export function addCorsHeaders(headers = {}) {
  return {
    ...headers,
    ...getCorsHeaders()
  };
}

/**
 * Creates a standard response object with CORS headers
 * @param {number} statusCode - HTTP status code
 * @param {Object|string} body - Response body (will be stringified if object)
 * @param {Object} headers - Additional headers to include
 * @returns {Object} Response object for Netlify function
 */
export function createResponse(statusCode, body, headers = {}) {
  const responseBody = typeof body === 'string' ? body : JSON.stringify(body);
  
  return {
    statusCode,
    body: responseBody,
    headers: addCorsHeaders({
      'Content-Type': 'application/json',
      ...headers
    })
  };
}

/**
 * Creates a response for OPTIONS requests (CORS preflight)
 * @returns {Object} Response object for OPTIONS request
 */
export function handleOptions() {
  return {
    statusCode: 204, // No content
    headers: getCorsHeaders(),
    body: ''
  };
}
