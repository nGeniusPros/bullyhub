-- =========================
-- Stud Services
-- =========================

CREATE TABLE public.stud_bookings (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  stud_service_id bigint NOT NULL REFERENCES stud_services(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  female_dog_id bigint NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, canceled
  scheduled_date timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.ai_receptionist_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text,
  intent_detected text,
  session_id uuid,
  timestamp timestamp with time zone DEFAULT now()
);

CREATE TABLE public.appointments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  breeder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  dog_id bigint REFERENCES dogs(id) ON DELETE CASCADE,
  appointment_type text, -- e.g., consultation, stud service, vaccination
  scheduled_time timestamp with time zone,
  status text DEFAULT 'pending', -- pending, confirmed, completed, canceled
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- =========================
-- Marketing
-- =========================

CREATE TABLE public.marketing_campaigns (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  breeder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  start_date date,
  end_date date,
  budget numeric,
  status text DEFAULT 'draft', -- draft, active, completed
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.marketing_assets (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  breeder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_type text, -- image, video, document
  url text NOT NULL,
  description text,
  tags text[],
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.clients (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  breeder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.client_interactions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_id bigint REFERENCES clients(id) ON DELETE CASCADE,
  breeder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type text, -- call, email, message
  content text,
  timestamp timestamp with time zone DEFAULT now()
);

CREATE TABLE public.educational_content (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  content text,
  content_type text, -- article, video, pdf
  category text,
  tags text[],
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.social_accounts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  breeder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL, -- Facebook, Instagram, etc.
  account_name text NOT NULL,
  access_token text,
  connected_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.social_posts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  social_account_id bigint REFERENCES social_accounts(id) ON DELETE CASCADE,
  content text,
  media_url text,
  scheduled_time timestamp with time zone,
  status text DEFAULT 'draft', -- draft, scheduled, published
  analytics_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.website_templates (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  description text,
  preview_url text,
  template_files_path text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.kennel_branding (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  breeder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  logo_url text,
  color_scheme jsonb,
  tagline text,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- =========================
-- Kennel Management
-- =========================

CREATE TABLE public.financial_transactions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  breeder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type text NOT NULL, -- income, expense
  amount numeric NOT NULL,
  category text,
  description text,
  date date NOT NULL,
  related_entity_id bigint,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.invoices (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  breeder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id bigint REFERENCES clients(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  due_date date,
  status text DEFAULT 'unpaid', -- unpaid, paid, overdue
  issued_date date DEFAULT CURRENT_DATE,
  paid_date date,
  description text
);

CREATE TABLE public.marketplace_listings (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  breeder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price numeric,
  category text,
  status text DEFAULT 'active', -- active, sold, removed
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.marketplace_offers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  listing_id bigint REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_amount numeric,
  status text DEFAULT 'pending', -- pending, accepted, rejected
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.reviews (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_entity_id bigint NOT NULL,
  entity_type text NOT NULL, -- breeder, listing, service
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now()
);

-- =========================
-- Account
-- =========================

CREATE TABLE public.user_settings (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_preferences jsonb,
  theme text DEFAULT 'light',
  language text DEFAULT 'en',
  billing_info jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- =========================
-- Row Level Security Policies
-- =========================

-- Stud Bookings
ALTER TABLE public.stud_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own stud bookings" ON public.stud_bookings
  FOR SELECT USING (client_id = auth.uid() OR EXISTS (SELECT 1 FROM stud_services WHERE stud_services.id = stud_bookings.stud_service_id AND stud_services.breeder_id = auth.uid()));
CREATE POLICY "Users can insert their own stud bookings" ON public.stud_bookings
  FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Users can update their own stud bookings" ON public.stud_bookings
  FOR UPDATE USING (client_id = auth.uid());
CREATE POLICY "Users can delete their own stud bookings" ON public.stud_bookings
  FOR DELETE USING (client_id = auth.uid());

-- AI Receptionist Logs
ALTER TABLE public.ai_receptionist_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own AI receptionist logs" ON public.ai_receptionist_logs
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own AI receptionist logs" ON public.ai_receptionist_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own appointments" ON public.appointments
  FOR SELECT USING (client_id = auth.uid() OR breeder_id = auth.uid());
CREATE POLICY "Users can insert their own appointments" ON public.appointments
  FOR INSERT WITH CHECK (client_id = auth.uid() OR breeder_id = auth.uid());
CREATE POLICY "Users can update their own appointments" ON public.appointments
  FOR UPDATE USING (client_id = auth.uid() OR breeder_id = auth.uid());
CREATE POLICY "Users can delete their own appointments" ON public.appointments
  FOR DELETE USING (client_id = auth.uid() OR breeder_id = auth.uid());

-- Clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Breeders can view their own clients" ON public.clients
  FOR SELECT USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can insert their own clients" ON public.clients
  FOR INSERT WITH CHECK (breeder_id = auth.uid());
CREATE POLICY "Breeders can update their own clients" ON public.clients
  FOR UPDATE USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can delete their own clients" ON public.clients
  FOR DELETE USING (breeder_id = auth.uid());

-- Client Interactions
ALTER TABLE public.client_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Breeders can view their own client interactions" ON public.client_interactions
  FOR SELECT USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can insert their own client interactions" ON public.client_interactions
  FOR INSERT WITH CHECK (breeder_id = auth.uid());
CREATE POLICY "Breeders can update their own client interactions" ON public.client_interactions
  FOR UPDATE USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can delete their own client interactions" ON public.client_interactions
  FOR DELETE USING (breeder_id = auth.uid());

-- Marketing Campaigns
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Breeders can view their own marketing campaigns" ON public.marketing_campaigns
  FOR SELECT USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can insert their own marketing campaigns" ON public.marketing_campaigns
  FOR INSERT WITH CHECK (breeder_id = auth.uid());
CREATE POLICY "Breeders can update their own marketing campaigns" ON public.marketing_campaigns
  FOR UPDATE USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can delete their own marketing campaigns" ON public.marketing_campaigns
  FOR DELETE USING (breeder_id = auth.uid());

-- Marketing Assets
ALTER TABLE public.marketing_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Breeders can view their own marketing assets" ON public.marketing_assets
  FOR SELECT USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can insert their own marketing assets" ON public.marketing_assets
  FOR INSERT WITH CHECK (breeder_id = auth.uid());
CREATE POLICY "Breeders can update their own marketing assets" ON public.marketing_assets
  FOR UPDATE USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can delete their own marketing assets" ON public.marketing_assets
  FOR DELETE USING (breeder_id = auth.uid());

-- Social Accounts
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Breeders can view their own social accounts" ON public.social_accounts
  FOR SELECT USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can insert their own social accounts" ON public.social_accounts
  FOR INSERT WITH CHECK (breeder_id = auth.uid());
CREATE POLICY "Breeders can update their own social accounts" ON public.social_accounts
  FOR UPDATE USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can delete their own social accounts" ON public.social_accounts
  FOR DELETE USING (breeder_id = auth.uid());

-- Social Posts
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Breeders can view their own social posts" ON public.social_posts
  FOR SELECT USING (EXISTS (SELECT 1 FROM social_accounts WHERE social_accounts.id = social_posts.social_account_id AND social_accounts.breeder_id = auth.uid()));
CREATE POLICY "Breeders can insert their own social posts" ON public.social_posts
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM social_accounts WHERE social_accounts.id = social_posts.social_account_id AND social_accounts.breeder_id = auth.uid()));
CREATE POLICY "Breeders can update their own social posts" ON public.social_posts
  FOR UPDATE USING (EXISTS (SELECT 1 FROM social_accounts WHERE social_accounts.id = social_posts.social_account_id AND social_accounts.breeder_id = auth.uid()));
CREATE POLICY "Breeders can delete their own social posts" ON public.social_posts
  FOR DELETE USING (EXISTS (SELECT 1 FROM social_accounts WHERE social_accounts.id = social_posts.social_account_id AND social_accounts.breeder_id = auth.uid()));

-- Kennel Branding
ALTER TABLE public.kennel_branding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Breeders can view their own branding" ON public.kennel_branding
  FOR SELECT USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can insert their own branding" ON public.kennel_branding
  FOR INSERT WITH CHECK (breeder_id = auth.uid());
CREATE POLICY "Breeders can update their own branding" ON public.kennel_branding
  FOR UPDATE USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can delete their own branding" ON public.kennel_branding
  FOR DELETE USING (breeder_id = auth.uid());

-- Financial Transactions
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Breeders can view their own financial transactions" ON public.financial_transactions
  FOR SELECT USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can insert their own financial transactions" ON public.financial_transactions
  FOR INSERT WITH CHECK (breeder_id = auth.uid());
CREATE POLICY "Breeders can update their own financial transactions" ON public.financial_transactions
  FOR UPDATE USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can delete their own financial transactions" ON public.financial_transactions
  FOR DELETE USING (breeder_id = auth.uid());

-- Invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Breeders can view their own invoices" ON public.invoices
  FOR SELECT USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can insert their own invoices" ON public.invoices
  FOR INSERT WITH CHECK (breeder_id = auth.uid());
CREATE POLICY "Breeders can update their own invoices" ON public.invoices
  FOR UPDATE USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can delete their own invoices" ON public.invoices
  FOR DELETE USING (breeder_id = auth.uid());

-- Marketplace Listings
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Breeders can view their own listings" ON public.marketplace_listings
  FOR SELECT USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can insert their own listings" ON public.marketplace_listings
  FOR INSERT WITH CHECK (breeder_id = auth.uid());
CREATE POLICY "Breeders can update their own listings" ON public.marketplace_listings
  FOR UPDATE USING (breeder_id = auth.uid());
CREATE POLICY "Breeders can delete their own listings" ON public.marketplace_listings
  FOR DELETE USING (breeder_id = auth.uid());

-- Marketplace Offers
ALTER TABLE public.marketplace_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can view their own offers" ON public.marketplace_offers
  FOR SELECT USING (buyer_id = auth.uid());
CREATE POLICY "Buyers can insert their own offers" ON public.marketplace_offers
  FOR INSERT WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Buyers can update their own offers" ON public.marketplace_offers
  FOR UPDATE USING (buyer_id = auth.uid());
CREATE POLICY "Buyers can delete their own offers" ON public.marketplace_offers
  FOR DELETE USING (buyer_id = auth.uid());

-- Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own reviews" ON public.reviews
  FOR SELECT USING (reviewer_id = auth.uid());
CREATE POLICY "Users can insert their own reviews" ON public.reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());
CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (reviewer_id = auth.uid());
CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (reviewer_id = auth.uid());

-- User Settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own settings" ON public.user_settings
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own settings" ON public.user_settings
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own settings" ON public.user_settings
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own settings" ON public.user_settings
  FOR DELETE USING (user_id = auth.uid());
