"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, FileText, Clock, DollarSign, ShoppingCart, Lock } from "lucide-react";
import { EducationalContent } from "@/hooks/useMarketplace";
import { formatCurrency } from "@/lib/utils";

interface EducationalContentCardProps {
  content: EducationalContent;
}

export function EducationalContentCard({ content }: EducationalContentCardProps) {
  const getTypeIcon = () => {
    switch (content.type) {
      case "article":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "guide":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (content.type) {
      case "article":
        return "Article";
      case "video":
        return "Video";
      case "guide":
        return "Guide";
      default:
        return "Content";
    }
  };

  const getDurationLabel = () => {
    if (content.readTime) {
      return `${content.readTime} min read`;
    }
    if (content.videoLength) {
      return `${content.videoLength} min video`;
    }
    return null;
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {content.thumbnail ? (
          <img
            src={content.thumbnail}
            alt={content.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            {getTypeIcon()}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-white/20 text-white"
            >
              {getTypeIcon()}
              {getTypeLabel()}
            </Badge>
            {content.isFree ? (
              <Badge variant="outline" className="bg-green-500/80 text-white">
                Free
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-blue-500/80 text-white">
                Premium
              </Badge>
            )}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="line-clamp-1 font-semibold">{content.title}</h3>
          {!content.isFree && (
            <div className="text-lg font-bold text-primary">
              {formatCurrency(content.price || 0)}
            </div>
          )}
        </div>
        <p className="line-clamp-2 text-sm text-gray-600 mb-2">
          {content.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <img
              src={content.author.avatar || "https://via.placeholder.com/24"}
              alt={content.author.name}
              className="h-5 w-5 rounded-full"
            />
            {content.author.name}
          </div>
          {getDurationLabel() && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getDurationLabel()}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t p-4 pt-2">
        <Link
          href={`/dashboard/marketplace/education/${content.id}`}
          className="w-full"
        >
          <Button
            className={`w-full ${
              content.isFree
                ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            }`}
          >
            {content.isFree ? (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                Read Now
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Purchase
              </>
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
