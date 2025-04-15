-- Health Clearances Feature Schema

-- Health Clearances Table
CREATE TABLE IF NOT EXISTS health_clearances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  test TEXT NOT NULL,
  date DATE NOT NULL,
  result TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed', 'pending', 'failed')),
  expiry_date DATE,
  verification_number TEXT NOT NULL,
  notes TEXT,
  documents JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS health_clearances_dog_id_idx ON health_clearances(dog_id);
CREATE INDEX IF NOT EXISTS health_clearances_verification_number_idx ON health_clearances(verification_number);

-- Health Clearance Templates Table
CREATE TABLE IF NOT EXISTS health_clearance_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breed TEXT NOT NULL,
  test TEXT NOT NULL,
  description TEXT,
  recommended BOOLEAN DEFAULT FALSE,
  required_frequency TEXT, -- e.g., 'annual', 'one-time', 'every 2 years'
  typical_cost_range JSONB, -- e.g., { "min": 50, "max": 200, "currency": "USD" }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health Clearance Reminders Table
CREATE TABLE IF NOT EXISTS health_clearance_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clearance_id UUID REFERENCES health_clearances(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reminder_date DATE NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Health Clearances
ALTER TABLE health_clearances ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own dogs' health clearances
CREATE POLICY health_clearances_select_policy ON health_clearances
  FOR SELECT USING (
    dog_id IN (
      SELECT id FROM dogs WHERE owner_id = auth.uid()
    )
  );

-- Allow users to insert health clearances for their own dogs
CREATE POLICY health_clearances_insert_policy ON health_clearances
  FOR INSERT WITH CHECK (
    dog_id IN (
      SELECT id FROM dogs WHERE owner_id = auth.uid()
    )
  );

-- Allow users to update health clearances for their own dogs
CREATE POLICY health_clearances_update_policy ON health_clearances
  FOR UPDATE USING (
    dog_id IN (
      SELECT id FROM dogs WHERE owner_id = auth.uid()
    )
  );

-- Allow users to delete health clearances for their own dogs
CREATE POLICY health_clearances_delete_policy ON health_clearances
  FOR DELETE USING (
    dog_id IN (
      SELECT id FROM dogs WHERE owner_id = auth.uid()
    )
  );
