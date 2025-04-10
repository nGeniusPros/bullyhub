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

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
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
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'query') {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
  }

  const { query } = request.params.arguments as { query: string };

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
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Supabase MCP server running');
}

main().catch(console.error);
