-- Create breeding program types table
CREATE TABLE breeding_program_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('standard', 'rare', 'specialized')),
  description TEXT,
  health_focus TEXT,
  min_cost DECIMAL(10, 2),
  max_cost DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create color genetics table
CREATE TABLE color_genetics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  color_name TEXT NOT NULL,
  gene_loci JSONB NOT NULL, -- e.g., {"E": "E/E", "K": "k/k", "A": "ay/ay", "B": "B/B", "D": "D/D"}
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('standard', 'rare', 'specialized')),
  health_considerations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create color inheritance table
CREATE TABLE color_inheritance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent1_color_id UUID REFERENCES color_genetics(id) ON DELETE CASCADE NOT NULL,
  parent2_color_id UUID REFERENCES color_genetics(id) ON DELETE CASCADE NOT NULL,
  possible_offspring_colors JSONB NOT NULL, -- e.g., [{"color_id": "uuid", "probability": 0.25}, ...]
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent1_color_id, parent2_color_id)
);

-- Create health testing requirements table
CREATE TABLE health_testing_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_name TEXT NOT NULL,
  description TEXT,
  is_mandatory BOOLEAN DEFAULT FALSE,
  applicable_colors TEXT[], -- NULL means applies to all colors
  action_on_positive TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create breeding compatibility rules table
CREATE TABLE breeding_compatibility_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_name TEXT NOT NULL,
  rule_description TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('health', 'color', 'structure', 'genetic')),
  rule_severity TEXT NOT NULL CHECK (rule_severity IN ('warning', 'caution', 'prohibited')),
  rule_logic JSONB NOT NULL, -- Complex logic for rule evaluation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI breeding advice templates table
CREATE TABLE ai_breeding_advice_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('color_specific', 'health_specific', 'general', 'program_specific')),
  applicable_colors TEXT[], -- NULL means applies to all colors
  applicable_programs TEXT[], -- NULL means applies to all programs
  template_content TEXT NOT NULL,
  variables JSONB, -- Variables that can be substituted in the template
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert standard breeding program types
INSERT INTO breeding_program_types (name, category, description, health_focus, min_cost, max_cost) VALUES
('Brindle Program', 'standard', 'Breeding pairs selected for quality brindle patterning with dark and light stripes', 'Maintaining strong respiratory systems and skeletal structure', 4000, 5500),
('Fawn Program', 'standard', 'Breeding for rich, consistent fawn coloration ranging from light tan to golden tan', 'Joint health and temperature regulation capabilities', 4500, 6000),
('Pied Program', 'standard', 'Focused on well-distributed white with colored patches', 'Hearing assessment (associated with white coloration)', 5000, 6500),
('Cream Program', 'standard', 'Breeding for uniform cream coloration with proper black pigmentation', 'Skin health and allergy resistance', 4500, 5500),
('Black Program', 'standard', 'Specialized program for true black French Bulldogs without brindle markings', 'Coat quality and skin condition', 5000, 6000),
('Blue Program', 'rare', 'Careful breeding for the diluted blue-gray coat', 'Extra attention to skin quality and coat density due to dilution gene', 6000, 7500),
('Chocolate Program', 'rare', 'Specialized program for rich chocolate coloration', 'Skin health monitoring and genetic diversity', 6000, 7500),
('Lilac Program', 'rare', 'Breeding for the distinctive lilac/silver-purple hue', 'Extensive genetic screening for combined dilution factors', 6000, 8000),
('Isabella Program', 'rare', 'Ultra-rare breeding program for the "double lilac" coloration', 'Comprehensive health screening for multiple recessive genes', 8000, 10000),
('New Shade Isabella Program', 'rare', 'Developing the lighter, goldish-brown "triple dilute" variant', 'Advanced genetic screening for multiple dilution genes', 9000, 12000),
('Platinum Program', 'rare', 'Exclusive program for the rare platinum/silver coat', 'Temperature regulation and skin sensitivity', 8000, 12000),
('Merle Program', 'rare', 'Controlled breeding for the distinctive merle pattern', 'Vision and hearing assessment', 7000, 10000),
('Sable Program', 'rare', 'Breeding for rich sable coloration with dark mask', 'Coat quality and texture', 5500, 7000),
('Tiger Brindle Program', 'rare', 'Specialized for pronounced, distinctive brindle striping', 'Overall structure and temperament', 6000, 7500),
('Fluffy/Long-Haired Program', 'specialized', 'Exclusive program for the rare long-haired gene', 'General health with special attention to skin and coat', 10000, 15000);

-- Insert mandatory health testing requirements
INSERT INTO health_testing_requirements (test_name, description, is_mandatory, applicable_colors, action_on_positive) VALUES
('BOAS Functional Assessment', 'Evaluate breathing ability', TRUE, NULL, 'Score 1-2 acceptable; 3+ remove from program'),
('Hip Dysplasia', 'Screen for joint malformations', TRUE, NULL, 'OFA Fair or better required'),
('Patella Luxation', 'Evaluate knee joint stability', TRUE, NULL, 'Grade 0-1 acceptable'),
('Cardiac Evaluation', 'Screen for heart issues', TRUE, NULL, 'Normal cardiac function required'),
('Hereditary Cataracts', 'Screen for eye issues', TRUE, NULL, 'Carriers can breed to clear only'),
('Progressive Retinal Atrophy', 'Screen for eye degeneration', TRUE, NULL, 'Carriers can breed to clear only'),
('Degenerative Myelopathy', 'Screen for spinal cord disease', TRUE, NULL, 'Carriers can breed to clear only'),
('Hyperuricosuria', 'Screen for urate stone formation', TRUE, NULL, 'Carriers can breed to clear only'),
('Cystinuria', 'Screen for amino acid transport defect', TRUE, NULL, 'Carriers can breed to clear only'),
('Juvenile Hereditary Cataracts', 'Screen for early-onset cataracts', TRUE, NULL, 'Carriers can breed to clear only'),
('Color Dilution Alopecia gene (d locus)', 'Test for skin issues related to dilution', FALSE, ARRAY['Blue', 'Lilac', 'Isabella', 'Platinum'], 'Monitor for skin issues'),
('Brown locus (b) testing', 'Test for chocolate coloration', FALSE, ARRAY['Chocolate', 'Lilac', 'Isabella'], 'Test for testable vs. non-testable variants'),
('Merle gene (M) testing', 'Test for merle pattern', FALSE, ARRAY['Merle'], 'Never breed merle-to-merle'),
('Long hair gene (L) testing', 'Test for long hair trait', FALSE, ARRAY['Fluffy', 'Long-haired'], 'Both parents must carry for fluffy puppies');

-- Insert breeding compatibility rules
INSERT INTO breeding_compatibility_rules (rule_name, rule_description, rule_type, rule_severity, rule_logic) VALUES
('Merle-to-Merle Prohibition', 'Never breed merle to merle due to severe health risks', 'genetic', 'prohibited', 
  '{"condition": "AND", "rules": [{"field": "sire_color", "operator": "=", "value": "Merle"}, {"field": "dam_color", "operator": "=", "value": "Merle"}]}'),
('COI Limit', 'Coefficient of inbreeding should be below 6.25%', 'genetic', 'warning', 
  '{"condition": "AND", "rules": [{"field": "coi", "operator": ">", "value": 6.25}]}'),
('Health Carrier Matching', 'Avoid breeding carriers of the same genetic disease', 'health', 'caution', 
  '{"condition": "AND", "rules": [{"field": "sire_carrier_status", "operator": "=", "value": "carrier"}, {"field": "dam_carrier_status", "operator": "=", "value": "carrier"}, {"field": "same_condition", "operator": "=", "value": true}]}'),
('Multiple Dilution Caution', 'Exercise caution when breeding dogs with multiple dilution genes', 'color', 'caution', 
  '{"condition": "AND", "rules": [{"field": "dilution_gene_count", "operator": ">=", "value": 2}]}'),
('Structure Compatibility', 'Ensure physical compatibility between breeding pair', 'structure', 'warning', 
  '{"condition": "AND", "rules": [{"field": "size_difference", "operator": ">", "value": 20}]}');

-- Insert AI breeding advice templates
INSERT INTO ai_breeding_advice_templates (template_name, template_type, applicable_colors, template_content, variables) VALUES
('Standard Color Breeding Advice', 'color_specific', ARRAY['Brindle', 'Fawn', 'Pied', 'Cream', 'Black'], 
  'When breeding for {{color}} French Bulldogs, focus on {{health_focus}}. This color typically has {{color_characteristics}} and requires attention to {{special_considerations}}. For best results, consider pairing with {{compatible_colors}} to maintain quality while ensuring genetic diversity.',
  '{"color": "string", "health_focus": "string", "color_characteristics": "string", "special_considerations": "string", "compatible_colors": "string"}'),
('Rare Color Breeding Advice', 'color_specific', ARRAY['Blue', 'Chocolate', 'Lilac', 'Isabella', 'Platinum', 'Merle', 'Sable', 'Tiger Brindle'], 
  'Breeding for {{color}} requires specialized knowledge and careful health monitoring. This rare color is produced by {{genetic_factors}} and comes with {{health_considerations}}. Always prioritize health testing, particularly {{recommended_tests}}. Ideal pairings include {{breeding_recommendations}}.',
  '{"color": "string", "genetic_factors": "string", "health_considerations": "string", "recommended_tests": "string", "breeding_recommendations": "string"}'),
('Health Testing Recommendation', 'health_specific', NULL, 
  'Based on the breeding pair analysis, we recommend the following health tests: {{recommended_tests}}. Pay particular attention to {{focus_areas}} given the history of {{health_concerns}} in the lineage. Before proceeding with this breeding, ensure {{prerequisites}} to minimize health risks.',
  '{"recommended_tests": "string", "focus_areas": "string", "health_concerns": "string", "prerequisites": "string"}'),
('Breeding Program Strategy', 'program_specific', NULL, 
  'For your {{program_name}} breeding program, we recommend focusing on {{program_goals}} while maintaining strict adherence to {{health_protocols}}. The current pairing has a {{compatibility_score}}% compatibility rating with strengths in {{strengths}} and potential concerns in {{concerns}}. To improve your program, consider {{recommendations}}.',
  '{"program_name": "string", "program_goals": "string", "health_protocols": "string", "compatibility_score": "number", "strengths": "string", "concerns": "string", "recommendations": "string"}');

-- Create basic color genetics entries
INSERT INTO color_genetics (color_name, gene_loci, description, category, health_considerations) VALUES
('Brindle', '{"E": "E/-", "K": "k/k", "A": "ay/-", "B": "B/-", "D": "D/-"}', 'Dark stripes on a lighter background', 'standard', ARRAY['Standard health considerations']),
('Fawn', '{"E": "E/-", "K": "k/k", "A": "ay/-", "B": "B/-", "D": "D/-"}', 'Solid light tan to golden tan coloration', 'standard', ARRAY['Potential skin allergies']),
('Pied', '{"E": "E/-", "K": "k/k", "A": "ay/-", "B": "B/-", "D": "D/-", "S": "s/s"}', 'White with colored patches', 'standard', ARRAY['Hearing issues with excessive white on head']),
('Cream', '{"E": "e/e", "K": "k/k", "A": "ay/-", "B": "B/-", "D": "D/-"}', 'Uniform cream coloration', 'standard', ARRAY['Skin sensitivity', 'Sun exposure issues']),
('Black', '{"E": "E/-", "K": "K/-", "B": "B/-", "D": "D/-"}', 'Solid black without brindle markings', 'standard', ARRAY['Coat quality issues']),
('Blue', '{"E": "E/-", "K": "K/-", "B": "B/-", "D": "d/d"}', 'Diluted blue-gray coat', 'rare', ARRAY['Color Dilution Alopecia', 'Skin issues']),
('Chocolate', '{"E": "E/-", "K": "K/-", "B": "b/b", "D": "D/-"}', 'Rich chocolate coloration', 'rare', ARRAY['Potential skin sensitivity']),
('Lilac', '{"E": "E/-", "K": "K/-", "B": "b/b", "D": "d/d"}', 'Distinctive lilac/silver-purple hue', 'rare', ARRAY['Multiple dilution health concerns']),
('Isabella', '{"E": "E/-", "K": "K/-", "B": "b/b", "D": "d/d"}', 'Double dilute "lilac" coloration', 'rare', ARRAY['Multiple dilution health concerns', 'Immune system strength']),
('Merle', '{"E": "E/-", "M": "M/m"}', 'Distinctive mottled pattern', 'rare', ARRAY['Hearing defects', 'Vision defects']),
('Fluffy', '{"L": "l/l"}', 'Longer coat than standard', 'specialized', ARRAY['Overheating', 'Coat maintenance issues']);

-- Create color inheritance examples
INSERT INTO color_inheritance (parent1_color_id, parent2_color_id, possible_offspring_colors, notes)
VALUES
(
  (SELECT id FROM color_genetics WHERE color_name = 'Brindle'),
  (SELECT id FROM color_genetics WHERE color_name = 'Brindle'),
  '[{"color": "Brindle", "probability": 0.75}, {"color": "Black", "probability": 0.25}]',
  'Brindle is dominant but can produce black if both parents carry non-ay alleles'
),
(
  (SELECT id FROM color_genetics WHERE color_name = 'Brindle'),
  (SELECT id FROM color_genetics WHERE color_name = 'Fawn'),
  '[{"color": "Brindle", "probability": 0.5}, {"color": "Fawn", "probability": 0.5}]',
  'Brindle and fawn are both ay-based colors with different modifiers'
),
(
  (SELECT id FROM color_genetics WHERE color_name = 'Blue'),
  (SELECT id FROM color_genetics WHERE color_name = 'Black'),
  '[{"color": "Black", "probability": 0.5}, {"color": "Blue", "probability": 0.0}, {"color": "Black carrier of blue", "probability": 0.5}]',
  'Assuming the black dog does not carry blue (D/D). If black dog is D/d, blue puppies are possible.'
),
(
  (SELECT id FROM color_genetics WHERE color_name = 'Chocolate'),
  (SELECT id FROM color_genetics WHERE color_name = 'Black'),
  '[{"color": "Black", "probability": 0.5}, {"color": "Chocolate", "probability": 0.0}, {"color": "Black carrier of chocolate", "probability": 0.5}]',
  'Assuming the black dog does not carry chocolate (B/B). If black dog is B/b, chocolate puppies are possible.'
),
(
  (SELECT id FROM color_genetics WHERE color_name = 'Merle'),
  (SELECT id FROM color_genetics WHERE color_name = 'Black'),
  '[{"color": "Black", "probability": 0.5}, {"color": "Merle", "probability": 0.5}]',
  'NEVER breed merle to merle. Merle to solid color is the only acceptable pairing.'
);

-- Enable Row Level Security
ALTER TABLE breeding_program_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_genetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_inheritance ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_testing_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeding_compatibility_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_breeding_advice_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for read access to breeding logic tables
-- These tables contain reference data that should be readable by all authenticated users
CREATE POLICY "All users can view breeding program types"
  ON breeding_program_types FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "All users can view color genetics"
  ON color_genetics FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "All users can view color inheritance"
  ON color_inheritance FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "All users can view health testing requirements"
  ON health_testing_requirements FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "All users can view breeding compatibility rules"
  ON breeding_compatibility_rules FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "All users can view AI breeding advice templates"
  ON ai_breeding_advice_templates FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only allow admins to modify the breeding logic data
CREATE POLICY "Only admins can insert breeding program types"
  ON breeding_program_types FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only admins can update breeding program types"
  ON breeding_program_types FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Only admins can delete breeding program types"
  ON breeding_program_types FOR DELETE
  USING (auth.role() = 'service_role');
