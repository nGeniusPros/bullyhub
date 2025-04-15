"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Upload,
  Search,
  Grid3X3,
  LayoutGrid,
  Heart,
  ZoomIn,
  ArrowLeft,
} from "lucide-react";

interface Dog {
  id: string;
  name: string;
  breed: string;
  color: string;
  profileImageUrl?: string;
}

import { GalleryImage, GalleryImageUploadData } from "@/features/gallery/types";
import { useGalleryQueries } from "@/features/gallery/data/queries";

export default function DogGalleryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [dog, setDog] = useState<Dog | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<"grid" | "masonry">("grid");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get the gallery queries
  const galleryQueries = useGalleryQueries();

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const response = await fetch(`/api/dogs/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch dog");
        }
        const data = await response.json();
        setDog(data);
      } catch (error) {
        console.error("Error fetching dog:", error);
        toast.error("Failed to load dog profile");
      }
    };

    const fetchImages = async () => {
      try {
        const data = await galleryQueries.getDogImages(params.id);
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
        toast.error("Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
    fetchImages();
  }, [params.id, galleryQueries]);

  const filteredImages = images.filter(
    (image) =>
      image.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);

      try {
        // Upload each file using the gallery queries
        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files[i];

          const uploadData: GalleryImageUploadData = {
            dog_id: params.id,
            title: "",
            description: "",
            tags: [],
            is_public: true,
            file: file
          };

          await galleryQueries.uploadImage(uploadData);
        }

        // Refresh images
        const updatedImages = await galleryQueries.getDogImages(params.id);
        setImages(updatedImages);

        toast.success("Images uploaded successfully");
        setShowUploadDialog(false);
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error("Failed to upload images");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Image Upload Dialog component
  const ImageUploadDialog = () => {
    return (
      <div className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-1">Drag and drop your images</h3>
            <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
            <Input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              id="image-upload"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <label htmlFor="image-upload">
              <Button variant="outline" className="cursor-pointer" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                    Uploading...
                  </>
                ) : (
                  "Select Files"
                )}
              </Button>
            </label>
          </div>
        </div>
      </div>
    );
  };

  // Image Detail component
  const ImageDetail = ({ image }: { image: GalleryImage }) => {
    return (
      <div className="space-y-4">
        <div className="rounded-md overflow-hidden">
          <img
            src={image.url}
            alt={image.title}
            className="w-full object-contain max-h-[500px]"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{image.title || "Untitled"}</h3>
          <p className="text-sm text-muted-foreground">
            Added on {new Date(image.created_at).toLocaleDateString()}
          </p>
          {image.description && (
            <p className="text-sm">{image.description}</p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Dog Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The dog you're looking for doesn't exist or you don't have permission
          to view it.
        </p>
        <Link href="/dashboard/dogs">
          <Button>Back to My Dogs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{dog.name}'s Gallery</h1>
          <p className="text-muted-foreground">
            Manage and organize photos of {dog.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/dogs/${params.id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload Images</DialogTitle>
                <DialogDescription>
                  Add new photos to {dog.name}'s gallery
                </DialogDescription>
              </DialogHeader>
              <ImageUploadDialog />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search photos..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLayout(layout === 'grid' ? 'masonry' : 'grid')}
          >
            {layout === 'grid' ? (
              <Grid3X3 className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-1">No images found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery
              ? "No images match your search criteria"
              : `Upload photos of ${dog.name} to get started`}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowUploadDialog(true)}>
              Upload Images
            </Button>
          )}
        </div>
      ) : (
        <div className={`grid gap-4 ${
          layout === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
        }`}>
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.title || "Dog photo"}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-medium truncate">
                    {image.title || "Untitled"}
                  </h3>
                  <p className="text-white/80 text-sm truncate">{image.description}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="bg-black/50 p-1.5 rounded-full">
                    <Heart className={`h-4 w-4 text-white ${image.is_favorite ? 'fill-white' : ''}`} />
                  </div>
                  <div className="bg-black/50 p-1.5 rounded-full">
                    <ZoomIn className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Detail Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Image Details</DialogTitle>
            </DialogHeader>
            <ImageDetail image={selectedImage} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
