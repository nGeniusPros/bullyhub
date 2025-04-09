# Monitoring Netlify Functions for Bully Hub

This document explains how to use the monitoring utility for Netlify functions in the Bully Hub project.

## Overview

The monitoring utility provides a simple way to track the execution of Netlify functions, including:

- Execution time
- Request details
- Response status
- Error tracking

## Usage

### Basic Usage

To add monitoring to a Netlify function, wrap the handler function with the `monitorFunction` utility:

```javascript
// netlify/functions/example.js
import { createResponse, handleOptions } from "../utils/cors-headers";
import { monitorFunction } from "../utils/monitoring";

// Use the monitorFunction wrapper
export const handler = monitorFunction(async (event, context) => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  // Your function code here
  return createResponse(200, {
    message: "Example response",
    timestamp: new Date().toISOString()
  });
});
```

### Monitoring Headers

The monitoring utility adds the following headers to the response:

- `X-Execution-Time`: The execution time of the function in milliseconds

### Advanced Usage

For more detailed monitoring, you can use the monitoring utility directly:

```javascript
import { initMonitoring, logEvent, getExecutionTime } from "../utils/monitoring";
import { createResponse, handleOptions } from "../utils/cors-headers";

export async function handler(event, context) {
  const monitoring = initMonitoring();
  
  try {
    // Log request
    logEvent(monitoring, 'request', {
      path: event.path,
      httpMethod: event.httpMethod
    });
    
    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === "OPTIONS") {
      return handleOptions();
    }
    
    // Your function code here
    
    // Log custom event
    logEvent(monitoring, 'custom_event', {
      message: 'Something happened'
    });
    
    // Log response
    logEvent(monitoring, 'response', {
      statusCode: 200,
      executionTime: getExecutionTime(monitoring)
    });
    
    return createResponse(200, {
      message: "Example response",
      timestamp: new Date().toISOString(),
      executionTime: getExecutionTime(monitoring)
    });
  } catch (error) {
    // Log error
    logEvent(monitoring, 'error', {
      message: error.message,
      stack: error.stack,
      executionTime: getExecutionTime(monitoring)
    });
    
    return createResponse(500, {
      error: "Internal Server Error",
      executionTime: getExecutionTime(monitoring)
    });
  }
}
```

## Viewing Monitoring Data

Currently, monitoring data is only available in the function response headers and logs. In the future, we plan to add a dashboard for viewing monitoring data.

### Checking Execution Time

You can check the execution time of a function by looking at the `X-Execution-Time` header in the response:

```javascript
const response = await fetch("/.netlify/functions/hello-world");
const executionTime = response.headers.get("X-Execution-Time");
console.log(`Execution time: ${executionTime}`);
```

## Future Enhancements

We plan to enhance the monitoring utility with the following features:

- Integration with external monitoring services (e.g., Datadog, New Relic)
- Dashboard for viewing monitoring data
- Alerting for slow functions or errors
- Performance metrics and trends

## Troubleshooting

If you encounter issues with the monitoring utility:

- Check that the `monitorFunction` wrapper is correctly applied
- Verify that the function is returning a valid response
- Check the Netlify function logs for any errors

For more information on Netlify functions, see the [NETLIFY_FUNCTIONS.md](./NETLIFY_FUNCTIONS.md) file.
