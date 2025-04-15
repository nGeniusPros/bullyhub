-- DNA Testing Feature Schema

-- DNA Test Results Table
CREATE TABLE IF NOT EXISTS dna_test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  test_type TEXT NOT NULL, -- e.g., 'color-genetics', 'health-markers', 'breed-verification'
  test_provider TEXT NOT NULL, -- e.g., 'Embark', 'Wisdom Panel', 'Paw Print Genetics'
  test_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  results JSONB NOT NULL, -- Structured test results
  raw_results TEXT, -- Optional raw results for reference
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  verification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS dna_test_results_dog_id_idx ON dna_test_results(dog_id);
CREATE INDEX IF NOT EXISTS dna_test_results_test_type_idx ON dna_test_results(test_type);
CREATE INDEX IF NOT EXISTS dna_test_results_test_date_idx ON dna_test_results(test_date);

-- Genetic Markers Table
CREATE TABLE IF NOT EXISTS genetic_markers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  marker_name TEXT NOT NULL,
  gene_symbol TEXT NOT NULL,
  description TEXT,
  marker_type TEXT NOT NULL, -- e.g., 'color', 'health', 'trait'
  possible_values JSONB NOT NULL, -- Array of possible allele combinations
  inheritance_pattern TEXT, -- e.g., 'dominant', 'recessive', 'co-dominant'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on marker name and gene symbol
CREATE UNIQUE INDEX IF NOT EXISTS genetic_markers_name_gene_idx ON genetic_markers(marker_name, gene_symbol);

-- Health Markers Table (specific to health-related genetic markers)
CREATE TABLE IF NOT EXISTS health_markers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  genetic_marker_id UUID REFERENCES genetic_markers(id) ON DELETE CASCADE NOT NULL,
  condition_name TEXT NOT NULL,
  severity TEXT NOT NULL, -- e.g., 'low', 'medium', 'high'
  affected_breeds TEXT[], -- Array of breeds affected by this marker
  recommendations TEXT,
  references TEXT[], -- Scientific references
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on genetic marker ID
CREATE INDEX IF NOT EXISTS health_markers_genetic_marker_id_idx ON health_markers(genetic_marker_id);

-- Row-level security policies
ALTER TABLE dna_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE genetic_markers ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_markers ENABLE ROW LEVEL SECURITY;

-- Policies for dna_test_results
CREATE POLICY "Users can view their own dogs' DNA test results" 
  ON dna_test_results FOR SELECT 
  USING (
    dog_id IN (
      SELECT id FROM dogs WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert DNA test results for their own dogs" 
  ON dna_test_results FOR INSERT 
  WITH CHECK (
    dog_id IN (
      SELECT id FROM dogs WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update DNA test results for their own dogs" 
  ON dna_test_results FOR UPDATE 
  USING (
    dog_id IN (
      SELECT id FROM dogs WHERE owner_id = auth.uid()
    )
  );

-- Policies for genetic_markers (public read-only, admin write)
CREATE POLICY "Anyone can view genetic markers" 
  ON genetic_markers FOR SELECT 
  USING (true);

-- Policies for health_markers (public read-only, admin write)
CREATE POLICY "Anyone can view health markers" 
  ON health_markers FOR SELECT 
  USING (true);
