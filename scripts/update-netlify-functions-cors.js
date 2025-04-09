// scripts/update-netlify-functions-cors.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const functionsDir = path.join(__dirname, '..', 'netlify', 'functions');
const corsUtilPath = '../utils/cors-headers';

// Get list of function files
function getFunctionFiles() {
  try {
    const files = fs.readdirSync(functionsDir);
    return files.filter(file => file.endsWith('.js'));
  } catch (error) {
    console.error(chalk.red('Error reading functions directory:'), error);
    return [];
  }
}

// Check if a file already has CORS utility imported
function hasCorsUtilImport(content) {
  return content.includes('cors-headers') || 
         content.includes('createResponse') || 
         content.includes('handleOptions');
}

// Add CORS utility import to a file
function addCorsUtilImport(content) {
  // Find the last import statement
  const importRegex = /^import .+ from .+;$/gm;
  const imports = [...content.matchAll(importRegex)];
  
  if (imports.length === 0) {
    // No imports found, add at the beginning
    return `import { createResponse, handleOptions } from '${corsUtilPath}';\n\n${content}`;
  }
  
  // Add after the last import
  const lastImport = imports[imports.length - 1];
  const index = lastImport.index + lastImport[0].length;
  
  return content.slice(0, index) + 
         `\nimport { createResponse, handleOptions } from '${corsUtilPath}';` + 
         content.slice(index);
}

// Replace response objects with createResponse calls
function replaceResponseObjects(content) {
  // Replace OPTIONS handling
  content = content.replace(
    /if\s*\(\s*event\.httpMethod\s*===\s*['"]OPTIONS['"]\s*\)\s*\{[^}]*\}/gs,
    `if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }`
  );
  
  // Replace response objects
  content = content.replace(
    /return\s*\{\s*statusCode\s*:\s*(\d+)\s*,\s*body\s*:\s*JSON\.stringify\s*\(\s*(\{[^}]*\})\s*\)\s*,\s*headers\s*:\s*\{[^}]*\}\s*\};/gs,
    (match, statusCode, body) => {
      return `return createResponse(${statusCode}, ${body});`;
    }
  );
  
  return content;
}

// Update a single function file
function updateFunctionFile(filePath) {
  try {
    console.log(chalk.blue(`Updating ${path.basename(filePath)}...`));
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has CORS utility
    if (hasCorsUtilImport(content)) {
      console.log(chalk.yellow(`  Already has CORS utility, skipping import`));
    } else {
      // Add CORS utility import
      content = addCorsUtilImport(content);
      console.log(chalk.green(`  Added CORS utility import`));
    }
    
    // Replace response objects
    const originalContent = content;
    content = replaceResponseObjects(content);
    
    if (content !== originalContent) {
      console.log(chalk.green(`  Updated response objects`));
    } else {
      console.log(chalk.yellow(`  No response objects updated`));
    }
    
    // Write the updated file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(chalk.green(`  Successfully updated ${path.basename(filePath)}`));
    return true;
  } catch (error) {
    console.error(chalk.red(`Error updating ${path.basename(filePath)}:`), error);
    return false;
  }
}

// Update all function files
function updateAllFunctionFiles() {
  console.log(chalk.yellow('=== Updating Netlify Functions with CORS Headers ===\n'));
  
  // Check if CORS utility exists
  const corsUtilFilePath = path.join(__dirname, '..', 'netlify', 'utils', 'cors-headers.js');
  if (!fs.existsSync(corsUtilFilePath)) {
    console.error(chalk.red('Error: CORS utility file not found.'));
    console.log(chalk.yellow('Please create the file at: netlify/utils/cors-headers.js'));
    process.exit(1);
  }
  
  const functionFiles = getFunctionFiles();
  console.log(chalk.blue(`Found ${functionFiles.length} function files to update.\n`));
  
  let successCount = 0;
  let failCount = 0;
  
  for (const file of functionFiles) {
    const filePath = path.join(functionsDir, file);
    const success = updateFunctionFile(filePath);
    
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    console.log(''); // Add a blank line between files
  }
  
  // Summary
  console.log(chalk.yellow('\n=== Update Summary ===\n'));
  console.log(chalk.yellow(`Total: ${functionFiles.length}`));
  console.log(chalk.green(`Success: ${successCount}`));
  console.log(chalk.red(`Failed: ${failCount}`));
  
  if (failCount === 0) {
    console.log(chalk.green('\nAll functions updated successfully!'));
  } else {
    console.log(chalk.yellow('\nSome functions could not be updated. Please check the errors above.'));
  }
}

// Run the update
updateAllFunctionFiles();
