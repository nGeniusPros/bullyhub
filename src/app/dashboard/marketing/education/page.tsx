"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  FileText,
  Video,
  Image as ImageIcon,
  BarChart,
  Sparkles,
  Clock,
  Eye,
  Share2,
  Tag,
  Loader2,
  AlertCircle,
  Users,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEducationalContent } from "@/hooks/useEducationalContent";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EducationalContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { content, loading, error, fetchContent } = useEducationalContent();

  // Filter content based on active tab and search term
  const filteredContent = content.filter((item) => {
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "articles" && item.contentType === "article") ||
      (activeTab === "videos" && item.contentType === "video") ||
      (activeTab === "graphics" && (item.contentType === "graphic" || item.contentType === "infographic")) ||
      (activeTab === "drafts" && item.status === "draft") ||
      (activeTab === "published" && item.status === "published");
    
    const matchesSearch = 
      searchTerm === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    return matchesTab && matchesSearch;
  });

  // Get content type icon
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "article":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "graphic":
      case "infographic":
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">
            Draft
          </Badge>
        );
      case "published":
        return (
          <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
            Published
          </Badge>
        );
      case "archived":
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-300 bg-gray-50">
            Archived
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Educational Content</h1>
        <p className="text-muted-foreground">
          Create and manage educational content for your clients and website
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-medium">Error</h3>
            </div>
            <p>{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => fetchContent()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search content..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button>
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Link href="/dashboard/marketing/education/new">
                <Button variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Content
                </Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="graphics">Graphics</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredContent.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
                {filteredContent.length === 0 && (
                  <div className="text-center py-10 col-span-3">
                    <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No content found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="articles" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredContent.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
                {filteredContent.length === 0 && (
                  <div className="text-center py-10 col-span-3">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No articles found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or create a new article.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredContent.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
                {filteredContent.length === 0 && (
                  <div className="text-center py-10 col-span-3">
                    <Video className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No videos found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or create a new video.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="graphics" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredContent.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
                {filteredContent.length === 0 && (
                  <div className="text-center py-10 col-span-3">
                    <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No graphics found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or create a new graphic.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="drafts" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredContent.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
                {filteredContent.length === 0 && (
                  <div className="text-center py-10 col-span-3">
                    <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No drafts found</h3>
                    <p className="text-sm text-muted-foreground">
                      All your draft content will appear here.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="published" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredContent.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
                {filteredContent.length === 0 && (
                  <div className="text-center py-10 col-span-3">
                    <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No published content found</h3>
                    <p className="text-sm text-muted-foreground">
                      Publish your content to make it available to your audience.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function ContentCard({ content }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {content.thumbnailUrl ? (
          <img 
            src={content.thumbnailUrl} 
            alt={content.title} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            {content.contentType === "article" ? (
              <FileText className="h-12 w-12 text-muted-foreground" />
            ) : content.contentType === "video" ? (
              <Video className="h-12 w-12 text-muted-foreground" />
            ) : (
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {getContentTypeIcon(content.contentType)}
            {getStatusBadge(content.status)}
            {content.aiGenerated && (
              <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50">
                <Sparkles className="mr-1 h-3 w-3" />
                AI Generated
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg mt-2">{content.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {content.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {content.tags && content.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          {content.readingTime && (
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>{content.readingTime} min read</span>
            </div>
          )}
          {content.viewCount && (
            <div className="flex items-center">
              <Eye className="mr-1 h-4 w-4" />
              <span>{content.viewCount} views</span>
            </div>
          )}
          {content.targetAudience && (
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>
                {content.targetAudience === "pet_owners" ? "Pet Owners" :
                 content.targetAudience === "breeders" ? "Breeders" :
                 content.targetAudience === "veterinarians" ? "Vets" : "General"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="text-xs text-muted-foreground">
            {content.publishedAt ? (
              <span>Published {format(new Date(content.publishedAt), "MMM d, yyyy")}</span>
            ) : (
              <span>Updated {format(new Date(content.updatedAt), "MMM d, yyyy")}</span>
            )}
          </div>
        </div>
        <Link href={`/dashboard/marketing/education/${content.id}`}>
          <Button size="sm" variant="ghost">View</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
