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

// Function to find all page.tsx files in directories with square brackets
async function findPageFiles(dir) {
  const pageFiles = [];
  
  async function scan(directory) {
    const files = await readdir(directory);
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        await scan(filePath);
      } else if ((file === 'page.tsx' || file === 'page.js') && directory.includes('[')) {
        pageFiles.push(filePath);
      }
    }
  }
  
  await scan(dir);
  return pageFiles;
}

// Function to fix a route file
async function fixRouteFile(filePath) {
  console.log(`Processing API route: ${filePath}...`);
  
  // Read the file content
  const content = await readFile(filePath, 'utf8');
  
  // Create a backup if it doesn't already exist
  const backupPath = `${filePath}.bak`;
  if (!fs.existsSync(backupPath)) {
    await writeFile(backupPath, content);
    console.log(`  Created backup at ${backupPath}`);
  }
  
  // Process the content to fix the parameter handling
  let newContent = content;
  
  // Fix GET method
  if (content.includes('export async function GET')) {
    newContent = newContent.replace(
      /export async function GET\s*\(\s*request\s*:.*?,\s*\{\s*params\s*\}\s*:.*?\)\s*{/s,
      'export async function GET(request, context) {\n  const { params } = context;'
    );
  }
  
  // Fix POST method
  if (content.includes('export async function POST')) {
    newContent = newContent.replace(
      /export async function POST\s*\(\s*request\s*:.*?,\s*\{\s*params\s*\}\s*:.*?\)\s*{/s,
      'export async function POST(request, context) {\n  const { params } = context;'
    );
  }
  
  // Fix PUT method
  if (content.includes('export async function PUT')) {
    newContent = newContent.replace(
      /export async function PUT\s*\(\s*request\s*:.*?,\s*\{\s*params\s*\}\s*:.*?\)\s*{/s,
      'export async function PUT(request, context) {\n  const { params } = context;'
    );
  }
  
  // Fix DELETE method
  if (content.includes('export async function DELETE')) {
    newContent = newContent.replace(
      /export async function DELETE\s*\(\s*request\s*:.*?,\s*\{\s*params\s*\}\s*:.*?\)\s*{/s,
      'export async function DELETE(request, context) {\n  const { params } = context;'
    );
  }
  
  // Fix PATCH method
  if (content.includes('export async function PATCH')) {
    newContent = newContent.replace(
      /export async function PATCH\s*\(\s*request\s*:.*?,\s*\{\s*params\s*\}\s*:.*?\)\s*{/s,
      'export async function PATCH(request, context) {\n  const { params } = context;'
    );
  }
  
  // Write the new content if changes were made
  if (newContent !== content) {
    await writeFile(filePath, newContent);
    console.log(`  Fixed ${filePath}`);
  } else {
    console.log(`  No changes needed for ${filePath}`);
  }
}

// Function to fix a page file
async function fixPageFile(filePath) {
  console.log(`Processing page component: ${filePath}...`);
  
  // Read the file content
  const content = await readFile(filePath, 'utf8');
  
  // Create a backup if it doesn't already exist
  const backupPath = `${filePath}.bak`;
  if (!fs.existsSync(backupPath)) {
    await writeFile(backupPath, content);
    console.log(`  Created backup at ${backupPath}`);
  }
  
  // Process the content to fix the parameter handling
  let newContent = content;
  
  // Fix export default function Component({ params }: { params: { id: string } })
  newContent = newContent.replace(
    /export default function \w+\(\{\s*params\s*\}\s*:\s*\{\s*params\s*:\s*\{\s*\w+\s*:\s*string\s*\}\s*\}\)\s*{/g,
    (match) => {
      const functionName = match.match(/export default function (\w+)/)[1];
      return `export default function ${functionName}({ params }) {`;
    }
  );
  
  // Fix export async function generateMetadata({ params }: { params: { id: string } })
  newContent = newContent.replace(
    /export async function generateMetadata\(\{\s*params\s*\}\s*:\s*\{\s*params\s*:\s*\{\s*\w+\s*:\s*string\s*\}\s*\}\)\s*{/g,
    'export async function generateMetadata({ params }) {'
  );
  
  // Write the new content if changes were made
  if (newContent !== content) {
    await writeFile(filePath, newContent);
    console.log(`  Fixed ${filePath}`);
  } else {
    console.log(`  No changes needed for ${filePath}`);
  }
}

// Main function
async function main() {
  try {
    // Fix API routes
    const apiDir = path.join(__dirname, 'src', 'app', 'api');
    const routeFiles = await findRouteFiles(apiDir);
    
    console.log(`Found ${routeFiles.length} API route files to process.`);
    
    for (const file of routeFiles) {
      await fixRouteFile(file);
    }
    
    // Fix page components
    const pagesDir = path.join(__dirname, 'src', 'app');
    const pageFiles = await findPageFiles(pagesDir);
    
    console.log(`Found ${pageFiles.length} page component files to process.`);
    
    for (const file of pageFiles) {
      await fixPageFile(file);
    }
    
    console.log('All files processed successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
