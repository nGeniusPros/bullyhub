import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const publicDir = path.join(__dirname, 'public');
const targetDir = path.join(__dirname, '.next/standalone/public');

// Ensure target directory exists
fs.ensureDirSync(targetDir);

// Copy public directory to standalone/public
fs.copySync(publicDir, targetDir, {
  overwrite: true,
});

console.log('Public directory copied to .next/standalone/public');

// Also copy .next/static to standalone/.next/static
const staticSrcDir = path.join(__dirname, '.next/static');
const staticTargetDir = path.join(__dirname, '.next/standalone/.next/static');

if (fs.existsSync(staticSrcDir)) {
  fs.ensureDirSync(staticTargetDir);
  fs.copySync(staticSrcDir, staticTargetDir, {
    overwrite: true,
  });
  console.log('.next/static directory copied to .next/standalone/.next/static');
}
