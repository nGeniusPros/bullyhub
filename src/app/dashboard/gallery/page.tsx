'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Upload, 
  X, 
  ZoomIn, 
  Heart, 
  Tag, 
  Filter, 
  Grid, 
  LayoutGrid, 
  Plus,
  Share2,
  Download,
  Trash2,
  Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// Mock data for images
const mockImages = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
    title: 'Max at the park',
    description: 'Enjoying a sunny day at the dog park',
    tags: ['outdoor', 'park', 'summer'],
    uploadedAt: '2024-05-15',
    isFavorite: true,
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
    title: 'Luna\'s first birthday',
    description: 'Celebrating Luna\'s first birthday with a special treat',
    tags: ['birthday', 'celebration'],
    uploadedAt: '2024-04-22',
    isFavorite: false,
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1583337426008-2fef51aa2e8a',
    title: 'Rocky at the beach',
    description: 'First time at the beach, he loved the water!',
    tags: ['beach', 'water', 'vacation'],
    uploadedAt: '2024-03-10',
    isFavorite: true,
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1558349699-f8878747cf85',
    title: 'Max with his new toy',
    description: 'He absolutely loves this new squeaky toy',
    tags: ['toys', 'indoor', 'playtime'],
    uploadedAt: '2024-02-28',
    isFavorite: false,
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
    title: 'Luna napping',
    description: 'Afternoon nap in her favorite spot',
    tags: ['nap', 'indoor', 'cute'],
    uploadedAt: '2024-01-15',
    isFavorite: false,
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1583337426008-2fef51aa2e8a',
    title: 'Rocky\'s new collar',
    description: 'Showing off his stylish new collar',
    tags: ['fashion', 'accessories'],
    uploadedAt: '2023-12-20',
    isFavorite: true,
  },
];

// Mock data for collections
const mockCollections = [
  {
    id: '1',
    name: 'Outdoor Adventures',
    description: 'Photos of our dogs enjoying the great outdoors',
    coverImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
    imageCount: 12,
  },
  {
    id: '2',
    name: 'Birthday Celebrations',
    description: 'Special moments from birthday parties',
    coverImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
    imageCount: 8,
  },
  {
    id: '3',
    name: 'Vacation Memories',
    description: 'Photos from our trips and vacations',
    coverImage: 'https://images.unsplash.com/photo-1583337426008-2fef51aa2e8a',
    imageCount: 15,
  },
];

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'masonry'>('grid');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingTags, setEditingTags] = useState(false);
  const [newTag, setNewTag] = useState('');

  // All unique tags from images
  const allTags = Array.from(new Set(mockImages.flatMap(img => img.tags)));

  // Filtered images based on search and tags
  const filteredImages = mockImages.filter(image => {
    const matchesSearch = searchQuery === '' || 
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => image.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        setShowUploadDialog(false);
        // In a real app, you would upload the file to your server/storage here
      }, 1500);
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
            />
            <label htmlFor="image-upload">
              <Button variant="outline" className="cursor-pointer">
                Select Files
              </Button>
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageTitle">Title</Label>
          <Input id="imageTitle" placeholder="Enter a title for your image" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageDescription">Description</Label>
          <Textarea id="imageDescription" placeholder="Add a description" />
        </div>
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {allTags.map(tag => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox id={`tag-${tag}`} />
                <label htmlFor={`tag-${tag}`} className="text-sm">{tag}</label>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Add a new tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
            <Button variant="outline" onClick={() => setNewTag('')}>Add</Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="collection">Add to Collection</Label>
          <select id="collection" className="w-full p-2 border rounded-md">
            <option value="">Select a collection</option>
            {mockCollections.map(collection => (
              <option key={collection.id} value={collection.id}>{collection.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <Button disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    );
  };

  // Collection Form component
  const CollectionForm = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="collectionName">Collection Name</Label>
          <Input id="collectionName" placeholder="e.g., Outdoor Adventures" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="collectionDescription">Description</Label>
          <Textarea id="collectionDescription" placeholder="Add a description for this collection" />
        </div>
        <div className="space-y-2">
          <Label>Select Images</Label>
          <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
            {mockImages.map(image => (
              <div key={image.id} className="relative group">
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-20 object-cover rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                  <Checkbox id={`select-${image.id}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button>Create Collection</Button>
        </div>
      </div>
    );
  };

  // Image Detail component
  const ImageDetail = ({ image }: { image: any }) => {
    return (
      <div className="space-y-4">
        <div className="relative">
          <img 
            src={image.url} 
            alt={image.title} 
            className="w-full rounded-lg"
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-2 right-2 bg-background/80"
            onClick={() => {
              // Toggle favorite status
            }}
          >
            <Heart className={`h-4 w-4 ${image.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold">{image.title}</h2>
          <p className="text-sm text-muted-foreground">
            Uploaded on {new Date(image.uploadedAt).toLocaleDateString()}
          </p>
        </div>
        
        {image.description && (
          <p className="text-sm">{image.description}</p>
        )}
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Tags</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setEditingTags(!editingTags)}
            >
              {editingTags ? 'Done' : 'Edit'}
            </Button>
          </div>
          
          {editingTags ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag: string) => (
                  <div key={tag} className="flex items-center bg-muted px-2 py-1 rounded-full">
                    <span className="text-xs">{tag}</span>
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add a new tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
                <Button variant="outline" onClick={() => setNewTag('')}>Add</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {image.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">
            Manage and organize photos of your dogs
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload Images</DialogTitle>
                <DialogDescription>
                  Add new photos to your gallery
                </DialogDescription>
              </DialogHeader>
              <ImageUploadDialog />
            </DialogContent>
          </Dialog>
          <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Collection</DialogTitle>
                <DialogDescription>
                  Organize your photos into a new collection
                </DialogDescription>
              </DialogHeader>
              <CollectionForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="photos" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="photos">All Photos</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
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
              title={layout === 'grid' ? 'Switch to masonry layout' : 'Switch to grid layout'}
            >
              {layout === 'grid' ? <LayoutGrid className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <TabsContent value="photos" className="space-y-4">
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium">Filtered by:</span>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center"
                  >
                    {tag}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1"
                      onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </span>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-6"
                  onClick={() => setSelectedTags([])}
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex gap-4">
            <div className="w-full">
              {filteredImages.length > 0 ? (
                <div className={`grid gap-4 ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
                  {filteredImages.map((image) => (
                    <div 
                      key={image.id} 
                      className="group relative overflow-hidden rounded-lg cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image.url} 
                        alt={image.title} 
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-white font-medium truncate">{image.title}</h3>
                          <p className="text-white/80 text-sm truncate">{image.description}</p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          {image.isFavorite && (
                            <div className="bg-black/50 p-1.5 rounded-full">
                              <Heart className="h-4 w-4 text-white fill-white" />
                            </div>
                          )}
                          <div className="bg-black/50 p-1.5 rounded-full">
                            <ZoomIn className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No images found</p>
                  <Button variant="outline" className="mt-4" onClick={() => setShowUploadDialog(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="collections" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mockCollections.map((collection) => (
              <Card key={collection.id} className="overflow-hidden">
                <div className="relative h-40">
                  <img 
                    src={collection.coverImage} 
                    alt={collection.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/0 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-medium">{collection.name}</h3>
                      <p className="text-sm text-white/80">{collection.imageCount} photos</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
                  <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockImages.filter(img => img.isFavorite).map((image) => (
              <div 
                key={image.id} 
                className="group relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-medium truncate">{image.title}</h3>
                    <p className="text-white/80 text-sm truncate">{image.description}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="bg-black/50 p-1.5 rounded-full">
                      <Heart className="h-4 w-4 text-white fill-white" />
                    </div>
                    <div className="bg-black/50 p-1.5 rounded-full">
                      <ZoomIn className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
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
