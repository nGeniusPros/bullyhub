-- Create breeding plans table
CREATE TABLE breeding_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breeder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  breeding_program_id UUID REFERENCES breeding_programs(id) ON DELETE SET NULL,
  sire_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  dam_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  planned_date DATE,
  status TEXT NOT NULL CHECK (status IN ('planned', 'in-progress', 'completed', 'cancelled')),
  notes TEXT,
  ai_recommendations JSONB,
  compatibility JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX breeding_plans_breeder_id_idx ON breeding_plans(breeder_id);
CREATE INDEX breeding_plans_breeding_program_id_idx ON breeding_plans(breeding_program_id);
CREATE INDEX breeding_plans_sire_id_idx ON breeding_plans(sire_id);
CREATE INDEX breeding_plans_dam_id_idx ON breeding_plans(dam_id);
CREATE INDEX breeding_plans_status_idx ON breeding_plans(status);

-- Create breeding compatibility analyses table to store analysis results
CREATE TABLE breeding_compatibility_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sire_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  dam_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  breeding_program_id UUID REFERENCES breeding_programs(id) ON DELETE SET NULL,
  compatibility_score INTEGER NOT NULL,
  color_predictions JSONB,
  health_risks JSONB,
  coi FLOAT,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX breeding_compatibility_analyses_user_id_idx ON breeding_compatibility_analyses(user_id);
CREATE INDEX breeding_compatibility_analyses_sire_id_idx ON breeding_compatibility_analyses(sire_id);
CREATE INDEX breeding_compatibility_analyses_dam_id_idx ON breeding_compatibility_analyses(dam_id);

-- Create AI conversations table to store AI advisor interactions
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX ai_conversations_user_id_idx ON ai_conversations(user_id);

-- Enable Row Level Security
ALTER TABLE breeding_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeding_compatibility_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for breeding_plans
CREATE POLICY "Breeders can view their own breeding plans"
  ON breeding_plans FOR SELECT
  USING (breeder_id = auth.uid());

CREATE POLICY "Breeders can insert their own breeding plans"
  ON breeding_plans FOR INSERT
  WITH CHECK (breeder_id = auth.uid());

CREATE POLICY "Breeders can update their own breeding plans"
  ON breeding_plans FOR UPDATE
  USING (breeder_id = auth.uid());

CREATE POLICY "Breeders can delete their own breeding plans"
  ON breeding_plans FOR DELETE
  USING (breeder_id = auth.uid());

-- Create RLS policies for breeding_compatibility_analyses
CREATE POLICY "Users can view their own breeding compatibility analyses"
  ON breeding_compatibility_analyses FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own breeding compatibility analyses"
  ON breeding_compatibility_analyses FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create RLS policies for ai_conversations
CREATE POLICY "Users can view their own AI conversations"
  ON ai_conversations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own AI conversations"
  ON ai_conversations FOR INSERT
  WITH CHECK (user_id = auth.uid());
