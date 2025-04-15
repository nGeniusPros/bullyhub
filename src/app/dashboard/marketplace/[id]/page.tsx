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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ShoppingBag,
  Tag,
  Calendar,
  Trash,
  Pencil,
  Save,
  X,
  Loader2,
  AlertCircle,
  User,
  MessageCircle,
  Share2,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import { useMarketplace } from "@/hooks/useMarketplace";
import { MarketplaceListing } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { OfferForm } from "@/components/marketplace/offer-form";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ListingForm } from "@/components/marketplace/listing-form";

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { listings, categories, loading, error, fetchListings, updateListing, deleteListing, makeOffer } = useMarketplace();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Find the current listing
  const listing = listings.find(item => item.id === params.id);

  // Handle editing a listing
  const handleEditListing = async (formData: any) => {
    if (!listing) return;
    
    try {
      await updateListing(listing.id, formData);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Listing updated successfully",
      });
    } catch (error) {
      console.error("Error updating listing:", error);
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive",
      });
    }
  };

  // Handle deleting a listing
  const handleDeleteListing = async () => {
    if (!listing) return;
    
    try {
      await deleteListing(listing.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });
      router.push("/dashboard/marketplace");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    }
  };

  // Handle making an offer
  const handleMakeOffer = async (listingId: string, offerAmount: number, message?: string) => {
    try {
      await makeOffer(listingId, offerAmount, message);
      toast({
        title: "Success",
        description: "Offer submitted successfully",
      });
    } catch (error) {
      console.error("Error making offer:", error);
      toast({
        title: "Error",
        description: "Failed to submit offer",
        variant: "destructive",
      });
    }
  };

  // Fetch listings on component mount
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

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
        <h2 className="text-2xl font-bold">Error Loading Listing</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => fetchListings()}>Try Again</Button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto flex h-96 flex-col items-center justify-center gap-4 px-4 py-6 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Listing Not Found</h2>
        <p className="text-muted-foreground">The listing you're looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard/marketplace">
          <Button>Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const isAffiliate = !!listing.affiliateLink;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/marketplace")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Listing Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full bg-gray-100 sm:h-80 md:h-96">
              {listing.images && listing.images.length > 0 ? (
                <div className="relative h-full w-full">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <Tag className="h-16 w-16 text-gray-400" />
                </div>
              )}
              {isAffiliate && (
                <Badge variant="secondary" className="absolute right-2 top-2 bg-amber-100">
                  Affiliate
                </Badge>
              )}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{listing.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span>{listing.category}</span>
                    {listing.subcategory && (
                      <>
                        <span>•</span>
                        <span>{listing.subcategory}</span>
                      </>
                    )}
                  </CardDescription>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(listing.price)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="seller">Seller</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Description</h3>
                    <p className="whitespace-pre-line text-gray-700">{listing.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Condition</h4>
                      <p className="capitalize">{listing.condition || "Not specified"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Listed</h4>
                      <p>{format(new Date(listing.createdAt), "MMM d, yyyy")}</p>
                    </div>
                    {isAffiliate && listing.affiliateProgram && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Affiliate Program</h4>
                        <p>{listing.affiliateProgram}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="seller" className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Seller ID</h3>
                      <p className="text-sm text-muted-foreground">{listing.breederId}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Other Listings</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {listings
                        .filter(item => item.breederId === listing.breederId && item.id !== listing.id)
                        .slice(0, 4)
                        .map(item => (
                          <Link key={item.id} href={`/dashboard/marketplace/${item.id}`}>
                            <div className="rounded-md border p-2 transition-colors hover:bg-accent">
                              <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
                              <p className="text-sm text-primary">{formatCurrency(item.price)}</p>
                            </div>
                          </Link>
                        ))}
                      {listings.filter(item => item.breederId === listing.breederId && item.id !== listing.id).length === 0 && (
                        <p className="col-span-2 text-sm text-muted-foreground">No other listings from this seller</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAffiliate ? (
                <Button className="w-full" onClick={() => window.open(listing.affiliateLink, '_blank')}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
              ) : (
                <OfferForm
                  listing={listing}
                  onSubmit={handleMakeOffer}
                  isLoading={loading}
                />
              )}
              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share Listing
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Listing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Listing
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Edit Listing</DialogTitle>
                    <DialogDescription>
                      Update your marketplace listing details
                    </DialogDescription>
                  </DialogHeader>
                  <ListingForm 
                    categories={categories} 
                    initialData={listing}
                    onSubmit={handleEditListing} 
                    isLoading={loading} 
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Listing
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Listing</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this listing? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteListing} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Similar Listings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {listings
                .filter(item => 
                  item.id !== listing.id && 
                  (item.category === listing.category || item.subcategory === listing.subcategory)
                )
                .slice(0, 3)
                .map(item => (
                  <Link key={item.id} href={`/dashboard/marketplace/${item.id}`}>
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
                            <Tag className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="line-clamp-1 font-medium">{item.title}</h4>
                        <p className="text-primary">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              {listings.filter(item => 
                item.id !== listing.id && 
                (item.category === listing.category || item.subcategory === listing.subcategory)
              ).length === 0 && (
                <p className="text-sm text-muted-foreground">No similar listings found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
