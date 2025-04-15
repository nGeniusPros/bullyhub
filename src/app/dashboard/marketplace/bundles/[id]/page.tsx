"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  Package,
  Tag,
  Percent,
  ShoppingCart,
  Loader2,
  AlertCircle,
  ListChecks,
  Info,
} from "lucide-react";
import { useMarketplace } from "@/hooks/useMarketplace";
import { MarketplaceBundle, MarketplaceListing } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function BundleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { bundles, listings, loading, error, fetchBundles, fetchListings } = useMarketplace();
  const [bundleItems, setBundleItems] = useState<MarketplaceListing[]>([]);

  // Find the current bundle
  const bundle = bundles.find(item => item.id === params.id);

  // Handle buying the bundle
  const handleBuyBundle = () => {
    toast({
      title: "Bundle Added to Cart",
      description: "All items in this bundle have been added to your cart",
    });
  };

  // Fetch bundles and listings on component mount
  useEffect(() => {
    fetchBundles();
    fetchListings();
  }, [fetchBundles, fetchListings]);

  // Update bundle items when listings or bundle changes
  useEffect(() => {
    if (bundle && listings.length > 0) {
      const items = bundle.items
        .map(itemId => listings.find(listing => listing.id === itemId))
        .filter(item => item !== undefined) as MarketplaceListing[];
      
      setBundleItems(items);
    }
  }, [bundle, listings]);

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
        <h2 className="text-2xl font-bold">Error Loading Bundle</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => fetchBundles()}>Try Again</Button>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="container mx-auto flex h-96 flex-col items-center justify-center gap-4 px-4 py-6 text-center">
        <Package className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Bundle Not Found</h2>
        <p className="text-muted-foreground">The bundle you're looking for doesn't exist or has been removed.</p>
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
        <h1 className="text-2xl font-bold tracking-tight">Bundle Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full bg-gray-100 sm:h-80 md:h-96">
              {bundle.images && bundle.images.length > 0 ? (
                <div className="relative h-full w-full">
                  <img
                    src={bundle.images[0]}
                    alt={bundle.title}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <Badge variant="secondary" className="absolute right-2 top-2 bg-green-100">
                <Percent className="mr-1 h-3 w-3" />
                {bundle.discountPercentage}% Off
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{bundle.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span>{bundle.category}</span>
                    {bundle.subcategory && (
                      <>
                        <span>•</span>
                        <span>{bundle.subcategory}</span>
                      </>
                    )}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(bundle.discountedPrice)}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    {formatCurrency(bundle.totalPrice)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Description</h3>
                <p className="whitespace-pre-line text-gray-700">{bundle.description}</p>
              </div>
              
              <div>
                <h3 className="mb-4 flex items-center text-lg font-semibold">
                  <ListChecks className="mr-2 h-5 w-5 text-primary" />
                  Items Included in This Bundle
                </h3>
                <div className="space-y-4">
                  {bundleItems.length > 0 ? (
                    bundleItems.map((item, index) => (
                      <div key={item.id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="flex gap-4">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                            {item.images && item.images.length > 0 ? (
                              <div className="relative h-full w-full">
                                <img
                                  src={item.images[0]}
                                  alt={item.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                <Tag className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                            <div className="mt-1 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{item.category}</span>
                                {item.subcategory && (
                                  <>
                                    <span className="text-sm text-muted-foreground">•</span>
                                    <span className="text-sm text-muted-foreground">{item.subcategory}</span>
                                  </>
                                )}
                              </div>
                              <div className="text-sm font-medium text-primary">
                                {formatCurrency(item.price)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">No items found in this bundle</p>
                  )}
                </div>
              </div>
              
              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-800">Your Savings</h4>
                    <p className="text-sm text-green-700">
                      Save {formatCurrency(bundle.totalPrice - bundle.discountedPrice)} when you buy this bundle
                    </p>
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    {bundle.discountPercentage}% OFF
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bundle Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Items:</span>
                <span className="font-medium">{bundleItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Regular Price:</span>
                <span className="font-medium">{formatCurrency(bundle.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount:</span>
                <span className="font-medium text-green-600">-{formatCurrency(bundle.totalPrice - bundle.discountedPrice)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Bundle Price:</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(bundle.discountedPrice)}</span>
              </div>
              
              <Button 
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" 
                onClick={handleBuyBundle}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy Bundle
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Bundles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bundles
                .filter(item => 
                  item.id !== bundle.id && 
                  (item.category === bundle.category || item.subcategory === bundle.subcategory)
                )
                .slice(0, 3)
                .map(item => (
                  <Link key={item.id} href={`/dashboard/marketplace/bundles/${item.id}`}>
                    <div className="flex gap-3 rounded-md p-2 transition-colors hover:bg-accent">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="line-clamp-1 font-medium">{item.title}</h4>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-green-50 text-xs">
                            {item.discountPercentage}% Off
                          </Badge>
                          <p className="text-primary">{formatCurrency(item.discountedPrice)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              {bundles.filter(item => 
                item.id !== bundle.id && 
                (item.category === bundle.category || item.subcategory === bundle.subcategory)
              ).length === 0 && (
                <p className="text-sm text-muted-foreground">No related bundles found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
