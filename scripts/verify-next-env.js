import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables from various locations
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Try to load from different possible .env file locations
dotenv.config({ path: path.resolve(rootDir, '.env.local') });
dotenv.config({ path: path.resolve(rootDir, '.env') });
dotenv.config({ path: path.resolve(rootDir, '..', '.env.local') });
dotenv.config({ path: path.resolve(rootDir, '..', '.env') });

console.log('=== Next.js Environment Variables Verification ===\n');

// Check for required variables
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

console.log('Environment Variables:');
for (const varName of requiredVars) {
  console.log(`${varName}: ${process.env[varName] ? '✅ Set' : '❌ Missing'}`);
  if (process.env[varName]) {
    console.log(`  Value: ${process.env[varName]}`);
  }
}

// Check for .env files
console.log('\nEnvironment Files:');
const envFiles = [
  { path: path.resolve(rootDir, '.env.local'), name: 'bullyhub/.env.local' },
  { path: path.resolve(rootDir, '.env'), name: 'bullyhub/.env' },
  { path: path.resolve(rootDir, '..', '.env.local'), name: '.env.local (root)' },
  { path: path.resolve(rootDir, '..', '.env'), name: '.env (root)' },
];

for (const file of envFiles) {
  if (fs.existsSync(file.path)) {
    console.log(`${file.name}: ✅ Exists`);
    const content = fs.readFileSync(file.path, 'utf8');
    const lines = content.split('\n');
    for (const varName of requiredVars) {
      const line = lines.find(l => l.startsWith(`${varName}=`));
      if (line) {
        console.log(`  ${varName}: ✅ Defined in file`);
      } else {
        console.log(`  ${varName}: ❌ Not defined in file`);
      }
    }
  } else {
    console.log(`${file.name}: ❌ Does not exist`);
  }
}

// Check Next.js config
const nextConfigPath = path.resolve(rootDir, 'next.config.ts');
if (fs.existsSync(nextConfigPath)) {
  console.log('\nNext.js Config:');
  console.log(`next.config.ts: ✅ Exists`);
  const content = fs.readFileSync(nextConfigPath, 'utf8');
  console.log(`Content:\n${content}`);
} else {
  console.log('\nNext.js Config:');
  console.log(`next.config.ts: ❌ Does not exist`);
}

// Check package.json
const packageJsonPath = path.resolve(rootDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('\nPackage.json:');
  console.log(`package.json: ✅ Exists`);
  const content = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`Dependencies: ${Object.keys(content.dependencies || {}).length}`);
  console.log(`Scripts: ${Object.keys(content.scripts || {}).length}`);
  if (content.type) {
    console.log(`Type: ${content.type}`);
  } else {
    console.log(`Type: Not specified`);
  }
} else {
  console.log('\nPackage.json:');
  console.log(`package.json: ❌ Does not exist`);
}

console.log('\n=== Verification Complete ===');
