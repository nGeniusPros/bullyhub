-- Create health clearances table
CREATE TABLE health_clearances (
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
CREATE INDEX health_clearances_dog_id_idx ON health_clearances(dog_id);
