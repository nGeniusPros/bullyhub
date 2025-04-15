// Health Clearances Feature - Types

/**
 * Health Clearance
 */
export interface HealthClearance {
  id: string;
  dog_id: string;
  test: string;
  date: string;
  result: string;
  status: "passed" | "pending" | "failed";
  expiry_date: string;
  verification_number: string;
  notes?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Health Clearance with Dog Information
 */
export interface HealthClearanceWithDog extends HealthClearance {
  dog?: {
    id: string;
    name: string;
    breed: string;
    color: string;
    owner_id: string;
  };
}

/**
 * Health Clearance Form Data
 */
export interface HealthClearanceFormData {
  dogId: string;
  test: string;
  date: string;
  result: string;
  status: "passed" | "pending" | "failed";
  expiryDate: string;
  verificationNumber: string;
  notes?: string;
  documents?: string[];
}

/**
 * Health Clearance Verification Result
 */
export interface HealthClearanceVerificationResult {
  verified: boolean;
  clearance?: HealthClearanceWithDog;
  error?: string;
  verifiedAt?: string;
}

/**
 * Health Clearance Summary
 */
export interface HealthClearanceSummary {
  totalClearances: number;
  byStatus: {
    passed: number;
    pending: number;
    failed: number;
  };
  byTest: Record<string, number>;
  expiringClearances: HealthClearance[];
}
