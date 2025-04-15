// Marketplace Feature - Supabase Queries
import { createClient } from "@/lib/supabase-server";
import { createClient as createBrowserClient } from "@/lib/supabase-browser";
import {
  Product,
  ProductCategory,
  ProductWithCategory,
  CartItem,
  ShoppingCart
} from "../types";

/**
 * Server-side queries (for use in Netlify functions and server components)
 */
export const marketplaceQueries = {
  /**
   * Get all product categories
   * @returns Array of product categories
   */
  getAllCategories: async (): Promise<ProductCategory[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("marketplace_categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data as ProductCategory[];
  },

  /**
   * Get a specific product category
   * @param categoryId - The ID of the category
   * @returns Product category
   */
  getCategory: async (categoryId: string): Promise<ProductCategory> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("marketplace_categories")
      .select("*")
      .eq("id", categoryId)
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      throw new Error(`Failed to fetch category: ${error.message}`);
    }

    return data as ProductCategory;
  },

  /**
   * Get all products
   * @param options - Query options
   * @returns Array of products with category information
   */
  getAllProducts: async (options?: {
    limit?: number;
    featured?: boolean;
    categoryId?: string;
  }): Promise<ProductWithCategory[]> => {
    const supabase = createClient();
    let query = supabase
      .from("marketplace_products")
      .select(`
        *,
        category:marketplace_categories(*)
      `);

    if (options?.featured !== undefined) {
      query = query.eq("featured", options.featured);
    }

    if (options?.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }

    query = query.order("created_at", { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return data.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      salePrice: product.sale_price,
      images: product.images,
      categoryId: product.category_id,
      vendorId: product.vendor_id,
      featured: product.featured,
      inStock: product.in_stock,
      attributes: product.attributes,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        description: product.category.description,
        image: product.category.image,
        parentId: product.category.parent_id,
        createdAt: product.category.created_at,
        updatedAt: product.category.updated_at
      } : undefined
    }));
  },

  /**
   * Get a specific product
   * @param productId - The ID of the product
   * @returns Product with category information
   */
  getProduct: async (productId: string): Promise<ProductWithCategory> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("marketplace_products")
      .select(`
        *,
        category:marketplace_categories(*)
      `)
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      salePrice: data.sale_price,
      images: data.images,
      categoryId: data.category_id,
      vendorId: data.vendor_id,
      featured: data.featured,
      inStock: data.in_stock,
      attributes: data.attributes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      category: data.category ? {
        id: data.category.id,
        name: data.category.name,
        slug: data.category.slug,
        description: data.category.description,
        image: data.category.image,
        parentId: data.category.parent_id,
        createdAt: data.category.created_at,
        updatedAt: data.category.updated_at
      } : undefined
    };
  },

  /**
   * Get a product by slug
   * @param slug - The slug of the product
   * @returns Product with category information
   */
  getProductBySlug: async (slug: string): Promise<ProductWithCategory> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("marketplace_products")
      .select(`
        *,
        category:marketplace_categories(*)
      `)
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching product by slug:", error);
      throw new Error(`Failed to fetch product by slug: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      salePrice: data.sale_price,
      images: data.images,
      categoryId: data.category_id,
      vendorId: data.vendor_id,
      featured: data.featured,
      inStock: data.in_stock,
      attributes: data.attributes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      category: data.category ? {
        id: data.category.id,
        name: data.category.name,
        slug: data.category.slug,
        description: data.category.description,
        image: data.category.image,
        parentId: data.category.parent_id,
        createdAt: data.category.created_at,
        updatedAt: data.category.updated_at
      } : undefined
    };
  },

  /**
   * Get user's shopping cart
   * @param userId - The ID of the user
   * @returns Shopping cart with items
   */
  getUserCart: async (userId: string): Promise<ShoppingCart> => {
    const supabase = createClient();

    // Get or create cart
    let { data: cart, error: cartError } = await supabase
      .from("shopping_carts")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (cartError && cartError.code !== "PGRST116") { // PGRST116 is "no rows returned"
      console.error("Error fetching cart:", cartError);
      throw new Error(`Failed to fetch cart: ${cartError.message}`);
    }

    // If cart doesn't exist, create one
    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from("shopping_carts")
        .insert({
          user_id: userId,
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating cart:", createError);
        throw new Error(`Failed to create cart: ${createError.message}`);
      }

      cart = newCart;
    }

    // Get cart items with product details
    const { data: cartItems, error: itemsError } = await supabase
      .from("cart_items")
      .select(`
        *,
        product:marketplace_products(
          *,
          category:marketplace_categories(*)
        )
      `)
      .eq("cart_id", cart.id);

    if (itemsError) {
      console.error("Error fetching cart items:", itemsError);
      throw new Error(`Failed to fetch cart items: ${itemsError.message}`);
    }

    // Format cart items
    const formattedItems: CartItem[] = cartItems.map(item => ({
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price,
      product: item.product ? {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        description: item.product.description,
        price: item.product.price,
        salePrice: item.product.sale_price,
        images: item.product.images,
        categoryId: item.product.category_id,
        vendorId: item.product.vendor_id,
        featured: item.product.featured,
        inStock: item.product.in_stock,
        attributes: item.product.attributes,
        createdAt: item.product.created_at,
        updatedAt: item.product.updated_at,
        category: item.product.category ? {
          id: item.product.category.id,
          name: item.product.category.name,
          slug: item.product.category.slug,
          description: item.product.category.description,
          image: item.product.category.image,
          parentId: item.product.category.parent_id,
          createdAt: item.product.category.created_at,
          updatedAt: item.product.category.updated_at
        } : undefined
      } : undefined
    }));

    return {
      id: cart.id,
      userId: cart.user_id,
      items: formattedItems,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
      createdAt: cart.created_at,
      updatedAt: cart.updated_at
    };
  }
};

/**
 * Client-side queries (for use in browser components)
 */
export const useMarketplaceQueries = () => {
  const supabase = createBrowserClient();

  return {
    /**
     * Get all product categories
     * @returns Array of product categories
     */
    getAllCategories: async (): Promise<ProductCategory[]> => {
      const { data, error } = await supabase
        .from("marketplace_categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      return data as ProductCategory[];
    },

    /**
     * Get all products
     * @param options - Query options
     * @returns Array of products with category information
     */
    getAllProducts: async (options?: {
      limit?: number;
      featured?: boolean;
      categoryId?: string;
    }): Promise<ProductWithCategory[]> => {
      let query = supabase
        .from("marketplace_products")
        .select(`
          *,
          category:marketplace_categories(*)
        `);

      if (options?.featured !== undefined) {
        query = query.eq("featured", options.featured);
      }

      if (options?.categoryId) {
        query = query.eq("category_id", options.categoryId);
      }

      query = query.order("created_at", { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      return data.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        salePrice: product.sale_price,
        images: product.images,
        categoryId: product.category_id,
        vendorId: product.vendor_id,
        featured: product.featured,
        inStock: product.in_stock,
        attributes: product.attributes,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        category: product.category ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
          description: product.category.description,
          image: product.category.image,
          parentId: product.category.parent_id,
          createdAt: product.category.created_at,
          updatedAt: product.category.updated_at
        } : undefined
      }));
    },

    /**
     * Get a specific product
     * @param productId - The ID of the product
     * @returns Product with category information
     */
    getProduct: async (productId: string): Promise<ProductWithCategory> => {
      const { data, error } = await supabase
        .from("marketplace_products")
        .select(`
          *,
          category:marketplace_categories(*)
        `)
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        throw new Error(`Failed to fetch product: ${error.message}`);
      }

      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        salePrice: data.sale_price,
        images: data.images,
        categoryId: data.category_id,
        vendorId: data.vendor_id,
        featured: data.featured,
        inStock: data.in_stock,
        attributes: data.attributes,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        category: data.category ? {
          id: data.category.id,
          name: data.category.name,
          slug: data.category.slug,
          description: data.category.description,
          image: data.category.image,
          parentId: data.category.parent_id,
          createdAt: data.category.created_at,
          updatedAt: data.category.updated_at
        } : undefined
      };
    },

    /**
     * Add item to cart
     * @param productId - The ID of the product to add
     * @param quantity - The quantity to add
     * @returns Success status
     */
    addToCart: async (productId: string, quantity: number = 1): Promise<boolean> => {
      try {
        // Get the product details
        const { data: product, error: productError } = await supabase
          .from("marketplace_products")
          .select("*")
          .eq("id", productId)
          .single();

        if (productError) {
          console.error("Error fetching product:", productError);
          throw new Error(`Failed to fetch product: ${productError.message}`);
        }

        // Get the user's cart
        const { data: user } = await supabase.auth.getUser();

        if (!user || !user.user) {
          throw new Error("User not authenticated");
        }

        const { data: cart, error: cartError } = await supabase
          .from("shopping_carts")
          .select("*")
          .eq("user_id", user.user.id)
          .single();

        if (cartError && cartError.code !== "PGRST116") {
          console.error("Error fetching cart:", cartError);
          throw new Error(`Failed to fetch cart: ${cartError.message}`);
        }

        let cartId;

        // If cart doesn't exist, create one
        if (!cart) {
          const { data: newCart, error: createError } = await supabase
            .from("shopping_carts")
            .insert({
              user_id: user.user.id,
              subtotal: 0,
              tax: 0,
              shipping: 0,
              total: 0
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating cart:", createError);
            throw new Error(`Failed to create cart: ${createError.message}`);
          }

          cartId = newCart.id;
        } else {
          cartId = cart.id;
        }

        // Check if item already exists in cart
        const { data: existingItem, error: itemError } = await supabase
          .from("cart_items")
          .select("*")
          .eq("cart_id", cartId)
          .eq("product_id", productId)
          .single();

        if (itemError && itemError.code !== "PGRST116") {
          console.error("Error checking cart item:", itemError);
          throw new Error(`Failed to check cart item: ${itemError.message}`);
        }

        // Update or insert cart item
        if (existingItem) {
          // Update existing item
          const { error: updateError } = await supabase
            .from("cart_items")
            .update({
              quantity: existingItem.quantity + quantity,
              price: product.price,
              updated_at: new Date().toISOString()
            })
            .eq("id", existingItem.id);

          if (updateError) {
            console.error("Error updating cart item:", updateError);
            throw new Error(`Failed to update cart item: ${updateError.message}`);
          }
        } else {
          // Insert new item
          const { error: insertError } = await supabase
            .from("cart_items")
            .insert({
              cart_id: cartId,
              product_id: productId,
              quantity: quantity,
              price: product.price
            });

          if (insertError) {
            console.error("Error adding cart item:", insertError);
            throw new Error(`Failed to add cart item: ${insertError.message}`);
          }
        }

        // Update cart totals
        await updateCartTotals(cartId);

        return true;
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      }
    },

    /**
     * Remove item from cart
     * @param itemId - The ID of the cart item to remove
     * @returns Success status
     */
    removeFromCart: async (itemId: string): Promise<boolean> => {
      try {
        // Get the cart item to find the cart ID
        const { data: item, error: itemError } = await supabase
          .from("cart_items")
          .select("cart_id")
          .eq("id", itemId)
          .single();

        if (itemError) {
          console.error("Error fetching cart item:", itemError);
          throw new Error(`Failed to fetch cart item: ${itemError.message}`);
        }

        // Delete the cart item
        const { error: deleteError } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", itemId);

        if (deleteError) {
          console.error("Error removing cart item:", deleteError);
          throw new Error(`Failed to remove cart item: ${deleteError.message}`);
        }

        // Update cart totals
        await updateCartTotals(item.cart_id);

        return true;
      } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
      }
    },

    /**
     * Update cart item quantity
     * @param itemId - The ID of the cart item to update
     * @param quantity - The new quantity
     * @returns Success status
     */
    updateCartItemQuantity: async (itemId: string, quantity: number): Promise<boolean> => {
      try {
        if (quantity <= 0) {
          return this.removeFromCart(itemId);
        }

        // Get the cart item to find the cart ID
        const { data: item, error: itemError } = await supabase
          .from("cart_items")
          .select("cart_id")
          .eq("id", itemId)
          .single();

        if (itemError) {
          console.error("Error fetching cart item:", itemError);
          throw new Error(`Failed to fetch cart item: ${itemError.message}`);
        }

        // Update the cart item
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({
            quantity: quantity,
            updated_at: new Date().toISOString()
          })
          .eq("id", itemId);

        if (updateError) {
          console.error("Error updating cart item:", updateError);
          throw new Error(`Failed to update cart item: ${updateError.message}`);
        }

        // Update cart totals
        await updateCartTotals(item.cart_id);

        return true;
      } catch (error) {
        console.error("Error updating cart item:", error);
        throw error;
      }
    },

    /**
     * Get user's shopping cart
     * @returns Shopping cart with items
     */
    getUserCart: async (): Promise<ShoppingCart> => {
      try {
        // Get the current user
        const { data: user } = await supabase.auth.getUser();

        if (!user || !user.user) {
          throw new Error("User not authenticated");
        }

        // Get or create cart
        let { data: cart, error: cartError } = await supabase
          .from("shopping_carts")
          .select("*")
          .eq("user_id", user.user.id)
          .single();

        if (cartError && cartError.code !== "PGRST116") { // PGRST116 is "no rows returned"
          console.error("Error fetching cart:", cartError);
          throw new Error(`Failed to fetch cart: ${cartError.message}`);
        }

        // If cart doesn't exist, create one
        if (!cart) {
          const { data: newCart, error: createError } = await supabase
            .from("shopping_carts")
            .insert({
              user_id: user.user.id,
              subtotal: 0,
              tax: 0,
              shipping: 0,
              total: 0
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating cart:", createError);
            throw new Error(`Failed to create cart: ${createError.message}`);
          }

          cart = newCart;
        }

        // Get cart items with product details
        const { data: cartItems, error: itemsError } = await supabase
          .from("cart_items")
          .select(`
            *,
            product:marketplace_products(
              *,
              category:marketplace_categories(*)
            )
          `)
          .eq("cart_id", cart.id);

        if (itemsError) {
          console.error("Error fetching cart items:", itemsError);
          throw new Error(`Failed to fetch cart items: ${itemsError.message}`);
        }

        // Format cart items
        const formattedItems: CartItem[] = cartItems.map(item => ({
          id: item.id,
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
          product: item.product ? {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            description: item.product.description,
            price: item.product.price,
            salePrice: item.product.sale_price,
            images: item.product.images,
            categoryId: item.product.category_id,
            vendorId: item.product.vendor_id,
            featured: item.product.featured,
            inStock: item.product.in_stock,
            attributes: item.product.attributes,
            createdAt: item.product.created_at,
            updatedAt: item.product.updated_at,
            category: item.product.category ? {
              id: item.product.category.id,
              name: item.product.category.name,
              slug: item.product.category.slug,
              description: item.product.category.description,
              image: item.product.category.image,
              parentId: item.product.category.parent_id,
              createdAt: item.product.category.created_at,
              updatedAt: item.product.category.updated_at
            } : undefined
          } : undefined
        }));

        return {
          id: cart.id,
          userId: cart.user_id,
          items: formattedItems,
          subtotal: cart.subtotal,
          tax: cart.tax,
          shipping: cart.shipping,
          total: cart.total,
          createdAt: cart.created_at,
          updatedAt: cart.updated_at
        };
      } catch (error) {
        console.error("Error fetching user cart:", error);
        throw error;
      }
    },

    /**
     * Clear the user's shopping cart
     * @returns Success status
     */
    clearCart: async (): Promise<boolean> => {
      try {
        // Get the current user
        const { data: user } = await supabase.auth.getUser();

        if (!user || !user.user) {
          throw new Error("User not authenticated");
        }

        // Get the user's cart
        const { data: cart, error: cartError } = await supabase
          .from("shopping_carts")
          .select("id")
          .eq("user_id", user.user.id)
          .single();

        if (cartError) {
          console.error("Error fetching cart:", cartError);
          throw new Error(`Failed to fetch cart: ${cartError.message}`);
        }

        // Delete all cart items
        const { error: deleteError } = await supabase
          .from("cart_items")
          .delete()
          .eq("cart_id", cart.id);

        if (deleteError) {
          console.error("Error clearing cart:", deleteError);
          throw new Error(`Failed to clear cart: ${deleteError.message}`);
        }

        // Reset cart totals
        const { error: updateError } = await supabase
          .from("shopping_carts")
          .update({
            subtotal: 0,
            tax: 0,
            shipping: 0,
            total: 0,
            updated_at: new Date().toISOString()
          })
          .eq("id", cart.id);

        if (updateError) {
          console.error("Error resetting cart totals:", updateError);
          throw new Error(`Failed to reset cart totals: ${updateError.message}`);
        }

        return true;
      } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
      }
    }
  };
};

/**
 * Helper function to update cart totals
 */
async function updateCartTotals(cartId: string): Promise<void> {
  const supabase = createBrowserClient();

  // Get all cart items
  const { data: items, error: itemsError } = await supabase
    .from("cart_items")
    .select("quantity, price")
    .eq("cart_id", cartId);

  if (itemsError) {
    console.error("Error fetching cart items for total:", itemsError);
    throw new Error(`Failed to fetch cart items for total: ${itemsError.message}`);
  }

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  // Calculate tax (assuming 7% tax rate)
  const tax = subtotal * 0.07;

  // Calculate shipping (flat rate of $5.99)
  const shipping = subtotal > 0 ? 5.99 : 0;

  // Calculate total
  const total = subtotal + tax + shipping;

  // Update cart
  const { error: updateError } = await supabase
    .from("shopping_carts")
    .update({
      subtotal,
      tax,
      shipping,
      total,
      updated_at: new Date().toISOString()
    })
    .eq("id", cartId);

  if (updateError) {
    console.error("Error updating cart totals:", updateError);
    throw new Error(`Failed to update cart totals: ${updateError.message}`);
  }
}
