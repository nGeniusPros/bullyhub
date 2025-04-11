'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DogImage from '@/components/DogImage';
import SocialMediaPost from '@/components/SocialMediaPost';

export default function DogApiDemo() {
  const [savedDogImages, setSavedDogImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch saved dog images on component mount
  useEffect(() => {
    async function fetchSavedDogImages() {
      try {
        const response = await fetch('/api/dog-images');
        if (response.ok) {
          const data = await response.json();
          setSavedDogImages(data.images || []);
        }
      } catch (error) {
        console.error('Error fetching saved dog images:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedDogImages();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dog API Integration Demo</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <Tabs defaultValue="component">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="component">DogImage Component</TabsTrigger>
          <TabsTrigger value="social">Social Media Integration</TabsTrigger>
          <TabsTrigger value="saved">Saved Dog Images</TabsTrigger>
        </TabsList>

        <TabsContent value="component" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Usage</CardTitle>
                <CardDescription>
                  The DogImage component automatically fetches a random dog image when no src is provided.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DogImage />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refreshable Image</CardTitle>
                <CardDescription>
                  Set the refreshable prop to true to allow users to fetch a new dog image.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DogImage refreshable={true} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Size</CardTitle>
                <CardDescription>
                  Customize the width and height of the dog image.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DogImage width={400} height={250} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>With Event Handler</CardTitle>
                <CardDescription>
                  Use the onImageChange callback to get the URL of the new image.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DogImage
                  refreshable={true}
                  onImageChange={(url) => {
                    console.log('New dog image URL:', url);
                  }}
                />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Check the console to see the image URL when a new image is loaded.
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Post with Dog API</CardTitle>
              <CardDescription>
                Create a social media post and add dog images from the Dog API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SocialMediaPost />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pre-downloaded Dog Images</CardTitle>
              <CardDescription>
                These images were downloaded from the Dog API and saved to the public/dogs directory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-md" />
                  ))}
                </div>
              ) : savedDogImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {savedDogImages.map((imagePath, index) => (
                    <DogImage key={index} src={imagePath} width={200} height={200} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="mb-4">No saved dog images found.</p>
                  <p className="text-sm text-muted-foreground">
                    Run <code>node scripts/download-dog-images.js</code> to download dog images.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
