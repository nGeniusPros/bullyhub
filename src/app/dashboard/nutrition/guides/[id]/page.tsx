"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";
import { NutritionGuide } from "@/types";
import ReactMarkdown from "react-markdown";

export default function NutritionGuidePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [guide, setGuide] = useState<NutritionGuide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        // In a real implementation, we would fetch from the API
        // For now, we'll fetch all guides and filter
        const response = await fetch("/api/nutrition/guides");
        if (!response.ok) {
          throw new Error("Failed to fetch nutrition guides");
        }
        
        const guides = await response.json();
        const foundGuide = guides.find((g: NutritionGuide) => g.id === params.id);
        
        if (foundGuide) {
          setGuide(foundGuide);
        } else {
          toast.error("Guide not found");
          router.push("/dashboard/nutrition");
        }
      } catch (error) {
        console.error("Error fetching guide:", error);
        toast.error("Failed to load guide");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuide();
  }, [params.id, router]);

  // Function to get guide category badge
  const getGuideCategoryBadge = (category: string) => {
    switch (category) {
      case "puppy":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Puppy</Badge>;
      case "adult":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Adult</Badge>;
      case "senior":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Senior</Badge>;
      case "special-needs":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Special Needs</Badge>;
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Guide Not Found</h1>
        <p className="text-muted-foreground mb-6">The nutrition guide you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/dashboard/nutrition")}>Back to Nutrition</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{guide.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">{guide.description}</p>
            {getGuideCategoryBadge(guide.category)}
          </div>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/nutrition")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none dark:prose-invert">
            <ReactMarkdown>{guide.content}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BookOpen className="h-4 w-4" />
        <span>Last updated: {new Date(guide.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
