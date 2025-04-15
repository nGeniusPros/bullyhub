-- Marketplace Feature Schema

-- Product Categories Table
CREATE TABLE IF NOT EXISTS marketplace_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES marketplace_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS marketplace_categories_slug_idx ON marketplace_categories(slug);
CREATE INDEX IF NOT EXISTS marketplace_categories_parent_id_idx ON marketplace_categories(parent_id);

-- Products Table
CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  category_id UUID REFERENCES marketplace_categories(id) NOT NULL,
  vendor_id UUID,
  featured BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  attributes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS marketplace_products_slug_idx ON marketplace_products(slug);
CREATE INDEX IF NOT EXISTS marketplace_products_category_id_idx ON marketplace_products(category_id);
CREATE INDEX IF NOT EXISTS marketplace_products_vendor_id_idx ON marketplace_products(vendor_id);
CREATE INDEX IF NOT EXISTS marketplace_products_featured_idx ON marketplace_products(featured);

-- Shopping Carts Table
CREATE TABLE IF NOT EXISTS shopping_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  shipping DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS shopping_carts_user_id_idx ON shopping_carts(user_id);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES shopping_carts(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS cart_items_cart_id_idx ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS cart_items_product_id_idx ON cart_items(product_id);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON orders(payment_status);

-- Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images JSONB,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS product_reviews_product_id_idx ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS product_reviews_user_id_idx ON product_reviews(user_id);

-- Affiliate Links Table
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  commission DECIMAL(5, 2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS affiliate_links_product_id_idx ON affiliate_links(product_id);
CREATE INDEX IF NOT EXISTS affiliate_links_platform_idx ON affiliate_links(platform);

-- Row Level Security Policies

-- Product Categories
ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view categories
CREATE POLICY marketplace_categories_select_policy ON marketplace_categories
  FOR SELECT USING (true);

-- Allow only admins to insert, update, delete categories
CREATE POLICY marketplace_categories_insert_policy ON marketplace_categories
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY marketplace_categories_update_policy ON marketplace_categories
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY marketplace_categories_delete_policy ON marketplace_categories
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Products
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view products
CREATE POLICY marketplace_products_select_policy ON marketplace_products
  FOR SELECT USING (true);

-- Allow only admins to insert, update, delete products
CREATE POLICY marketplace_products_insert_policy ON marketplace_products
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY marketplace_products_update_policy ON marketplace_products
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY marketplace_products_delete_policy ON marketplace_products
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Shopping Carts
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own carts
CREATE POLICY shopping_carts_select_policy ON shopping_carts
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Allow users to insert their own carts
CREATE POLICY shopping_carts_insert_policy ON shopping_carts
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- Allow users to update their own carts
CREATE POLICY shopping_carts_update_policy ON shopping_carts
  FOR UPDATE USING (
    auth.uid() = user_id
  );

-- Allow users to delete their own carts
CREATE POLICY shopping_carts_delete_policy ON shopping_carts
  FOR DELETE USING (
    auth.uid() = user_id
  );

-- Cart Items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own cart items
CREATE POLICY cart_items_select_policy ON cart_items
  FOR SELECT USING (
    cart_id IN (
      SELECT id FROM shopping_carts WHERE user_id = auth.uid()
    )
  );

-- Allow users to insert items into their own carts
CREATE POLICY cart_items_insert_policy ON cart_items
  FOR INSERT WITH CHECK (
    cart_id IN (
      SELECT id FROM shopping_carts WHERE user_id = auth.uid()
    )
  );

-- Allow users to update items in their own carts
CREATE POLICY cart_items_update_policy ON cart_items
  FOR UPDATE USING (
    cart_id IN (
      SELECT id FROM shopping_carts WHERE user_id = auth.uid()
    )
  );

-- Allow users to delete items from their own carts
CREATE POLICY cart_items_delete_policy ON cart_items
  FOR DELETE USING (
    cart_id IN (
      SELECT id FROM shopping_carts WHERE user_id = auth.uid()
    )
  );

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own orders
CREATE POLICY orders_select_policy ON orders
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Allow users to insert their own orders
CREATE POLICY orders_insert_policy ON orders
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- Allow users to update their own orders
CREATE POLICY orders_update_policy ON orders
  FOR UPDATE USING (
    auth.uid() = user_id
  );

-- Allow admins to view all orders
CREATE POLICY orders_select_admin_policy ON orders
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Allow admins to update all orders
CREATE POLICY orders_update_admin_policy ON orders
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Product Reviews
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view reviews
CREATE POLICY product_reviews_select_policy ON product_reviews
  FOR SELECT USING (true);

-- Allow users to insert their own reviews
CREATE POLICY product_reviews_insert_policy ON product_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- Allow users to update their own reviews
CREATE POLICY product_reviews_update_policy ON product_reviews
  FOR UPDATE USING (
    auth.uid() = user_id
  );

-- Allow users to delete their own reviews
CREATE POLICY product_reviews_delete_policy ON product_reviews
  FOR DELETE USING (
    auth.uid() = user_id
  );

-- Affiliate Links
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view affiliate links
CREATE POLICY affiliate_links_select_policy ON affiliate_links
  FOR SELECT USING (true);

-- Allow only admins to insert, update, delete affiliate links
CREATE POLICY affiliate_links_insert_policy ON affiliate_links
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY affiliate_links_update_policy ON affiliate_links
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY affiliate_links_delete_policy ON affiliate_links
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );
