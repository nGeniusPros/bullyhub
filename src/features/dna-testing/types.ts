// DNA Testing Feature - Types

/**
 * DNA Test Result
 */
export interface DNATestResult {
  id: string;
  dog_id: string;
  test_type: string;
  test_provider: string;
  test_date: string;
  results: Record<string, any>;
  raw_results?: string;
  verified: boolean;
  verified_by?: string;
  verification_date?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Genetic Marker
 */
export interface GeneticMarker {
  id: string;
  marker_name: string;
  gene_symbol: string;
  description?: string;
  marker_type: string;
  possible_values: string[];
  inheritance_pattern?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Health Marker
 */
export interface HealthMarker {
  id: string;
  genetic_marker_id: string;
  condition_name: string;
  severity: 'low' | 'medium' | 'high';
  affected_breeds: string[];
  recommendations?: string;
  references?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * DNA Test Parser Result
 */
export interface DNATestParserResult {
  dogId: string;
  testType: string;
  testProvider: string;
  parsedResults: Record<string, any>;
  rawResults?: string;
  success: boolean;
  error?: string;
}

/**
 * DNA Test Form Data
 */
export interface DNATestFormData {
  dogId: string;
  testType: string;
  testProvider: string;
  testDate: string;
  testFile?: File;
  testResults?: Record<string, any>;
}

/**
 * DNA Test Summary
 */
export interface DNATestSummary {
  totalTests: number;
  byType: Record<string, number>;
  byProvider: Record<string, number>;
  latestTest?: {
    id: string;
    type: string;
    provider: string;
    date: string;
  };
}
