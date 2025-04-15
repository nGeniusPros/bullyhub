import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import ShoppingCart from '../ShoppingCart';
import { useMarketplaceQueries } from '../../data/queries';

// Mock the dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../data/queries', () => ({
  useMarketplaceQueries: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/image', () => {
  return ({ src, alt, fill, className }: { src: string; alt: string; fill?: boolean; className?: string }) => {
    return <img src={src} alt={alt} className={className} />;
  };
});

describe('ShoppingCart Component', () => {
  const mockCart = {
    id: '123',
    userId: 'user123',
    items: [
      {
        id: 'item1',
        productId: 'prod1',
        quantity: 2,
        price: 19.99,
        product: {
          id: 'prod1',
          name: 'Test Product',
          slug: 'test-product',
          description: 'A test product',
          price: 19.99,
          images: ['https://example.com/image.jpg'],
          categoryId: 'cat1',
          featured: false,
          inStock: true,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          category: {
            id: 'cat1',
            name: 'Test Category',
            slug: 'test-category',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
          },
        },
      },
    ],
    subtotal: 39.98,
    tax: 2.80,
    shipping: 5.99,
    total: 48.77,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  };

  const mockMarketplaceQueries = {
    getUserCart: jest.fn().mockResolvedValue(mockCart),
    updateCartItemQuantity: jest.fn().mockResolvedValue(true),
    removeFromCart: jest.fn().mockResolvedValue(true),
    clearCart: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMarketplaceQueries as jest.Mock).mockReturnValue(mockMarketplaceQueries);
  });

  it('renders loading state initially', () => {
    render(<ShoppingCart />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty cart message when cart has no items', async () => {
    mockMarketplaceQueries.getUserCart.mockResolvedValueOnce({
      ...mockCart,
      items: [],
    });

    render(<ShoppingCart />);
    
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Browse Products')).toBeInTheDocument();
  });

  it('renders cart items when cart has items', async () => {
    render(<ShoppingCart />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Quantity
  });

  it('handles quantity update', async () => {
    render(<ShoppingCart />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    // Find the increase quantity button and click it
    const increaseButton = screen.getByRole('button', { name: /\+/i });
    fireEvent.click(increaseButton);
    
    await waitFor(() => {
      expect(mockMarketplaceQueries.updateCartItemQuantity).toHaveBeenCalledWith('item1', 3);
    });
    
    expect(toast.success).toHaveBeenCalledWith('Cart updated');
  });

  it('handles item removal', async () => {
    render(<ShoppingCart />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    // Find the remove button and click it
    const removeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(removeButton);
    
    await waitFor(() => {
      expect(mockMarketplaceQueries.removeFromCart).toHaveBeenCalledWith('item1');
    });
    
    expect(toast.success).toHaveBeenCalledWith('Item removed from cart');
  });

  it('handles checkout', async () => {
    render(<ShoppingCart />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    // Find the checkout button and click it
    const checkoutButton = screen.getByRole('button', { name: /checkout/i });
    fireEvent.click(checkoutButton);
    
    await waitFor(() => {
      expect(mockMarketplaceQueries.clearCart).toHaveBeenCalled();
    });
    
    expect(toast.success).toHaveBeenCalledWith('Order placed successfully!');
  });
});
