-- Stud Services Feature Schema

-- Stud Services Table
CREATE TABLE IF NOT EXISTS stud_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stud_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  fee DECIMAL(10, 2) NOT NULL,
  description TEXT,
  availability BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS stud_services_stud_id_idx ON stud_services(stud_id);

-- Stud Bookings Table
CREATE TABLE IF NOT EXISTS stud_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stud_service_id UUID REFERENCES stud_services(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  female_dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, canceled
  scheduled_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS stud_bookings_stud_service_id_idx ON stud_bookings(stud_service_id);
CREATE INDEX IF NOT EXISTS stud_bookings_client_id_idx ON stud_bookings(client_id);
CREATE INDEX IF NOT EXISTS stud_bookings_female_dog_id_idx ON stud_bookings(female_dog_id);

-- Stud Receptionist Conversations Table
CREATE TABLE IF NOT EXISTS stud_receptionist_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stud_service_id UUID REFERENCES stud_services(id) ON DELETE CASCADE NOT NULL,
  customer_email TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active', -- active, closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS stud_receptionist_conversations_stud_service_id_idx ON stud_receptionist_conversations(stud_service_id);

-- Stud Marketing Table
CREATE TABLE IF NOT EXISTS stud_marketing (
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

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS stud_marketing_stud_id_idx ON stud_marketing(stud_id);

-- Row Level Security Policies

-- Stud Services
ALTER TABLE stud_services ENABLE ROW LEVEL SECURITY;

-- Allow users to view all stud services
CREATE POLICY stud_services_select_policy ON stud_services
  FOR SELECT USING (true);

-- Allow users to insert stud services for their own dogs
CREATE POLICY stud_services_insert_policy ON stud_services
  FOR INSERT WITH CHECK (
    stud_id IN (
      SELECT id FROM dogs WHERE owner_id = auth.uid()
    )
  );

-- Allow users to update stud services for their own dogs
CREATE POLICY stud_services_update_policy ON stud_services
  FOR UPDATE USING (
    stud_id IN (
      SELECT id FROM dogs WHERE owner_id = auth.uid()
    )
  );

-- Allow users to delete stud services for their own dogs
CREATE POLICY stud_services_delete_policy ON stud_services
  FOR DELETE USING (
    stud_id IN (
      SELECT id FROM dogs WHERE owner_id = auth.uid()
    )
  );

-- Stud Bookings
ALTER TABLE stud_bookings ENABLE ROW LEVEL SECURITY;

-- Allow stud owners to view bookings for their stud services
CREATE POLICY stud_bookings_select_stud_owner_policy ON stud_bookings
  FOR SELECT USING (
    stud_service_id IN (
      SELECT id FROM stud_services WHERE stud_id IN (
        SELECT id FROM dogs WHERE owner_id = auth.uid()
      )
    )
  );

-- Allow clients to view their own bookings
CREATE POLICY stud_bookings_select_client_policy ON stud_bookings
  FOR SELECT USING (
    client_id = auth.uid()
  );

-- Allow clients to insert bookings for their own dogs
CREATE POLICY stud_bookings_insert_policy ON stud_bookings
  FOR INSERT WITH CHECK (
    client_id = auth.uid() AND
    female_dog_id IN (
      SELECT id FROM dogs WHERE owner_id = auth.uid()
    )
  );

-- Allow clients to update their own bookings
CREATE POLICY stud_bookings_update_client_policy ON stud_bookings
  FOR UPDATE USING (
    client_id = auth.uid()
  );

-- Allow stud owners to update bookings for their stud services
CREATE POLICY stud_bookings_update_stud_owner_policy ON stud_bookings
  FOR UPDATE USING (
    stud_service_id IN (
      SELECT id FROM stud_services WHERE stud_id IN (
        SELECT id FROM dogs WHERE owner_id = auth.uid()
      )
    )
  );

-- Allow clients to delete their own bookings
CREATE POLICY stud_bookings_delete_policy ON stud_bookings
  FOR DELETE USING (
    client_id = auth.uid()
  );
