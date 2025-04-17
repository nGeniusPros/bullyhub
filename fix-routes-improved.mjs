import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  'src/app/api/medications/[id]/route.ts',
  'src/app/api/reminders/[id]/route.ts',
  'src/app/api/stud-services/[id]/route.ts'
];

// Process each file
filesToFix.forEach(filePath => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`File ${filePath} does not exist, skipping.`);
      return;
    }

    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Create a backup if it doesn't already exist
    const backupPath = `${filePath}.bak`;
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, content);
      console.log(`Created backup at ${backupPath}`);
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
      fs.writeFileSync(filePath, newContent);
      console.log(`Fixed ${filePath}`);
    } else {
      console.log(`No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log('All files processed.');
