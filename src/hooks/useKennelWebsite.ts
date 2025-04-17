"use client";

import { useState, useEffect } from "react";

export interface KennelWebsite {
  id: string;
  userId: string;
  kennelName: string;
  subdomain: string;
  template: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseKennelWebsiteReturn {
  website: KennelWebsite | null;
  loading: boolean;
  error: string | null;
  saveWebsite: (data: Partial<KennelWebsite>) => Promise<void>;
  publishWebsite: (publish: boolean) => Promise<void>;
}

export function useKennelWebsite(): UseKennelWebsiteReturn {
  const [website, setWebsite] = useState<KennelWebsite | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be an API call
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setWebsite({
          id: "website-1",
          userId: "user-1",
          kennelName: "Bulldog Haven",
          subdomain: "bulldoghaven",
          template: "professional-breeder",
          description: "We are a small family kennel specializing in healthy, well-socialized French Bulldogs.",
          contactEmail: "contact@bulldoghaven.com",
          contactPhone: "(555) 123-4567",
          location: "Seattle, WA",
          socialLinks: {
            facebook: "https://facebook.com/bulldoghaven",
            instagram: "https://instagram.com/bulldoghaven",
          },
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        setError(null);
      } catch (err) {
        console.error("Error fetching kennel website:", err);
        setError("Failed to load website data");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();
  }, []);

  const saveWebsite = async (data: Partial<KennelWebsite>) => {
    try {
      setLoading(true);
      // In a real implementation, this would be an API call
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWebsite(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...data,
          updatedAt: new Date().toISOString(),
        };
      });
      
      setError(null);
    } catch (err) {
      console.error("Error saving kennel website:", err);
      setError("Failed to save website data");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishWebsite = async (publish: boolean) => {
    try {
      setLoading(true);
      // In a real implementation, this would be an API call
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWebsite(prev => {
        if (!prev) return null;
        return {
          ...prev,
          published: publish,
          updatedAt: new Date().toISOString(),
        };
      });
      
      setError(null);
    } catch (err) {
      console.error("Error publishing kennel website:", err);
      setError("Failed to update website status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    website,
    loading,
    error,
    saveWebsite,
    publishWebsite,
  };
}
