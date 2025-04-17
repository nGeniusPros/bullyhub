const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Function to recursively find all route.ts files in directories with square brackets
async function findRouteFiles(dir) {
  const routeFiles = [];
  
  async function scan(directory) {
    const files = await readdir(directory);
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        await scan(filePath);
      } else if (file === 'route.ts' && directory.includes('[')) {
        routeFiles.push(filePath);
      }
    }
  }
  
  await scan(dir);
  return routeFiles;
}

// Function to fix a route file
async function fixRouteFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  // Read the file content
  const content = await readFile(filePath, 'utf8');
  
  // Extract the parameter name from the directory path
  const dirName = path.basename(path.dirname(filePath));
  const paramName = dirName.replace(/[\[\]]/g, '');
  
  // Check if the file already has the correct type annotations
  if (content.includes('{ params }: { params: {')) {
    console.log(`  Already fixed, skipping.`);
    return;
  }
  
  // Add NextRequest import if needed
  let newContent = content;
  if (!content.includes('NextRequest')) {
    if (content.includes('import { NextResponse }')) {
      newContent = content.replace(
        'import { NextResponse }',
        'import { NextRequest, NextResponse }'
      );
    } else if (content.includes('import {NextResponse}')) {
      newContent = content.replace(
        'import {NextResponse}',
        'import {NextRequest, NextResponse}'
      );
    } else if (content.includes('import')) {
      // Add after the last import
      const lines = content.split('\n');
      let lastImportIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import')) {
          lastImportIndex = i;
        }
      }
      
      if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, 'import { NextRequest } from "next/server";');
        newContent = lines.join('\n');
      }
    } else {
      // No imports found, add at the beginning
      newContent = 'import { NextRequest, NextResponse } from "next/server";\n\n' + content;
    }
  }
  
  // Fix the route handlers
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  
  for (const method of methods) {
    const regex = new RegExp(`export async function ${method}\\s*\\(\\s*request\\s*,\\s*\\{\\s*params\\s*\\}\\s*\\)`, 'g');
    newContent = newContent.replace(
      regex,
      `export async function ${method}(request: NextRequest, { params }: { params: { ${paramName}: string } })`
    );
  }
  
  // Write the updated content back to the file
  if (newContent !== content) {
    await writeFile(filePath, newContent, 'utf8');
    console.log(`  Fixed.`);
  } else {
    console.log(`  No changes needed.`);
  }
}

// Main function
async function main() {
  try {
    const srcDir = path.join(__dirname, 'src', 'app', 'api');
    const routeFiles = await findRouteFiles(srcDir);
    
    console.log(`Found ${routeFiles.length} route files to process.`);
    
    for (const file of routeFiles) {
      await fixRouteFile(file);
    }
    
    console.log('All files processed successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
