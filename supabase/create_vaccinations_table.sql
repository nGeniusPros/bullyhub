SET search_path TO public;

-- Create vaccinations table for comprehensive health records

CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id BIGINT REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  vaccine_name TEXT NOT NULL,
  vaccine_type TEXT, -- Core or non-core
  manufacturer TEXT,
  lot_number TEXT,
  date_administered DATE NOT NULL,
  next_due_date DATE,
  administering_vet TEXT,
  reactions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own dogs' vaccinations"
  ON vaccinations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dogs
      WHERE dogs.id = vaccinations.dog_id
      AND dogs.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert vaccinations for their own dogs"
  ON vaccinations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dogs
      WHERE dogs.id = vaccinations.dog_id
      AND dogs.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update vaccinations for their own dogs"
  ON vaccinations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM dogs
      WHERE dogs.id = vaccinations.dog_id
      AND dogs.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete vaccinations for their own dogs"
  ON vaccinations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM dogs
      WHERE dogs.id = vaccinations.dog_id
      AND dogs.owner_id = auth.uid()
    )
  );
