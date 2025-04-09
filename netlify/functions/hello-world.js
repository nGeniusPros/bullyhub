// netlify/functions/hello-world.js
import { createResponse, handleOptions } from "../utils/cors-headers";
import { monitorFunction } from "../utils/monitoring";

// Use the monitorFunction wrapper
export const handler = monitorFunction(async (event, context) => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  return createResponse(200, {
    message: "Hello from Bully Hub serverless function!",
    timestamp: new Date().toISOString(),
  });
});
