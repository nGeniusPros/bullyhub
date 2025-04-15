"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageCircle, Info, Tag } from "lucide-react";
import { Listing } from "@/hooks/useMarketplace";
import { formatCurrency } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
  onMakeOffer: (listingId: string) => void;
}

export function ListingCard({ listing, onMakeOffer }: ListingCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <Tag className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {listing.condition && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 bg-black/60 text-white"
          >
            {listing.condition}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="line-clamp-1 font-semibold">{listing.title}</h3>
            <p className="text-sm text-muted-foreground">{listing.category}</p>
          </div>
          <div className="text-lg font-bold text-primary">
            {formatCurrency(listing.price)}
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-gray-600">
          {listing.description || "No description provided."}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 border-t p-4 pt-2">
        {listing.affiliateLink ? (
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            onClick={() => window.open(listing.affiliateLink, "_blank")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy Now
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onMakeOffer(listing.id)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Offer
            </Button>
            <Link href={`/dashboard/marketplace/${listing.id}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Info className="mr-2 h-4 w-4" />
                Details
              </Button>
            </Link>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
