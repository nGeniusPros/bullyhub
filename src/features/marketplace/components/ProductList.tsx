"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Tag, 
  Loader2, 
  AlertCircle,
  Star,
  StarHalf
} from "lucide-react";
import { toast } from "sonner";
import { ProductWithCategory, ProductCategory } from "../types";
import { useMarketplaceQueries } from "../data/queries";
import { formatCurrency } from "@/lib/utils";

interface ProductListProps {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
}

export default function ProductList({
  categoryId,
  featured,
  limit,
}: ProductListProps) {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryId || "all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [activeTab, setActiveTab] = useState("all");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const marketplaceQueries = useMarketplaceQueries();

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesData = await marketplaceQueries.getAllCategories();
        setCategories(categoriesData);

        // Fetch products
        const productsData = await marketplaceQueries.getAllProducts({
          categoryId,
          featured,
          limit
        });
        
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error fetching marketplace data:", error);
        toast.error("Failed to load marketplace data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, featured, limit]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }
    
    // Apply tab filter
    if (activeTab === "inStock") {
      filtered = filtered.filter(product => product.inStock);
    } else if (activeTab === "onSale") {
      filtered = filtered.filter(product => product.salePrice !== null && product.salePrice < product.price);
    } else if (activeTab === "featured") {
      filtered = filtered.filter(product => product.featured);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.name.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    if (sortBy === "priceLow") {
      filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === "priceHigh") {
      filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "featured") {
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, activeTab, searchTerm, sortBy]);

  // Handle adding to cart
  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      await marketplaceQueries.addToCart(productId, 1);
      toast.success("Product added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Marketplace</h2>
          <p className="text-muted-foreground">
            Shop for products for your kennel and dogs
          </p>
        </div>
        <Link href="/dashboard/marketplace/cart">
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>View Cart</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="priceLow">Price: Low to High</SelectItem>
              <SelectItem value="priceHigh">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="inStock">In Stock</TabsTrigger>
          <TabsTrigger value="onSale">On Sale</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No products found</h3>
              <p className="mt-1 text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms or filters"
                  : "There are no products in this category yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                  <Link href={`/dashboard/marketplace/products/${product.id}`} className="block">
                    <div className="relative h-48 bg-muted">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <Tag className="h-12 w-12" />
                        </div>
                      )}
                      {product.featured && (
                        <Badge className="absolute top-2 left-2 bg-primary">
                          Featured
                        </Badge>
                      )}
                      {product.salePrice && product.salePrice < product.price && (
                        <Badge className="absolute top-2 right-2 bg-red-500">
                          Sale
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <Link href={`/dashboard/marketplace/products/${product.id}`} className="block">
                        <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <StarHalf className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {product.category?.name || "Uncategorized"}
                    </div>
                    <div className="flex items-center gap-2">
                      {product.salePrice ? (
                        <>
                          <span className="font-bold text-red-500">
                            {formatCurrency(product.salePrice)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addingToCart === product.id || !product.inStock}
                    >
                      {addingToCart === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-2" />
                      )}
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
