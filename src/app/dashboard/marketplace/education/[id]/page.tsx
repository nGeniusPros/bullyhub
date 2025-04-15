"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Share2,
  Printer,
} from "lucide-react";
import { useMarketplace } from "@/hooks/useMarketplace";
import { EducationalContentReference } from "@/types";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function EducationalContentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { educationalContent, loading, error, fetchEducationalContent } = useMarketplace();

  // Find the current content
  const content = educationalContent.find(item => item.id === params.id);

  // Fetch educational content on component mount
  useEffect(() => {
    fetchEducationalContent();
  }, [fetchEducationalContent]);

  const getIcon = (type: string | undefined) => {
    switch (type) {
      case "video":
        return <Video className="h-8 w-8" />;
      case "article":
        return <FileText className="h-8 w-8" />;
      case "guide":
      default:
        return <BookOpen className="h-8 w-8" />;
    }
  };

  const getTypeLabel = (type: string | undefined) => {
    switch (type) {
      case "video":
        return "Video";
      case "article":
        return "Article";
      case "guide":
      default:
        return "Guide";
    }
  };

  const handleOpenContent = () => {
    if (content?.url) {
      window.open(content.url, '_blank');
    }
  };

  const handleShare = () => {
    toast({
      title: "Content Shared",
      description: "Link copied to clipboard",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container mx-auto flex h-96 items-center justify-center px-4 py-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex h-96 flex-col items-center justify-center gap-4 px-4 py-6 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Error Loading Content</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => fetchEducationalContent()}>Try Again</Button>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container mx-auto flex h-96 flex-col items-center justify-center gap-4 px-4 py-6 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Content Not Found</h2>
        <p className="text-muted-foreground">The educational content you're looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard/marketplace">
          <Button>Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/marketplace")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Educational Content</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{content.title}</CardTitle>
                  <CardDescription className="mt-2">
                    <Badge variant="outline" className="capitalize">
                      {getTypeLabel(content.type)}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {getIcon(content.type)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {content.type === "video" && content.url ? (
                <div className="mb-6 overflow-hidden rounded-lg border bg-gray-100">
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <Video className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-gray-600">Video content available externally</p>
                      <Button 
                        className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                        onClick={handleOpenContent}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Watch Video
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  {content.content ? (
                    <div className="whitespace-pre-line">{content.content}</div>
                  ) : (
                    <div className="flex h-64 items-center justify-center text-center">
                      <div>
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-gray-600">Content available externally</p>
                        {content.url && (
                          <Button 
                            className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                            onClick={handleOpenContent}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Content
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-gray-50 p-4">
              <div className="flex w-full justify-end gap-2">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                {content.content && (
                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                )}
                {content.url && (
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    onClick={handleOpenContent}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open External Link
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Related Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {educationalContent
                .filter(item => item.id !== content.id)
                .slice(0, 3)
                .map(item => (
                  <Link key={item.id} href={`/dashboard/marketplace/education/${item.id}`}>
                    <div className="flex gap-3 rounded-md p-2 transition-colors hover:bg-accent">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="line-clamp-1 font-medium">{item.title}</h4>
                        <Badge variant="outline" className="mt-1 capitalize text-xs">
                          {getTypeLabel(item.type)}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              {educationalContent.filter(item => item.id !== content.id).length === 0 && (
                <p className="text-sm text-muted-foreground">No related content found</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/marketplace">
                <Button variant="outline" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse All Resources
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
