// netlify/utils/monitoring.js

/**
 * Simple monitoring utility for Netlify functions
 * Logs function execution time and errors
 */

// Initialize monitoring
export function initMonitoring() {
  return {
    startTime: Date.now(),
    logs: []
  };
}

// Log an event
export function logEvent(monitoring, event, data = {}) {
  monitoring.logs.push({
    timestamp: Date.now(),
    event,
    data
  });
}

// Calculate execution time
export function getExecutionTime(monitoring) {
  return Date.now() - monitoring.startTime;
}

// Create a monitoring wrapper for functions
export function monitorFunction(handler) {
  return async (event, context) => {
    const monitoring = initMonitoring();
    
    try {
      // Log request
      logEvent(monitoring, 'request', {
        path: event.path,
        httpMethod: event.httpMethod,
        headers: event.headers,
        queryStringParameters: event.queryStringParameters
      });
      
      // Execute the original handler
      const result = await handler(event, context);
      
      // Log response
      logEvent(monitoring, 'response', {
        statusCode: result.statusCode,
        executionTime: getExecutionTime(monitoring)
      });
      
      // Add monitoring headers to the response
      result.headers = {
        ...result.headers,
        'X-Execution-Time': `${getExecutionTime(monitoring)}ms`
      };
      
      return result;
    } catch (error) {
      // Log error
      logEvent(monitoring, 'error', {
        message: error.message,
        stack: error.stack,
        executionTime: getExecutionTime(monitoring)
      });
      
      // Re-throw the error
      throw error;
    }
  };
}

// Example usage:
// import { monitorFunction } from '../utils/monitoring';
// 
// export const handler = monitorFunction(async (event, context) => {
//   // Your function code here
// });
