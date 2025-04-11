#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to the MCP server
const serverPath = path.join(__dirname, 'mcp-supabase-server', 'src', 'index.js');

// Check if the server file exists
if (!fs.existsSync(serverPath)) {
  console.error(`Error: MCP server file not found at ${serverPath}`);
  process.exit(1);
}

console.log('Starting Supabase MCP server...');

// Start the server process
const serverProcess = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: process.env
});

// Handle server process events
serverProcess.on('error', (err) => {
  console.error('Failed to start MCP server:', err);
});

serverProcess.on('exit', (code, signal) => {
  if (code !== 0) {
    console.log(`MCP server process exited with code ${code} and signal ${signal}`);
  }
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down MCP server...');
  serverProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down MCP server...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});

console.log('MCP server running. Press Ctrl+C to stop.');
