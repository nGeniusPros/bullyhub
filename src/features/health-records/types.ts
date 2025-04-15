// Health Records Feature - Types

/**
 * Health Record
 */
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_date: string;
  record_type: string;
  description: string;
  provider?: string;
  results?: string;
  notes?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Health Record with Dog Information
 */
export interface HealthRecordWithDog extends HealthRecord {
  dog?: {
    id: string;
    name: string;
    breed: string;
  };
}

/**
 * Health Record Form Data
 */
export interface HealthRecordFormData {
  dog_id: string;
  record_date: string;
  record_type: string;
  description: string;
  provider?: string;
  results?: string;
  notes?: string;
  documents?: File[];
}

/**
 * Record Type
 */
export type RecordType = 
  | 'examination'
  | 'vaccination'
  | 'procedure'
  | 'lab_test'
  | 'injury'
  | 'illness'
  | 'other';

/**
 * Record Type Option
 */
export interface RecordTypeOption {
  value: RecordType;
  label: string;
  description: string;
}

/**
 * Record Type Options
 */
export const RECORD_TYPE_OPTIONS: RecordTypeOption[] = [
  {
    value: 'examination',
    label: 'Examination',
    description: 'Regular check-up or physical examination'
  },
  {
    value: 'vaccination',
    label: 'Vaccination',
    description: 'Vaccines and immunizations'
  },
  {
    value: 'procedure',
    label: 'Procedure',
    description: 'Surgical or medical procedure'
  },
  {
    value: 'lab_test',
    label: 'Lab Test',
    description: 'Blood work, urinalysis, or other diagnostic tests'
  },
  {
    value: 'injury',
    label: 'Injury',
    description: 'Trauma, wound, or physical injury'
  },
  {
    value: 'illness',
    label: 'Illness',
    description: 'Disease, infection, or other health condition'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other health-related record'
  }
];
