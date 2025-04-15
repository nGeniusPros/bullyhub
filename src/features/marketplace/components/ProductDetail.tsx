"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  ChevronLeft, 
  Star, 
  StarHalf, 
  Loader2, 
  AlertCircle,
  Tag,
  Check,
  Truck,
  Heart,
  Share2
} from "lucide-react";
import { toast } from "sonner";
import { ProductWithCategory } from "../types";
import { useMarketplaceQueries } from "../data/queries";
import { formatCurrency } from "@/lib/utils";

interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const marketplaceQueries = useMarketplaceQueries();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await marketplaceQueries.getProduct(productId);
        setProduct(data);
        
        // Set the first image as selected
        if (data.images && data.images.length > 0) {
          setSelectedImage(0);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle quantity change
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      // Add the product to cart multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        await marketplaceQueries.addToCart(product.id, 1);
      }
      
      toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Product Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-6" onClick={() => router.push("/dashboard/marketplace")}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <Tag className="h-24 w-24" />
                </div>
              )}
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-primary">
                  Featured
                </Badge>
              )}
              {product.salePrice && product.salePrice < product.price && (
                <Badge className="absolute top-4 right-4 bg-red-500">
                  Sale
                </Badge>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href={`/dashboard/marketplace/categories/${product.categoryId}`}>
                  <Badge variant="outline" className="hover:bg-muted">
                    {product.category?.name || "Uncategorized"}
                  </Badge>
                </Link>
                {product.inStock ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="mr-1 h-3 w-3" />
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Out of Stock
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
                <span className="text-sm text-muted-foreground">(24 reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-red-500">
                    {formatCurrency(product.salePrice)}
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <Badge className="bg-red-500 ml-2">
                    {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-bold">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            
            <Separator />
            
            {/* Product Description */}
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.description || "No description available for this product."}
              </p>
            </div>
            
            {/* Product Attributes */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Specifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Separator />
            
            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="mr-4">Quantity:</span>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={addingToCart || !product.inStock}
                >
                  {addingToCart ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 h-4 w-4" />
                  )}
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Free Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      Free shipping on orders over $50. Delivery in 3-5 business days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <Tabs defaultValue="details" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="related">Related Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Product Details</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {product.description || "No detailed description available for this product."}
            </p>
            
            {/* Placeholder for additional details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Premium quality materials</li>
                  <li>Durable and long-lasting</li>
                  <li>Easy to clean and maintain</li>
                  <li>Suitable for all dog breeds</li>
                  <li>Veterinarian recommended</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">What's Included</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Main product</li>
                  <li>User manual</li>
                  <li>Warranty card</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Customer Reviews</h3>
              <Button>Write a Review</Button>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold">4.5</div>
                <div className="flex">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="text-sm text-muted-foreground mt-1">24 reviews</div>
              </div>
              
              <div className="flex-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm">5 stars</div>
                    <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 w-[75%]"></div>
                    </div>
                    <div className="text-sm text-muted-foreground">75%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm">4 stars</div>
                    <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 w-[15%]"></div>
                    </div>
                    <div className="text-sm text-muted-foreground">15%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm">3 stars</div>
                    <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 w-[5%]"></div>
                    </div>
                    <div className="text-sm text-muted-foreground">5%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm">2 stars</div>
                    <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 w-[3%]"></div>
                    </div>
                    <div className="text-sm text-muted-foreground">3%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm">1 star</div>
                    <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 w-[2%]"></div>
                    </div>
                    <div className="text-sm text-muted-foreground">2%</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Placeholder for reviews */}
            <div className="space-y-4 mt-6">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">John D.</div>
                      <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                    </div>
                    <div className="flex mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">2 months ago</div>
                </div>
                <h4 className="font-medium mt-2">Great product!</h4>
                <p className="text-muted-foreground mt-1">
                  This product exceeded my expectations. My dog loves it and the quality is excellent.
                  Would definitely recommend to other dog owners.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">Sarah M.</div>
                      <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                    </div>
                    <div className="flex mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">1 month ago</div>
                </div>
                <h4 className="font-medium mt-2">Good but could be better</h4>
                <p className="text-muted-foreground mt-1">
                  The product is good quality and my dog seems to like it. However, I wish it came in more colors.
                  Overall satisfied with the purchase.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="related" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Placeholder for related products */}
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative h-48 bg-muted">
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <Tag className="h-12 w-12" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      Related Product {i}
                    </h3>
                    <div className="text-sm text-muted-foreground mb-2">
                      {product.category?.name || "Uncategorized"}
                    </div>
                    <div className="font-bold">
                      {formatCurrency(19.99 + i * 5)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
