#!/usr/bin/env node

/**
 * This script downloads random dog images from the Dog API and saves them to the public/dogs directory.
 * Usage: node scripts/download-dog-images.js [count]
 * 
 * count: Number of images to download (default: 10)
 */

import { downloadRandomDogImages } from '../src/lib/dog-api.js';

// Parse command line arguments
const args = process.argv.slice(2);
const count = parseInt(args[0], 10) || 10;

async function main() {
  console.log(`Downloading ${count} dog images from the Dog API...`);
  
  try {
    const imagePaths = await downloadRandomDogImages(count);
    
    console.log(`Successfully downloaded ${imagePaths.length} dog images:`);
    imagePaths.forEach(path => console.log(`- ${path}`));
    
    console.log('\nImages are saved in the public/dogs directory and can be accessed via these paths.');
  } catch (error) {
    console.error('Error downloading dog images:', error);
    process.exit(1);
  }
}

main();
