import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductList } from '../../components/ProductList';
import { marketplaceQueries } from '../../data/queries';

// Mock the marketplace queries
jest.mock('../../data/queries', () => ({
  marketplaceQueries: {
    getAllProducts: jest.fn(),
    getAllCategories: jest.fn(),
  },
  useMarketplaceQueries: () => ({
    products: { data: mockProducts, isLoading: false, error: null },
    categories: { data: mockCategories, isLoading: false, error: null },
  }),
}));

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'Test description 1',
    price: 19.99,
    image_url: 'https://example.com/image1.jpg',
    category_id: '1',
    category: { id: '1', name: 'Test Category 1' },
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'Test description 2',
    price: 29.99,
    image_url: 'https://example.com/image2.jpg',
    category_id: '2',
    category: { id: '2', name: 'Test Category 2' },
  },
];

const mockCategories = [
  { id: '1', name: 'Test Category 1' },
  { id: '2', name: 'Test Category 2' },
];

describe('ProductList Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock implementation
    marketplaceQueries.getAllProducts.mockResolvedValue(mockProducts);
    marketplaceQueries.getAllCategories.mockResolvedValue(mockCategories);
  });

  it('renders the product list component', () => {
    render(<ProductList />);
    
    // Check if the component renders
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
  });

  it('displays products when data is loaded', async () => {
    render(<ProductList />);
    
    // Check if products are displayed
    expect(await screen.findByText('Test Product 1')).toBeInTheDocument();
    expect(await screen.findByText('Test Product 2')).toBeInTheDocument();
  });

  it('displays categories when data is loaded', async () => {
    render(<ProductList />);
    
    // Check if categories are displayed
    expect(await screen.findByText('Test Category 1')).toBeInTheDocument();
    expect(await screen.findByText('Test Category 2')).toBeInTheDocument();
  });
});
