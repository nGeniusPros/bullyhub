-- Marketing Suite Schema Updates

-- Create clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breeder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'USA',
  status TEXT DEFAULT 'prospect', -- prospect, active, past
  source TEXT, -- how they found you
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_interactions table
CREATE TABLE client_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL, -- email, call, meeting, social, etc.
  interaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  follow_up_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_records table
CREATE TABLE financial_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breeder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  record_type TEXT NOT NULL, -- income, expense
  category TEXT NOT NULL, -- stud fee, puppy sale, food, vet, etc.
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  related_dog_id UUID REFERENCES dogs(id) ON DELETE SET NULL,
  related_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketing_assets table
CREATE TABLE marketing_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breeder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  asset_type TEXT NOT NULL, -- logo, banner, social post, etc.
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create educational_content table
CREATE TABLE educational_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breeder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL, -- article, video, graphic
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- for articles
  media_url TEXT, -- for videos and graphics
  thumbnail_url TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stud_marketing table
CREATE TABLE stud_marketing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stud_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  dna_highlights JSONB, -- key genetic traits to highlight
  color_genetics JSONB, -- color genetic information
  health_clearances JSONB, -- health clearances information
  fee_structure JSONB, -- base fee, special terms, etc.
  availability_calendar JSONB, -- availability dates
  success_metrics JSONB, -- conception rates, litter sizes, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stud_production_history table
CREATE TABLE stud_production_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stud_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  litter_id UUID REFERENCES litters(id) ON DELETE SET NULL,
  dam_id UUID REFERENCES dogs(id) ON DELETE SET NULL,
  whelping_date DATE,
  puppy_count INTEGER,
  color_outcomes JSONB,
  testimonial TEXT,
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kennel_websites table
CREATE TABLE kennel_websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breeder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  template_type TEXT NOT NULL, -- professional-breeder, show-kennel, family-breeder, multi-service-kennel
  site_name TEXT NOT NULL,
  domain TEXT,
  logo_url TEXT,
  color_scheme JSONB,
  content JSONB, -- pages content
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE stud_marketing ENABLE ROW LEVEL SECURITY;
ALTER TABLE stud_production_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE kennel_websites ENABLE ROW LEVEL SECURITY;

-- Clients policies
CREATE POLICY "Breeders can view their own clients"
  ON clients FOR SELECT
  USING (auth.uid() = breeder_id);

CREATE POLICY "Breeders can insert their own clients"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() = breeder_id);

CREATE POLICY "Breeders can update their own clients"
  ON clients FOR UPDATE
  USING (auth.uid() = breeder_id);

CREATE POLICY "Breeders can delete their own clients"
  ON clients FOR DELETE
  USING (auth.uid() = breeder_id);

-- Similar policies for other tables
-- Client interactions
CREATE POLICY "Breeders can view their own client interactions"
  ON client_interactions FOR SELECT
  USING (auth.uid() = (SELECT breeder_id FROM clients WHERE id = client_id));

-- Financial records
CREATE POLICY "Breeders can view their own financial records"
  ON financial_records FOR SELECT
  USING (auth.uid() = breeder_id);

-- Marketing assets
CREATE POLICY "Breeders can view their own marketing assets"
  ON marketing_assets FOR SELECT
  USING (auth.uid() = breeder_id);

-- Educational content
CREATE POLICY "Breeders can view their own educational content"
  ON educational_content FOR SELECT
  USING (auth.uid() = breeder_id);

-- Stud marketing
CREATE POLICY "Breeders can view stud marketing for dogs they own"
  ON stud_marketing FOR SELECT
  USING (auth.uid() = (SELECT owner_id FROM dogs WHERE id = stud_id));

-- Stud production history
CREATE POLICY "Breeders can view stud production history for dogs they own"
  ON stud_production_history FOR SELECT
  USING (auth.uid() = (SELECT owner_id FROM dogs WHERE id = stud_id));

-- Kennel websites
CREATE POLICY "Breeders can view their own kennel websites"
  ON kennel_websites FOR SELECT
  USING (auth.uid() = breeder_id);
