#!/usr/bin/env node

/**
 * MCP Helper Script
 * 
 * This script provides utilities for working with MCP servers in the BullyHub project.
 * It can be used by Roo, Claude, or other tools to interact with the MCP servers.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Get MCP server configuration
function getMcpServers() {
  try {
    const configPath = path.join(rootDir, '.roo', 'mcp.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    return config.mcpServers || {};
  } catch (error) {
    console.error('Error reading MCP server configuration:', error);
    return {};
  }
}

// Connect to a specific MCP server
async function connectToServer(serverName) {
  const servers = getMcpServers();
  const serverConfig = servers[serverName];
  
  if (!serverConfig) {
    throw new Error(`MCP server "${serverName}" not found in configuration`);
  }
  
  const client = new Client({
    name: "bullyhub-client",
    version: "1.0.0"
  });
  
  const transport = new StdioClientTransport(serverConfig.command, { 
    cwd: path.resolve(rootDir, serverConfig.cwd || '.') 
  });
  
  await client.connect(transport);
  return client;
}

// Execute a SQL query using the Supabase MCP server
async function executeQuery(query) {
  try {
    const client = await connectToServer('supabase');
    
    const result = await client.callTool({
      name: "query",
      arguments: { query }
    });
    
    await client.close();
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// List available MCP servers
function listServers() {
  const servers = getMcpServers();
  return Object.keys(servers);
}

// Export functions for use in other scripts
export {
  getMcpServers,
  connectToServer,
  executeQuery,
  listServers
};

// If script is run directly, show available servers
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('Available MCP servers:');
  console.log(listServers());
}
