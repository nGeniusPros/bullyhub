#!/usr/bin/env node

/**
 * Test MCP Server Script
 * 
 * This script tests the connection to the Supabase MCP server
 * and executes a simple query to verify it's working correctly.
 */

import { executeQuery, listServers } from './mcp-helper.js';

async function main() {
  try {
    console.log('Available MCP servers:');
    console.log(listServers());
    
    console.log('\nTesting connection to Supabase MCP server...');
    
    // Execute a simple test query
    const result = await executeQuery('SELECT current_timestamp as time');
    
    console.log('\nQuery result:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\nMCP server test completed successfully!');
  } catch (error) {
    console.error('Error testing MCP server:', error);
    process.exit(1);
  }
}

main();
