-- Breeding Programs Feature - Database Schema

-- Breeding Programs Table
CREATE TABLE IF NOT EXISTS breeding_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  breeder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goals TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add breeding_program_id to dogs table if it doesn't exist
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS breeding_program_id UUID REFERENCES breeding_programs(id) ON DELETE SET NULL;

-- Breeding Pairs Table
CREATE TABLE IF NOT EXISTS breeding_pairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breeding_program_id UUID NOT NULL REFERENCES breeding_programs(id) ON DELETE CASCADE,
  sire_id UUID NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  dam_id UUID NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(breeding_program_id, sire_id, dam_id)
);

-- Breeding Events Table
CREATE TABLE IF NOT EXISTS breeding_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breeding_pair_id UUID NOT NULL REFERENCES breeding_pairs(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Litters Table
CREATE TABLE IF NOT EXISTS litters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breeding_pair_id UUID NOT NULL REFERENCES breeding_pairs(id) ON DELETE CASCADE,
  whelp_date DATE,
  puppy_count INTEGER,
  males INTEGER,
  females INTEGER,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'planned',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add litter_id to dogs table if it doesn't exist
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS litter_id UUID REFERENCES litters(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_breeding_programs_breeder_id ON breeding_programs(breeder_id);
CREATE INDEX IF NOT EXISTS idx_dogs_breeding_program_id ON dogs(breeding_program_id);
CREATE INDEX IF NOT EXISTS idx_breeding_pairs_program_id ON breeding_pairs(breeding_program_id);
CREATE INDEX IF NOT EXISTS idx_breeding_events_pair_id ON breeding_events(breeding_pair_id);
CREATE INDEX IF NOT EXISTS idx_litters_breeding_pair_id ON litters(breeding_pair_id);
CREATE INDEX IF NOT EXISTS idx_dogs_litter_id ON dogs(litter_id);
