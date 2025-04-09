// netlify/edge-functions/monitoring-dashboard.js

/**
 * Edge function for the monitoring dashboard
 * This function collects monitoring data from Netlify functions and serves it to the dashboard
 */

export default async (request, context) => {
  // Get monitoring data from Netlify functions
  // In a real implementation, this would fetch data from a database or monitoring service
  // For now, we'll return mock data
  
  const mockData = {
    functions: [
      {
        name: 'hello-world',
        metrics: {
          invocations: 120,
          averageExecutionTime: 45,
          errors: 2,
          p95ExecutionTime: 78,
          lastInvoked: new Date().toISOString()
        }
      },
      {
        name: 'color-prediction',
        metrics: {
          invocations: 87,
          averageExecutionTime: 156,
          errors: 5,
          p95ExecutionTime: 245,
          lastInvoked: new Date().toISOString()
        }
      },
      {
        name: 'coi-calculator',
        metrics: {
          invocations: 64,
          averageExecutionTime: 210,
          errors: 3,
          p95ExecutionTime: 350,
          lastInvoked: new Date().toISOString()
        }
      },
      {
        name: 'stud-receptionist',
        metrics: {
          invocations: 42,
          averageExecutionTime: 180,
          errors: 1,
          p95ExecutionTime: 320,
          lastInvoked: new Date().toISOString()
        }
      },
      {
        name: 'dna-test-integration',
        metrics: {
          invocations: 35,
          averageExecutionTime: 120,
          errors: 0,
          p95ExecutionTime: 190,
          lastInvoked: new Date().toISOString()
        }
      },
      {
        name: 'social-media-integration',
        metrics: {
          invocations: 28,
          averageExecutionTime: 95,
          errors: 4,
          p95ExecutionTime: 150,
          lastInvoked: new Date().toISOString()
        }
      },
      {
        name: 'breeding-program-compatibility',
        metrics: {
          invocations: 56,
          averageExecutionTime: 230,
          errors: 2,
          p95ExecutionTime: 380,
          lastInvoked: new Date().toISOString()
        }
      },
      {
        name: 'health-clearance-verification',
        metrics: {
          invocations: 49,
          averageExecutionTime: 140,
          errors: 1,
          p95ExecutionTime: 210,
          lastInvoked: new Date().toISOString()
        }
      }
    ],
    summary: {
      totalInvocations: 481,
      averageExecutionTime: 147,
      totalErrors: 18,
      errorRate: 3.74,
      slowestFunction: 'breeding-program-compatibility',
      mostErrorProneFunction: 'color-prediction'
    },
    alerts: [
      {
        type: 'error',
        function: 'color-prediction',
        message: 'High error rate (5.7%)',
        timestamp: new Date().toISOString()
      },
      {
        type: 'performance',
        function: 'breeding-program-compatibility',
        message: 'Slow execution time (p95: 380ms)',
        timestamp: new Date().toISOString()
      }
    ]
  };

  // Return the monitoring data as JSON
  return new Response(JSON.stringify(mockData), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }
  });
};
