import path from 'path';
import { promises as fsPromises } from 'fs';
// The Dog API key from environment variables
const DOG_API_KEY = process.env.DOG_API_KEY || 'live_QTXVxRVbZz6jjQf6FeSGiy6NMoN1eS3Ez10bY2mmbyIwJWqIyRMqVtFAYgmAO56N';
// Directory to save dog images
const DOG_IMAGES_DIR = path.join(process.cwd(), 'public', 'dogs');
// Ensure the dog images directory exists
export async function ensureDogImagesDir() {
    // Check if directory exists, if not create it
    const exists = await fsPromises.access(DOG_IMAGES_DIR)
        .then(() => true)
        .catch(() => false);
    if (!exists) {
        await fsPromises.mkdir(DOG_IMAGES_DIR, { recursive: true });
    }
}
/**
 * Fetch random dog images from the Dog API
 * @param limit Number of images to fetch (default: 1)
 * @returns Array of dog image objects
 */
export async function fetchRandomDogImages(limit = 1) {
    try {
        const response = await fetch(`https://api.thedogapi.com/v1/images/search?limit=${limit}`, {
            headers: {
                'x-api-key': DOG_API_KEY
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch dog images: ${response.statusText}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error fetching dog images:', error);
        throw error;
    }
}
/**
 * Download a dog image and save it to the public/dogs directory
 * @param imageUrl URL of the dog image to download
 * @returns Path to the saved image (relative to public directory)
 */
export async function downloadDogImage(imageUrl) {
    try {
        // Ensure the directory exists
        await ensureDogImagesDir();
        // Generate a filename from the URL
        const filename = `dog-${Date.now()}-${Math.floor(Math.random() * 1000)}${path.extname(imageUrl) || '.jpg'}`;
        const filePath = path.join(DOG_IMAGES_DIR, filename);
        // Fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to download image: ${response.statusText}`);
        }
        // Get the image as a buffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Save the image to disk
        await fsPromises.writeFile(filePath, buffer);
        // Return the path relative to the public directory
        return `/dogs/${filename}`;
    }
    catch (error) {
        console.error('Error downloading dog image:', error);
        throw error;
    }
}
/**
 * Download multiple dog images from the Dog API
 * @param count Number of images to download (default: 5)
 * @returns Array of paths to the saved images (relative to public directory)
 */
export async function downloadRandomDogImages(count = 5) {
    try {
        // Fetch random dog images from the API
        const dogImages = await fetchRandomDogImages(count);
        // Download each image and save it
        const downloadPromises = dogImages.map(image => downloadDogImage(image.url));
        // Wait for all downloads to complete
        return await Promise.all(downloadPromises);
    }
    catch (error) {
        console.error('Error downloading random dog images:', error);
        throw error;
    }
}
/**
 * Get a list of all saved dog images
 * @returns Array of paths to saved dog images (relative to public directory)
 */
export async function getSavedDogImages() {
    try {
        // Ensure the directory exists
        await ensureDogImagesDir();
        // Read the directory
        const files = await fsPromises.readdir(DOG_IMAGES_DIR);
        // Return the paths relative to the public directory
        return files.map(file => `/dogs/${file}`);
    }
    catch (error) {
        console.error('Error getting saved dog images:', error);
        return [];
    }
}
