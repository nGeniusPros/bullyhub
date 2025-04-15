import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart as CartIcon, 
  Trash2, 
  Loader2, 
  AlertCircle,
  ChevronLeft,
  Plus,
  Minus,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { CartItem, ShoppingCart as ShoppingCartType } from "../types";
import { useMarketplaceQueries } from "../data/queries";
import { formatCurrency } from "@/lib/utils";

export default function ShoppingCart() {
  const [cart, setCart] = useState<ShoppingCartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  
  const marketplaceQueries = useMarketplaceQueries();

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const userCart = await marketplaceQueries.getUserCart();
        setCart(userCart);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load your shopping cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Handle quantity update
  const handleUpdateQuantity = async (itemId: string, change: number) => {
    if (!cart) return;
    
    const item = cart.items.find(i => i.id === itemId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;
    
    setUpdatingItem(itemId);
    try {
      await marketplaceQueries.updateCartItemQuantity(itemId, newQuantity);
      
      // Update local state
      setCart(prevCart => {
        if (!prevCart) return null;
        
        const updatedItems = prevCart.items.map(i => 
          i.id === itemId ? { ...i, quantity: newQuantity } : i
        );
        
        // Recalculate totals
        const subtotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const tax = subtotal * 0.07; // 7% tax
        const shipping = subtotal > 0 ? 5.99 : 0;
        const total = subtotal + tax + shipping;
        
        return {
          ...prevCart,
          items: updatedItems,
          subtotal,
          tax,
          shipping,
          total
        };
      });
      
      toast.success("Cart updated");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Handle item removal
  const handleRemoveItem = async (itemId: string) => {
    if (!cart) return;
    
    setUpdatingItem(itemId);
    try {
      await marketplaceQueries.removeFromCart(itemId);
      
      // Update local state
      setCart(prevCart => {
        if (!prevCart) return null;
        
        const updatedItems = prevCart.items.filter(i => i.id !== itemId);
        
        // Recalculate totals
        const subtotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const tax = subtotal * 0.07; // 7% tax
        const shipping = subtotal > 0 ? 5.99 : 0;
        const total = subtotal + tax + shipping;
        
        return {
          ...prevCart,
          items: updatedItems,
          subtotal,
          tax,
          shipping,
          total
        };
      });
      
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    
    setProcessingCheckout(true);
    try {
      // In a real implementation, this would redirect to a payment processor
      // For now, we'll just simulate a successful checkout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear the cart after successful checkout
      await marketplaceQueries.clearCart();
      
      // Update local state
      setCart(prevCart => {
        if (!prevCart) return null;
        
        return {
          ...prevCart,
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0
        };
      });
      
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to process your order");
    } finally {
      setProcessingCheckout(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <p className="text-muted-foreground">
              Your shopping cart is empty
            </p>
          </div>
          <Link href="/dashboard/marketplace">
            <Button className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Button>
          </Link>
        </div>
        
        <Card className="bg-gradient-to-br from-purple-50 to-teal-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CartIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any products to your cart yet
              </p>
              <Link href="/dashboard/marketplace">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <p className="text-muted-foreground">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Link href="/dashboard/marketplace">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Button>
        </Link>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id} className="bg-gradient-to-br from-purple-50 to-teal-50">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {item.product?.images && item.product.images.length > 0 ? (
                    <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product?.name || 'Product image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <Link 
                        href={`/dashboard/marketplace/products/${item.productId}`}
                        className="font-medium hover:underline"
                      >
                        {item.product?.name || 'Unknown Product'}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updatingItem === item.id}
                      >
                        {updatingItem === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {item.product?.category && (
                      <p className="text-sm text-muted-foreground">
                        {item.product.category.name}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          disabled={updatingItem === item.id || item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          disabled={updatingItem === item.id}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div>
          <Card className="bg-gradient-to-br from-purple-50 to-teal-50">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (7%)</span>
                <span>{formatCurrency(cart.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatCurrency(cart.shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
                disabled={processingCheckout}
              >
                {processingCheckout ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
