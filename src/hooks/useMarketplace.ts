"use client";

import { useState, useEffect } from "react";

// Types
export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  subcategory?: string;
  brand?: string;
  condition?: string;
  images?: string[];
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
  };
  location?: string;
  shippingOptions?: {
    id: string;
    name: string;
    price: number;
  }[];
  affiliateLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
  featured?: boolean;
}

export interface Bundle {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  originalPrice: number;
  image?: string;
  items: {
    id: string;
    title: string;
    price: number;
    image?: string;
  }[];
  featured?: boolean;
}

export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  content?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  type: "article" | "video" | "guide";
  thumbnail?: string;
  price?: number;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
  readTime?: number;
  videoLength?: number;
}

// Mock data
const mockCategories: Category[] = [
  { id: "1", name: "Breeding Supplies", iconName: "Baby", featured: true },
  { id: "2", name: "Kennel Equipment", iconName: "Home" },
  { id: "3", name: "Health & Wellness", iconName: "Heart" },
  { id: "4", name: "Grooming", iconName: "Scissors" },
  { id: "5", name: "Training", iconName: "Target" },
  { id: "6", name: "Product Bundles", iconName: "Package", featured: true },
  { id: "7", name: "Educational Resources", iconName: "BookOpen" },
];

const mockListings: Listing[] = [
  {
    id: "1",
    title: "Premium Whelping Box",
    description: "High-quality whelping box with removable rails and waterproof floor.",
    price: 249.99,
    category: "Breeding Supplies",
    subcategory: "Whelping Supplies",
    brand: "PetPals Pro",
    condition: "New",
    images: [
      "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=500&h=350&q=80",
    ],
    seller: {
      id: "s1",
      name: "Premium Kennel Supplies",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 4.8,
    },
    location: "Portland, OR",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Digital Puppy Scale",
    description: "Accurate digital scale for weighing puppies. Battery operated with tare function.",
    price: 89.99,
    category: "Breeding Supplies",
    subcategory: "Monitoring Equipment",
    brand: "PetWeigh",
    condition: "New",
    images: [
      "https://images.unsplash.com/photo-1594918195019-e5e19c499519?w=500&h=350&q=80",
    ],
    seller: {
      id: "s2",
      name: "Breeder's Essentials",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 4.9,
    },
    affiliateLink: "https://example.com/affiliate/digital-scale",
    createdAt: "2023-05-20T14:45:00Z",
    updatedAt: "2023-05-20T14:45:00Z",
  },
  {
    id: "3",
    title: "Professional Grooming Clippers",
    description: "Cordless professional-grade clippers with multiple blade attachments.",
    price: 129.99,
    category: "Grooming",
    subcategory: "Clippers",
    brand: "GroomMaster",
    condition: "New",
    images: [
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=350&q=80",
    ],
    seller: {
      id: "s3",
      name: "Pro Grooming Supplies",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      rating: 4.7,
    },
    location: "Chicago, IL",
    createdAt: "2023-05-25T09:15:00Z",
    updatedAt: "2023-05-25T09:15:00Z",
  },
  {
    id: "4",
    title: "Kennel Disinfectant (Gallon)",
    description: "Hospital-grade disinfectant safe for kennels and whelping areas.",
    price: 34.99,
    category: "Kennel Equipment",
    subcategory: "Cleaning Supplies",
    brand: "KennelClean",
    condition: "New",
    images: [
      "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&h=350&q=80",
    ],
    seller: {
      id: "s1",
      name: "Premium Kennel Supplies",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 4.8,
    },
    affiliateLink: "https://example.com/affiliate/kennel-disinfectant",
    createdAt: "2023-06-01T11:20:00Z",
    updatedAt: "2023-06-01T11:20:00Z",
  },
  {
    id: "5",
    title: "Puppy Milk Replacer",
    description: "Premium milk replacer for orphaned or rejected puppies. Contains essential nutrients.",
    price: 29.99,
    category: "Breeding Supplies",
    subcategory: "Nutrition",
    brand: "NutriPup",
    condition: "New",
    images: [
      "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500&h=350&q=80",
    ],
    seller: {
      id: "s2",
      name: "Breeder's Essentials",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 4.9,
    },
    location: "Denver, CO",
    createdAt: "2023-06-05T16:30:00Z",
    updatedAt: "2023-06-05T16:30:00Z",
  },
  {
    id: "6",
    title: "Portable Dog Pen",
    description: "Collapsible exercise pen for puppies or adult dogs. Indoor/outdoor use.",
    price: 79.99,
    category: "Kennel Equipment",
    subcategory: "Containment",
    brand: "PetZone",
    condition: "New",
    images: [
      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500&h=350&q=80",
    ],
    seller: {
      id: "s3",
      name: "Pro Grooming Supplies",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      rating: 4.7,
    },
    affiliateLink: "https://example.com/affiliate/portable-pen",
    createdAt: "2023-06-10T13:45:00Z",
    updatedAt: "2023-06-10T13:45:00Z",
  },
  {
    id: "7",
    title: "Breeding Record Book",
    description: "Comprehensive breeding log book with sections for pedigrees, health records, and litter information.",
    price: 24.99,
    category: "Breeding Supplies",
    subcategory: "Record Keeping",
    brand: "BreederLog",
    condition: "New",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=350&q=80",
    ],
    seller: {
      id: "s1",
      name: "Premium Kennel Supplies",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 4.8,
    },
    location: "Seattle, WA",
    createdAt: "2023-06-15T10:00:00Z",
    updatedAt: "2023-06-15T10:00:00Z",
  },
  {
    id: "8",
    title: "Microchip Scanner",
    description: "Universal microchip scanner compatible with all standard pet microchips.",
    price: 149.99,
    category: "Health & Wellness",
    subcategory: "Identification",
    brand: "ChipScan",
    condition: "New",
    images: [
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500&h=350&q=80",
    ],
    seller: {
      id: "s2",
      name: "Breeder's Essentials",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 4.9,
    },
    affiliateLink: "https://example.com/affiliate/microchip-scanner",
    createdAt: "2023-06-20T15:15:00Z",
    updatedAt: "2023-06-20T15:15:00Z",
  },
];

const mockBundles: Bundle[] = [
  {
    id: "b1",
    title: "Whelping Starter Kit",
    description: "Everything you need for whelping and early puppy care.",
    price: 299.99,
    discountPercentage: 15,
    originalPrice: 352.95,
    image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=500&h=350&q=80",
    items: [
      { id: "1", title: "Premium Whelping Box", price: 249.99, image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=500&h=350&q=80" },
      { id: "2", title: "Digital Puppy Scale", price: 89.99, image: "https://images.unsplash.com/photo-1594918195019-e5e19c499519?w=500&h=350&q=80" },
      { id: "5", title: "Puppy Milk Replacer", price: 29.99, image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500&h=350&q=80" },
    ],
    featured: true,
  },
  {
    id: "b2",
    title: "Kennel Cleaning Bundle",
    description: "Professional-grade cleaning and disinfecting products for your kennel.",
    price: 79.99,
    discountPercentage: 10,
    originalPrice: 88.97,
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&h=350&q=80",
    items: [
      { id: "4", title: "Kennel Disinfectant (Gallon)", price: 34.99, image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&h=350&q=80" },
      { id: "9", title: "Microfiber Cleaning Cloths (12pk)", price: 19.99, image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&h=350&q=80" },
      { id: "10", title: "Kennel Scrub Brush", price: 14.99, image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&h=350&q=80" },
      { id: "11", title: "Odor Eliminator Spray", price: 18.99, image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&h=350&q=80" },
    ],
  },
  {
    id: "b3",
    title: "Grooming Essentials Kit",
    description: "Professional grooming tools for maintaining your dogs' coats.",
    price: 199.99,
    discountPercentage: 12,
    originalPrice: 227.96,
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=350&q=80",
    items: [
      { id: "3", title: "Professional Grooming Clippers", price: 129.99, image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=350&q=80" },
      { id: "12", title: "Slicker Brush Set", price: 34.99, image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=350&q=80" },
      { id: "13", title: "Professional Grooming Scissors", price: 42.99, image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=350&q=80" },
      { id: "14", title: "Nail Clippers", price: 19.99, image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=350&q=80" },
    ],
    featured: true,
  },
];

const mockEducationalContent: EducationalContent[] = [
  {
    id: "e1",
    title: "Complete Guide to Whelping",
    description: "A comprehensive guide to preparing for and managing the whelping process.",
    content: "This guide covers everything from preparing your whelping area to handling complications...",
    author: {
      id: "a1",
      name: "Dr. Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    type: "guide",
    thumbnail: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=500&h=350&q=80",
    price: 29.99,
    isFree: false,
    createdAt: "2023-04-10T09:00:00Z",
    updatedAt: "2023-04-10T09:00:00Z",
    readTime: 45,
  },
  {
    id: "e2",
    title: "Puppy Socialization: The First 16 Weeks",
    description: "Learn how to properly socialize puppies during the critical developmental period.",
    content: "The first 16 weeks of a puppy's life are crucial for socialization...",
    author: {
      id: "a2",
      name: "Mark Wilson",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    type: "article",
    thumbnail: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=350&q=80",
    isFree: true,
    createdAt: "2023-04-15T14:30:00Z",
    updatedAt: "2023-04-15T14:30:00Z",
    readTime: 15,
  },
  {
    id: "e3",
    title: "Genetic Health Testing Explained",
    description: "Understanding genetic health tests and their importance in breeding programs.",
    content: "This video explains the different types of genetic health tests available...",
    author: {
      id: "a3",
      name: "Dr. Emily Chen",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&h=350&q=80",
    price: 19.99,
    isFree: false,
    createdAt: "2023-04-20T11:15:00Z",
    updatedAt: "2023-04-20T11:15:00Z",
    videoLength: 32,
  },
  {
    id: "e4",
    title: "Nutrition for Breeding Dogs",
    description: "Dietary requirements for breeding dogs before, during, and after pregnancy.",
    content: "Proper nutrition is essential for breeding dogs...",
    author: {
      id: "a1",
      name: "Dr. Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    type: "article",
    thumbnail: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500&h=350&q=80",
    isFree: true,
    createdAt: "2023-04-25T16:45:00Z",
    updatedAt: "2023-04-25T16:45:00Z",
    readTime: 20,
  },
  {
    id: "e5",
    title: "Advanced Breeding Program Management",
    description: "Strategies for developing and maintaining a successful breeding program.",
    content: "This comprehensive guide covers breeding selection, genetic diversity...",
    author: {
      id: "a2",
      name: "Mark Wilson",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    type: "guide",
    thumbnail: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=500&h=350&q=80",
    price: 49.99,
    isFree: false,
    createdAt: "2023-05-01T10:30:00Z",
    updatedAt: "2023-05-01T10:30:00Z",
    readTime: 60,
  },
  {
    id: "e6",
    title: "Puppy Growth & Development Milestones",
    description: "Understanding the physical and behavioral development of puppies from birth to maturity.",
    content: "This video series documents the key developmental milestones...",
    author: {
      id: "a3",
      name: "Dr. Emily Chen",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1583511655826-05700442b31b?w=500&h=350&q=80",
    isFree: true,
    createdAt: "2023-05-05T13:15:00Z",
    updatedAt: "2023-05-05T13:15:00Z",
    videoLength: 45,
  },
];

export function useMarketplace() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [educationalContent, setEducationalContent] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch listings
  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // await fetch('/api/marketplace/listings')
      setTimeout(() => {
        setListings(mockListings);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Failed to fetch listings");
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // await fetch('/api/marketplace/categories')
      setTimeout(() => {
        setCategories(mockCategories);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Failed to fetch categories");
      setLoading(false);
    }
  };

  // Fetch bundles
  const fetchBundles = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // await fetch('/api/marketplace/bundles')
      setTimeout(() => {
        setBundles(mockBundles);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Failed to fetch bundles");
      setLoading(false);
    }
  };

  // Fetch educational content
  const fetchEducationalContent = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // await fetch('/api/marketplace/educational-content')
      setTimeout(() => {
        setEducationalContent(mockEducationalContent);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Failed to fetch educational content");
      setLoading(false);
    }
  };

  // Add a new listing
  const addListing = async (formData: any) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // await fetch('/api/marketplace/listings', { method: 'POST', body: JSON.stringify(formData) })
      
      // Create a new listing with the form data
      const newListing: Listing = {
        id: `new-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        subcategory: formData.subcategory,
        brand: formData.brand,
        condition: formData.condition,
        images: formData.images,
        seller: {
          id: "current-user", // In a real app, this would be the current user's ID
          name: "Current User", // In a real app, this would be the current user's name
          rating: 5.0,
        },
        location: formData.location,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add the new listing to the listings array
      setListings([...listings, newListing]);
      setLoading(false);
      return newListing;
    } catch (err) {
      setError("Failed to add listing");
      setLoading(false);
      throw err;
    }
  };

  // Make an offer on a listing
  const makeOffer = async (listingId: string, offerAmount: number, message?: string) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // await fetch('/api/marketplace/offers', { 
      //   method: 'POST', 
      //   body: JSON.stringify({ listingId, offerAmount, message }) 
      // })
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoading(false);
      return { success: true, message: "Offer submitted successfully" };
    } catch (err) {
      setError("Failed to make offer");
      setLoading(false);
      throw err;
    }
  };

  // Load initial data
  useEffect(() => {
    fetchListings();
    fetchCategories();
    fetchBundles();
    fetchEducationalContent();
  }, []);

  return {
    listings,
    categories,
    bundles,
    educationalContent,
    loading,
    error,
    fetchListings,
    fetchCategories,
    fetchBundles,
    fetchEducationalContent,
    addListing,
    makeOffer,
  };
}
