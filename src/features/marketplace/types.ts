// Marketplace Feature - Types

/**
 * Product Category
 */
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  images: string[];
  categoryId: string;
  vendorId?: string;
  featured: boolean;
  inStock: boolean;
  attributes?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product with Category
 */
export interface ProductWithCategory extends Product {
  category?: ProductCategory;
  vendor?: {
    id: string;
    name: string;
    logo?: string;
  };
}

/**
 * Cart Item
 */
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: ProductWithCategory;
}

/**
 * Shopping Cart
 */
export interface ShoppingCart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Order
 */
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product Review
 */
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

/**
 * Affiliate Link
 */
export interface AffiliateLink {
  id: string;
  productId: string;
  platform: "amazon" | "chewy" | "petco" | "other";
  url: string;
  commission: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
