"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  Tag,
  Loader2,
  AlertCircle,
  Baby,
  Boxes,
  Heart,
  Scissors,
  GraduationCap,
  Home,
  Sparkles,
  ServerIcon,
  Package,
  BookOpen,
  Star,
  ShoppingCart,
  MessageCircle,
  Info,
} from "lucide-react";
import { useMarketplace } from "@/hooks/useMarketplace";
import { ListingCard } from "@/components/marketplace/listing-card";
import { BundleCard } from "@/components/marketplace/bundle-card";
import { EducationalContentCard } from "@/components/marketplace/educational-content-card";
import { OfferForm } from "@/components/marketplace/offer-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ListingForm } from "@/components/marketplace/listing-form";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("products"); // "products", "bundles", "education"
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  const {
    listings,
    categories,
    bundles,
    educationalContent,
    loading,
    error,
    fetchListings,
    fetchBundles,
    fetchEducationalContent,
    addListing,
    makeOffer
  } = useMarketplace();

  // Get the icon for a category
  const getCategoryIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case "Baby":
        return <Baby className="h-6 w-6" />;
      case "Boxes":
        return <Boxes className="h-6 w-6" />;
      case "Heart":
        return <Heart className="h-6 w-6" />;
      case "Scissors":
        return <Scissors className="h-6 w-6" />;
      case "GraduationCap":
        return <GraduationCap className="h-6 w-6" />;
      case "Home":
        return <Home className="h-6 w-6" />;
      case "Sparkles":
        return <Sparkles className="h-6 w-6" />;
      case "Package":
        return <Package className="h-6 w-6" />;
      case "BookOpen":
        return <BookOpen className="h-6 w-6" />;
      case "Star":
        return <Star className="h-6 w-6" />;
      default:
        return <Tag className="h-6 w-6" />;
    }
  };

  // Filter listings based on active tab and search term
  const filteredListings = listings.filter((listing) => {
    const matchesTab = activeTab === "all" || listing.category === activeTab;
    const matchesSearch =
      searchTerm === "" ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.subcategory?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Handle creating a new listing
  const handleCreateListing = async (formData: any) => {
    try {
      await addListing(formData);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Listing created successfully",
      });
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error",
        description: "Failed to create listing",
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

  // Open offer dialog for a listing
  const openOfferDialog = (listingId: string) => {
    setSelectedListingId(listingId);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kennel Marketplace</h1>
          <p className="text-muted-foreground">
            Buy, sell, and discover products for your kennel
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === "products" ? "default" : "ghost"}
              className="rounded-r-none"
              onClick={() => setViewMode("products")}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Products
            </Button>
            <Button
              variant={viewMode === "bundles" ? "default" : "ghost"}
              className="rounded-none border-x"
              onClick={() => setViewMode("bundles")}
            >
              <Package className="mr-2 h-4 w-4" />
              Bundles
            </Button>
            <Button
              variant={viewMode === "education" ? "default" : "ghost"}
              className="rounded-l-none"
              onClick={() => setViewMode("education")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Education
            </Button>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Create New Listing</DialogTitle>
                <DialogDescription>
                  Fill out the form below to create a new marketplace listing
                </DialogDescription>
              </DialogHeader>
              <ListingForm
                categories={categories}
                onSubmit={handleCreateListing}
                isLoading={loading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === "products" && (
        <div className="mb-6 grid gap-4 md:grid-cols-3 lg:grid-cols-7">
          {categories
            .filter(category => category.name !== "Product Bundles")
            .map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeTab === category.name ? "border-primary bg-primary/5" : ""
              } ${category.featured ? "border-blue-200 shadow" : ""}`}
              onClick={() => setActiveTab(category.name)}
            >
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className={`mb-2 rounded-full p-2 ${category.featured ? "bg-blue-100 text-blue-600" : "bg-primary/10 text-primary"}`}>
                  {getCategoryIcon(category.iconName)}
                </div>
                <p className="text-center text-sm font-medium">{category.name}</p>
                {category.featured && (
                  <Badge variant="secondary" className="mt-2 bg-blue-100">
                    <Star className="mr-1 h-3 w-3" />
                    Featured
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeTab === "all" ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            <CardContent className="flex flex-col items-center justify-center p-4">
              <div className="mb-2 rounded-full bg-primary/10 p-2 text-primary">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <p className="text-center text-sm font-medium">All Items</p>
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === "bundles" && (
        <div className="mb-6">
          <div className="mb-4 flex items-center">
            <Package className="mr-2 h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Product Bundles</h2>
            <Badge variant="outline" className="ml-2">{bundles.length} bundles</Badge>
          </div>
          <p className="mb-4 text-muted-foreground">
            Save money with our curated product bundles designed for breeders. Each bundle includes complementary products at a discounted price.
          </p>
        </div>
      )}

      {viewMode === "education" && (
        <div className="mb-6">
          <div className="mb-4 flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Educational Resources</h2>
            <Badge variant="outline" className="ml-2">{educationalContent.length} resources</Badge>
          </div>
          <p className="mb-4 text-muted-foreground">
            Access valuable guides, articles, and videos to help you succeed in your breeding program. Learn best practices from experts in the field.
          </p>
        </div>
      )}

      {viewMode !== "education" && (
        <div className="mb-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={viewMode === "products" ? "Search listings..." : "Search bundles..."}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      )}

      {viewMode === "education" && (
        <div className="mb-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search educational content..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {viewMode === "products" && (
        <Tabs defaultValue="grid" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {activeTab === "all" ? "All Listings" : activeTab}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredListings.length} items)
              </span>
            </h2>
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="space-y-4">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <h3 className="text-lg font-medium">Error loading listings</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" onClick={() => fetchListings()}>
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onMakeOffer={openOfferDialog}
                  />
                ))}
                {filteredListings.length === 0 && (
                  <div className="col-span-full flex h-40 flex-col items-center justify-center gap-2 text-center">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No listings found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <h3 className="text-lg font-medium">Error loading listings</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" onClick={() => fetchListings()}>
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="h-48 w-full bg-gray-100 md:h-auto md:w-48">
                        {listing.images && listing.images.length > 0 ? (
                          <div className="relative h-full w-full">
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <Tag className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <div className="mb-2">
                          <h3 className="text-lg font-semibold">{listing.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{listing.category}</span>
                            {listing.subcategory && (
                              <>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">{listing.subcategory}</span>
                              </>
                            )}
                            {listing.brand && (
                              <>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm font-medium text-muted-foreground">{listing.brand}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="mb-4 flex-1 text-sm text-gray-600">{listing.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-primary">
                            {formatCurrency(listing.price)}
                          </div>
                          <div className="flex gap-2">
                            {listing.affiliateLink ? (
                              <Button
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                onClick={() => window.open(listing.affiliateLink, '_blank')}
                              >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Buy Now
                              </Button>
                            ) : (
                              <>
                                <Button variant="outline" onClick={() => openOfferDialog(listing.id)}>
                                  <MessageCircle className="mr-2 h-4 w-4" />
                                  Make Offer
                                </Button>
                                <Link href={`/dashboard/marketplace/${listing.id}`}>
                                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                    <Info className="mr-2 h-4 w-4" />
                                    Details
                                  </Button>
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {filteredListings.length === 0 && (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No listings found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {viewMode === "bundles" && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <h3 className="text-lg font-medium">Error loading bundles</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={() => fetchBundles()}>
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {bundles
                  .filter(bundle =>
                    searchTerm === "" ||
                    bundle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    bundle.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((bundle) => (
                    <BundleCard
                      key={bundle.id}
                      bundle={bundle}
                      onBuyNow={() => toast({
                        title: "Bundle Selected",
                        description: "This would add all bundle items to your cart"
                      })}
                    />
                  ))
                }
              </div>

              {bundles.filter(bundle =>
                searchTerm === "" ||
                bundle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bundle.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No bundles found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search to find what you're looking for.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {viewMode === "education" && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <h3 className="text-lg font-medium">Error loading educational content</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={() => fetchEducationalContent()}>
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {educationalContent
                  .filter(content =>
                    searchTerm === "" ||
                    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (content.content && content.content.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((content) => (
                    <EducationalContentCard
                      key={content.id}
                      content={content}
                    />
                  ))
                }
              </div>

              {educationalContent.filter(content =>
                searchTerm === "" ||
                content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (content.content && content.content.toLowerCase().includes(searchTerm.toLowerCase()))
              ).length === 0 && (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No educational content found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search to find what you're looking for.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Offer Dialog */}
      {selectedListingId && (
        <div>
          {listings
            .filter(listing => listing.id === selectedListingId)
            .map(listing => (
              <OfferForm
                key={listing.id}
                listing={listing}
                onSubmit={handleMakeOffer}
                isLoading={loading}
              />
            ))}
        </div>
      )}
    </div>
  );
}
