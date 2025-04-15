#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import pg from 'pg';

// Import feature tools
import { dnaTestingTools } from '../../src/features/dna-testing/mcp/dna-tools.js';
import { healthClearanceTools } from '../../src/features/health-clearances/mcp/health-tools.js';
import { studServiceTools } from '../../src/features/stud-services/mcp/stud-tools.js';
import { marketplaceTools } from '../../src/features/marketplace/mcp/marketplace-tools.js';
import { dogTools } from '../../src/features/dogs/mcp/dog-tools.js';

const {
  SUPABASE_DB_PASSWORD,
  SUPABASE_PROJECT_REF,
  SUPABASE_REGION,
} = process.env;

if (!SUPABASE_DB_PASSWORD || !SUPABASE_PROJECT_REF || !SUPABASE_REGION) {
  throw new Error('Missing required Supabase environment variables');
}

const connectionString = `postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.${SUPABASE_PROJECT_REF}.${SUPABASE_REGION}.supabase.co:5432/postgres`;

const pool = new pg.Pool({
  connectionString,
});

async function queryDatabase(sql: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(sql);
    return res;
  } finally {
    client.release();
  }
}

const server = new Server(
  {
    name: 'supabase-query-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Define all available tools
const availableTools = [
  // Core database query tool
  {
    name: 'query',
    description: 'Execute a SQL query on the Supabase database',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'SQL query string',
        },
      },
      required: ['query'],
    },
    handler: async ({ query }: { query: string }) => {
      try {
        const result = await queryDatabase(query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.rows, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing query: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  },

  // Add feature tools
  ...dnaTestingTools,
  ...healthClearanceTools,
  ...studServiceTools,
  ...marketplaceTools,
  ...dogTools,
];

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: availableTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  })),
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const tool = availableTools.find(t => t.name === toolName);

  if (!tool) {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
  }

  try {
    return await tool.handler(request.params.arguments);
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool ${toolName}: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Supabase MCP server running with Vertical Slice Architecture tools');
}

main().catch(console.error);
