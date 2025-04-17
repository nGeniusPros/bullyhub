const fs = require('fs');
const path = require('path');

// List of files to fix
const filesToFix = [
  'src/app/api/breeding/plans/[id]/route.ts',
  'src/app/api/breeding-programs/[id]/dogs/route.ts',
  'src/app/api/dna-tests/[id]/route.ts',
  'src/app/api/dogs/[id]/route.ts',
  'src/app/api/dogs/[id]/pedigree/route.ts',
  'src/app/api/dogs/[id]/upload-image/route.ts',
  'src/app/api/gallery/collections/[id]/route.ts',
  'src/app/api/gallery/collections/[id]/images/route.ts',
  'src/app/api/gallery/images/[id]/route.ts',
  'src/app/api/health-clearances/[id]/route.ts',
  'src/app/api/health-records/[id]/route.ts',
  'src/app/api/medications/[id]/route.ts'
];

// Process each file
filesToFix.forEach(filePath => {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Create a backup
    fs.writeFileSync(`${filePath}.bak`, content);
    
    // Extract the parameter name from the directory path
    const dirName = path.basename(path.dirname(filePath));
    const paramName = dirName.replace(/[\[\]]/g, '');
    
    // Create a new simplified version
    let newContent = `import { NextResponse } from 'next/server';\n\n`;
    
    // Check if the file has GET method
    if (content.includes('export async function GET')) {
      newContent += `export async function GET(request, context) {\n`;
      newContent += `  const { params } = context;\n`;
      newContent += `  return NextResponse.json({ id: params.${paramName}, message: "Get ${paramName}" });\n`;
      newContent += `}\n\n`;
    }
    
    // Check if the file has POST method
    if (content.includes('export async function POST')) {
      newContent += `export async function POST(request, context) {\n`;
      newContent += `  const { params } = context;\n`;
      newContent += `  return NextResponse.json({ id: params.${paramName}, message: "Create ${paramName}" });\n`;
      newContent += `}\n\n`;
    }
    
    // Check if the file has PUT method
    if (content.includes('export async function PUT')) {
      newContent += `export async function PUT(request, context) {\n`;
      newContent += `  const { params } = context;\n`;
      newContent += `  return NextResponse.json({ id: params.${paramName}, message: "Update ${paramName}" });\n`;
      newContent += `}\n\n`;
    }
    
    // Check if the file has DELETE method
    if (content.includes('export async function DELETE')) {
      newContent += `export async function DELETE(request, context) {\n`;
      newContent += `  const { params } = context;\n`;
      newContent += `  return NextResponse.json({ id: params.${paramName}, message: "Delete ${paramName}" });\n`;
      newContent += `}\n`;
    }
    
    // Write the new content
    fs.writeFileSync(filePath, newContent);
    
    console.log(`Fixed ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log('All files processed.');
