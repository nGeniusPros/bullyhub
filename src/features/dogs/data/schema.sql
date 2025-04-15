-- Dogs Feature Schema

-- Dogs Table
CREATE TABLE IF NOT EXISTS dogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  date_of_birth DATE,
  color TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_stud BOOLEAN DEFAULT FALSE,
  profile_image_url TEXT,
  weight DECIMAL(10, 2),
  height DECIMAL(10, 2),
  microchip_number TEXT,
  registration_number TEXT,
  breeding_program_id UUID REFERENCES breeding_programs(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_dogs_owner_id ON dogs(owner_id);
CREATE INDEX IF NOT EXISTS idx_dogs_breeding_program_id ON dogs(breeding_program_id);

-- Pedigree Table (for storing dog ancestry relationships)
CREATE TABLE IF NOT EXISTS pedigrees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  sire_id UUID REFERENCES dogs(id) ON DELETE SET NULL,
  dam_id UUID REFERENCES dogs(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(dog_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_pedigrees_dog_id ON pedigrees(dog_id);
CREATE INDEX IF NOT EXISTS idx_pedigrees_sire_id ON pedigrees(sire_id);
CREATE INDEX IF NOT EXISTS idx_pedigrees_dam_id ON pedigrees(dam_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the updated_at timestamp on dogs table
CREATE TRIGGER update_dogs_updated_at
BEFORE UPDATE ON dogs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update the updated_at timestamp on pedigrees table
CREATE TRIGGER update_pedigrees_updated_at
BEFORE UPDATE ON pedigrees
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
