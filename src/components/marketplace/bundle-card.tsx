"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Tag, Star } from "lucide-react";
import { Bundle } from "@/hooks/useMarketplace";
import { formatCurrency } from "@/lib/utils";

interface BundleCardProps {
  bundle: Bundle;
  onBuyNow: (bundleId: string) => void;
}

export function BundleCard({ bundle, onBuyNow }: BundleCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {bundle.image ? (
          <img
            src={bundle.image}
            alt={bundle.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {bundle.featured && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 bg-blue-500 text-white"
          >
            <Star className="mr-1 h-3 w-3" />
            Featured
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-white/20 text-white">
              {bundle.items.length} items
            </Badge>
            <Badge variant="outline" className="bg-green-500/80 text-white">
              Save {bundle.discountPercentage}%
            </Badge>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="line-clamp-1 font-semibold">{bundle.title}</h3>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {formatCurrency(bundle.price)}
            </div>
            <div className="text-xs text-muted-foreground line-through">
              {formatCurrency(bundle.originalPrice)}
            </div>
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-gray-600">
          {bundle.description}
        </p>
      </CardContent>
      <CardFooter className="border-t p-4 pt-2">
        <div className="w-full space-y-2">
          <div className="flex flex-wrap gap-1">
            {bundle.items.slice(0, 3).map((item) => (
              <Badge key={item.id} variant="outline" className="bg-gray-100">
                {item.title}
              </Badge>
            ))}
            {bundle.items.length > 3 && (
              <Badge variant="outline" className="bg-gray-100">
                +{bundle.items.length - 3} more
              </Badge>
            )}
          </div>
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            onClick={() => onBuyNow(bundle.id)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy Bundle
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
