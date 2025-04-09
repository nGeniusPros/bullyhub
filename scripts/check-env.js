import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Required environment variables
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

// Optional environment variables
const optionalVars = [
  'OPENAI_API_KEY',
  'AYRSHARE_API_KEY',
  'NEXT_SERVER_ACTIONS_ENCRYPTION_KEY',
];

console.log('=== Environment Variables Check ===\n');

// Check required variables
console.log('Required Variables:');
let missingRequired = false;

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.log(`❌ ${varName} is missing`);
    missingRequired = true;
  } else {
    console.log(`✅ ${varName} is set`);
  }
}

// Check optional variables
console.log('\nOptional Variables:');
for (const varName of optionalVars) {
  if (!process.env[varName]) {
    console.log(`⚠️ ${varName} is not set (optional)`);
  } else {
    console.log(`✅ ${varName} is set`);
  }
}

// Create .env.local if it doesn't exist
const envPath = path.resolve(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.log('\n.env.local file not found. Creating template...');
  
  const templatePath = path.resolve(__dirname, '../.env.local.example');
  if (fs.existsSync(templatePath)) {
    fs.copyFileSync(templatePath, envPath);
    console.log('✅ Created .env.local from template. Please edit it with your actual values.');
  } else {
    console.log('❌ Template file .env.local.example not found.');
    
    // Create a basic template
    const basicTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Ayrshare API Key (for social media integration)
AYRSHARE_API_KEY=A2169CA6-7EBF48E1-9DE30279-EF74AD03

# Next.js Configuration
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=your_encryption_key_here
`;
    
    fs.writeFileSync(envPath, basicTemplate);
    console.log('✅ Created basic .env.local template. Please edit it with your actual values.');
  }
}

if (missingRequired) {
  console.log('\n❌ Some required environment variables are missing. Please check your .env.local file.');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set.');
}
