import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { marketplaceQueries } from '@/features/marketplace/data/queries';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's cart
    const cart = await marketplaceQueries.getUserCart(user.id);
    
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error in cart API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const { productId, quantity = 1 } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Get the product details
    const { data: product, error: productError } = await supabase
      .from("marketplace_products")
      .select("*")
      .eq("id", productId)
      .single();

    if (productError) {
      console.error("Error fetching product:", productError);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get or create cart
    let { data: cart, error: cartError } = await supabase
      .from("shopping_carts")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (cartError && cartError.code !== "PGRST116") { // PGRST116 is "no rows returned"
      console.error("Error fetching cart:", cartError);
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }

    let cartId;

    // If cart doesn't exist, create one
    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from("shopping_carts")
        .insert({
          user_id: user.id,
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating cart:", createError);
        return NextResponse.json({ error: "Failed to create cart" }, { status: 500 });
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
      return NextResponse.json({ error: "Failed to check cart item" }, { status: 500 });
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
        return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
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
        return NextResponse.json({ error: "Failed to add cart item" }, { status: 500 });
      }
    }

    // Get all cart items
    const { data: items, error: itemsError } = await supabase
      .from("cart_items")
      .select("quantity, price")
      .eq("cart_id", cartId);

    if (itemsError) {
      console.error("Error fetching cart items for total:", itemsError);
      return NextResponse.json({ error: "Failed to fetch cart items for total" }, { status: 500 });
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
      return NextResponse.json({ error: "Failed to update cart totals" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in add to cart API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get URL parameters
    const url = new URL(request.url);
    const itemId = url.searchParams.get("itemId");
    const clearAll = url.searchParams.get("clearAll") === "true";

    // Get the user's cart
    const { data: cart, error: cartError } = await supabase
      .from("shopping_carts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (cartError) {
      console.error("Error fetching cart:", cartError);
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (clearAll) {
      // Delete all cart items
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cart.id);

      if (deleteError) {
        console.error("Error clearing cart:", deleteError);
        return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
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
        return NextResponse.json({ error: "Failed to reset cart totals" }, { status: 500 });
      }
    } else if (itemId) {
      // Delete specific cart item
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId)
        .eq("cart_id", cart.id);

      if (deleteError) {
        console.error("Error removing cart item:", deleteError);
        return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 });
      }

      // Get all cart items
      const { data: items, error: itemsError } = await supabase
        .from("cart_items")
        .select("quantity, price")
        .eq("cart_id", cart.id);

      if (itemsError) {
        console.error("Error fetching cart items for total:", itemsError);
        return NextResponse.json({ error: "Failed to fetch cart items for total" }, { status: 500 });
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
        .eq("id", cart.id);

      if (updateError) {
        console.error("Error updating cart totals:", updateError);
        return NextResponse.json({ error: "Failed to update cart totals" }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: "Either itemId or clearAll parameter is required" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete cart item API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
