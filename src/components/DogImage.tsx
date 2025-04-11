import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface DogImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  refreshable?: boolean;
  onImageChange?: (newSrc: string) => void;
}

export default function DogImage({
  src,
  alt = 'Dog image',
  width = 300,
  height = 300,
  className = '',
  refreshable = false,
  onImageChange,
}: DogImageProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);
  const [isLoading, setIsLoading] = useState<boolean>(!src);
  const [error, setError] = useState<string | null>(null);

  // Fetch a random dog image if no src is provided
  useEffect(() => {
    if (!src) {
      fetchRandomDogImage();
    } else {
      setImageSrc(src);
      setIsLoading(false);
    }
  }, [src]);

  const fetchRandomDogImage = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://api.thedogapi.com/v1/images/search?limit=1', {
        headers: {
          'x-api-key': 'live_QTXVxRVbZz6jjQf6FeSGiy6NMoN1eS3Ez10bY2mmbyIwJWqIyRMqVtFAYgmAO56N'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dog image');
      }
      
      const data = await response.json();
      
      if (data && data[0] && data[0].url) {
        setImageSrc(data[0].url);
        if (onImageChange) {
          onImageChange(data[0].url);
        }
      } else {
        throw new Error('No image returned from Dog API');
      }
    } catch (error) {
      console.error('Error fetching dog image:', error);
      setError('Failed to load dog image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading ? (
        <Skeleton className="w-full h-full min-h-[200px]" />
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-4 border border-red-300 bg-red-50 rounded-md">
          <p className="text-red-500 mb-2">{error}</p>
          <Button variant="outline" onClick={fetchRandomDogImage}>
            Try Again
          </Button>
        </div>
      ) : imageSrc ? (
        <div className="relative">
          <Image
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            className="rounded-md object-cover"
          />
          {refreshable && (
            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
              onClick={fetchRandomDogImage}
            >
              New Dog
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center p-4 border border-gray-300 bg-gray-50 rounded-md">
          <Button variant="outline" onClick={fetchRandomDogImage}>
            Load Dog Image
          </Button>
        </div>
      )}
    </div>
  );
}
