SET search_path TO public;

-- Create schema for PetPals App

-- Enable RLS (Row Level Security)
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

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

-- Fix: Allow insert into profiles
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

-- Migration: Add AI Advisor tables for health reminders and saved advice

CREATE TABLE health_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  category TEXT,
  priority TEXT,
  completed BOOLEAN DEFAULT FALSE,
  notify_before INTEGER DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE saved_advice (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE health_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_advice ENABLE ROW LEVEL SECURITY;

-- Policies for health_reminders
CREATE POLICY "Users can view their own health reminders"
  ON health_reminders FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own health reminders"
  ON health_reminders FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own health reminders"
  ON health_reminders FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own health reminders"
  ON health_reminders FOR DELETE
  USING (user_id = auth.uid());

-- Policies for saved_advice
CREATE POLICY "Users can view their own saved advice"
  ON saved_advice FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own saved advice"
  ON saved_advice FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own saved advice"
  ON saved_advice FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own saved advice"
  ON saved_advice FOR DELETE
  USING (user_id = auth.uid());

-- Create vaccinations table for comprehensive health records

CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
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

-- Create training_courses table
create table if not exists training_courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  level text,
  duration text,
  lessons integer,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create training_sessions table
create table if not exists training_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references training_courses(id) on delete cascade,
  date date not null,
  time time not null,
  duration integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
