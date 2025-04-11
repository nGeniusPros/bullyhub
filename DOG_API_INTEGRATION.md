# Dog API Integration

This document explains how to use the Dog API integration in the BullyHub project.

## API Key

The Dog API key is stored in the `.env.local` file as `DOG_API_KEY`. If not provided, the system will use a default key:

```
DOG_API_KEY=live_QTXVxRVbZz6jjQf6FeSGiy6NMoN1eS3Ez10bY2mmbyIwJWqIyRMqVtFAYgmAO56N
```

## Components

### DogImage Component

The `DogImage` component provides an easy way to display dog images from the Dog API.

```tsx
import DogImage from '@/components/DogImage';

// Basic usage - automatically fetches a random dog image
<DogImage />

// With a specific image source
<DogImage src="/path/to/image.jpg" />

// Custom size
<DogImage width={400} height={300} />

// Refreshable - adds a button to fetch a new random image
<DogImage refreshable={true} />

// With image change callback
<DogImage 
  refreshable={true} 
  onImageChange={(newSrc) => console.log('New image:', newSrc)} 
/>
```

### SocialMediaPost Component

The `SocialMediaPost` component now includes a button to add dog images from the Dog API.

```tsx
import SocialMediaPost from '@/components/SocialMediaPost';

// Basic usage
<SocialMediaPost />

// With initial images
<SocialMediaPost initialImages={['/path/to/image1.jpg', '/path/to/image2.jpg']} />

// With dog ID
<SocialMediaPost dogId="dog-123" />
```

## Utility Functions

The project includes utility functions for working with the Dog API in `src/lib/dog-api.ts`:

### Fetch Random Dog Images

```typescript
import { fetchRandomDogImages } from '@/lib/dog-api';

// Fetch one random dog image
const [dogImage] = await fetchRandomDogImages();
console.log(dogImage.url);

// Fetch multiple random dog images
const dogImages = await fetchRandomDogImages(5);
dogImages.forEach(image => console.log(image.url));
```

### Download Dog Images

```typescript
import { downloadDogImage, downloadRandomDogImages } from '@/lib/dog-api';

// Download a specific dog image
const imagePath = await downloadDogImage('https://example.com/dog.jpg');
console.log('Image saved to:', imagePath);

// Download multiple random dog images
const imagePaths = await downloadRandomDogImages(5);
console.log('Images saved to:', imagePaths);
```

### Get Saved Dog Images

```typescript
import { getSavedDogImages } from '@/lib/dog-api';

// Get all saved dog images
const imagePaths = await getSavedDogImages();
console.log('Saved dog images:', imagePaths);
```

## Scripts

### Download Dog Images Script

The project includes a script to download random dog images from the Dog API and save them to the `public/dogs` directory.

```bash
# Download 10 dog images (default)
node scripts/download-dog-images.js

# Download a specific number of dog images
node scripts/download-dog-images.js 20
```

## API Routes

### GET /api/dog-images

Returns a list of all dog images saved in the `public/dogs` directory.

```typescript
// Example response
{
  "images": [
    "/dogs/dog-1234567890-123.jpg",
    "/dogs/dog-1234567890-456.jpg"
  ]
}
```

## Demo Page

A demo page is available at `/dog-api-demo` that showcases the various ways to use the Dog API integration:

1. Using the `DogImage` component
2. Using the `SocialMediaPost` component with Dog API integration
3. Displaying pre-downloaded dog images

Visit this page to see examples of how to use the Dog API integration in your project.
