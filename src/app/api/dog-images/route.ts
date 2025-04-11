import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fsPromises } from 'fs';

export async function GET() {
  try {
    const dogsDir = path.join(process.cwd(), 'public', 'dogs');
    
    // Check if the directory exists
    const directoryExists = await fsPromises.access(dogsDir)
      .then(() => true)
      .catch(() => false);
    
    if (!directoryExists) {
      // Directory doesn't exist, return empty array
      return NextResponse.json({ images: [] });
    }
    
    // Read the directory
    const files = await fsPromises.readdir(dogsDir);
    
    // Filter for image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
    
    // Return the paths relative to the public directory
    const imagePaths = imageFiles.map(file => `/dogs/${file}`);
    
    return NextResponse.json({ images: imagePaths });
  } catch (error) {
    console.error('Error fetching dog images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dog images' },
      { status: 500 }
    );
  }
}
