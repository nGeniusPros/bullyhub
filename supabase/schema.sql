-- Create schema for Bully Hub App

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('breeder', 'petOwner');
CREATE TYPE dna_provider AS ENUM ('AnimalGenetics', 'Embark', 'Other');
CREATE TYPE health_status AS ENUM ('Clear', 'Carrier', 'At Risk');
CREATE TYPE risk_level AS ENUM ('Low', 'Medium', 'High');

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  role user_role NOT NULL DEFAULT 'petOwner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create dogs table
CREATE TABLE dogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  date_of_birth DATE,
  color TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_stud BOOLEAN DEFAULT FALSE,
  breeding_program_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create DNA test results table
CREATE TABLE dna_test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  provider dna_provider NOT NULL,
  test_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create genetic markers table
CREATE TABLE genetic_markers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dna_test_id UUID REFERENCES dna_test_results(id) ON DELETE CASCADE NOT NULL,
  locus TEXT NOT NULL,
  alleles JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health markers table
CREATE TABLE health_markers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dna_test_id UUID REFERENCES dna_test_results(id) ON DELETE CASCADE NOT NULL,
  condition TEXT NOT NULL,
  status health_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stud services table
CREATE TABLE stud_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stud_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  fee DECIMAL(10, 2) NOT NULL,
  description TEXT,
  availability BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create breeding programs table
CREATE TABLE breeding_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breeder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  goals JSONB,
  program_type TEXT NOT NULL, -- e.g., 'standard', 'rare', 'specialized'
  color_focus TEXT NOT NULL, -- e.g., 'brindle', 'blue', 'fluffy'
  health_protocols JSONB,
  cost_range JSONB, -- { min: number, max: number }
  special_considerations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for breeding_program_id in dogs table
ALTER TABLE dogs ADD CONSTRAINT fk_dogs_breeding_program
  FOREIGN KEY (breeding_program_id) REFERENCES breeding_programs(id) ON DELETE SET NULL;

-- Add health protocols table
CREATE TABLE health_protocols (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breeding_program_id UUID REFERENCES breeding_programs(id) ON DELETE CASCADE,
  protocol_name TEXT NOT NULL,
  description TEXT,
  required BOOLEAN DEFAULT true,
  frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create litters table
CREATE TABLE litters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breeding_program_id UUID REFERENCES breeding_programs(id) ON DELETE CASCADE,
  sire_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  dam_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  whelping_date DATE,
  puppy_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create puppies table
CREATE TABLE puppies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  litter_id UUID REFERENCES litters(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  color TEXT,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dna_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE genetic_markers ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_markers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stud_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeding_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE litters ENABLE ROW LEVEL SECURITY;
ALTER TABLE puppies ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Dogs policies
CREATE POLICY "Users can view their own dogs"
  ON dogs FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own dogs"
  ON dogs FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own dogs"
  ON dogs FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own dogs"
  ON dogs FOR DELETE
  USING (owner_id = auth.uid());

-- Stud services policies
CREATE POLICY "Anyone can view stud services"
  ON stud_services FOR SELECT
  USING (true);

CREATE POLICY "Breeders can insert stud services for their dogs"
  ON stud_services FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM dogs
    JOIN profiles ON dogs.owner_id = profiles.id
    WHERE dogs.id = stud_services.stud_id
    AND profiles.id = auth.uid()
    AND profiles.role = 'breeder'
  ));

CREATE POLICY "Breeders can update their stud services"
  ON stud_services FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = stud_services.stud_id
    AND dogs.owner_id = auth.uid()
  ));

CREATE POLICY "Breeders can delete their stud services"
  ON stud_services FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = stud_services.stud_id
    AND dogs.owner_id = auth.uid()
  ));

-- Create functions for automatic triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name, role)
  VALUES (new.id, '', '', 'petOwner');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Fix: Allow trigger to insert into profiles
CREATE POLICY "Allow insert into profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- TEMP: Disable trigger to allow user creation without error
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- After user is created, insert profile manually:
-- Replace <USER_ID> with the actual user UUID after creation
-- INSERT INTO profiles (id, first_name, last_name, role)
-- VALUES ('<USER_ID>', 'Test', 'User', 'petOwner');

-- Re-enable trigger after manual insert
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
