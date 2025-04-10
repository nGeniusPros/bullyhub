// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "breeder" | "petOwner";
  createdAt: string;
}

// Dog types
export interface Dog {
  id: string;
  name: string;
  breed: string;
  dateOfBirth: string;
  color: string;
  ownerId: string;
  isStud: boolean;
  profileImageUrl?: string;
  weight?: number;
  height?: number;
  microchipNumber?: string;
  registrationNumber?: string;
  breeding_program_id?: string;
  breeding_program_name?: string;
  createdAt: string;
}

// DNA Test Result types
export interface DNATestResult {
  id: string;
  dogId: string;
  dogName: string;
  provider: "AnimalGenetics" | "Embark" | "Other";
  testDate: string;
  markers: GeneticMarker[];
  healthMarkers: HealthMarker[];
  documents?: string[];
  createdAt: string;
}

export interface GeneticMarker {
  locus: string;
  alleles: string[];
  description: string;
}

export interface HealthMarker {
  condition: string;
  status: "Clear" | "Carrier" | "At Risk";
}

// Stud Service types
export interface StudService {
  id: string;
  studId: string;
  fee: number;
  description: string;
  availability: boolean;
  createdAt: string;
}

// Import Stud Receptionist types
export * from "./stud-receptionist";

// Import Color Prediction types
export * from "./color-prediction";

// Import Nutrition types
export * from "./nutrition";

// Breeding Program types
export interface BreedingProgram {
  id: string;
  breederId: string;
  name: string;
  description: string;
  goals: string[];
  programType: "standard" | "rare" | "specialized";
  colorFocus: string;
  healthProtocols: HealthProtocol[];
  costRange: {
    min: number;
    max: number;
  };
  specialConsiderations: string[];
  createdAt: string;
}

export interface HealthProtocol {
  id: string;
  breedingProgramId: string;
  protocolName: string;
  description: string;
  required: boolean;
  frequency: string;
  createdAt: string;
}

// Litter types
export interface Litter {
  id: string;
  breedingProgramId: string;
  sireId: string;
  damId: string;
  whelping_date: string;
  puppyCount: number;
  createdAt: string;
}

// Color Prediction types
export interface ColorPrediction {
  color: string;
  percentage: number;
  description: string;
}

// Compatibility Result types
export interface CompatibilityResult {
  colorPredictions: ColorPrediction[];
  healthRisks: HealthRisk[];
  coi: number;
  recommendation: string;
}

export interface HealthRisk {
  condition: string;
  risk: "Low" | "Medium" | "High";
  description: string;
}

// Pedigree types
export interface PedigreeData {
  dog: {
    id: string;
    name: string;
    breed?: string;
    color?: string;
    dateOfBirth?: string;
    registrationNumber?: string;
    image?: string | null;
  };
  sire?: PedigreeData;
  dam?: PedigreeData;
}

export interface LineBreedingAnalysis {
  keyAncestors: {
    dog: Dog;
    contribution: number;
    occurrences: number;
  }[];
  patterns: {
    type: string;
    description: string;
  }[];
  coi: number;
}

// Health Clearance types
export interface HealthClearance {
  id: string;
  dogId: string;
  dogName?: string;
  test: string;
  date: string;
  result: string;
  status: "passed" | "pending" | "failed";
  expiryDate: string;
  verificationNumber: string;
  notes?: string;
  documents?: string[];
  createdAt: string;
}

// Marketing Suite Types

// Client types
export interface Client {
  id: string;
  breederId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  status?: "prospect" | "active" | "past";
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientInteraction {
  id: string;
  clientId: string;
  interactionType: string;
  interactionDate: string;
  notes?: string;
  followUpDate?: string;
  followUpCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Financial types
export interface FinancialRecord {
  id: string;
  breederId: string;
  recordType: "income" | "expense";
  category: string;
  amount: number;
  description?: string;
  date: string;
  relatedDogId?: string;
  relatedClientId?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Marketing Asset types
export interface MarketingAsset {
  id: string;
  breederId: string;
  assetType: string;
  title: string;
  description?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Educational Content types
export interface EducationalContent {
  id: string;
  breederId: string;
  contentType: "article" | "video" | "graphic" | "infographic";
  templateId?: string;
  title: string;
  description?: string;
  content?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  topics?: string[];
  aiGenerated: boolean;
  aiPrompt?: string;
  readingTime?: number;
  targetAudience?: "pet_owners" | "breeders" | "veterinarians" | "general";
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  viewCount?: number;
  shareCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  contentType: "article" | "video" | "graphic" | "infographic";
  structure: {
    sections: {
      title: string;
      description?: string;
      required: boolean;
      wordCountRange?: [number, number];
    }[];
  };
  placeholders?: string[];
  sampleContent?: string;
  tags?: string[];
  category: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIContentPrompt {
  topic: string;
  targetAudience: "pet_owners" | "breeders" | "veterinarians" | "general";
  contentType: "article" | "video" | "graphic" | "infographic";
  tone: "informative" | "conversational" | "professional" | "friendly";
  keyPoints?: string[];
  wordCount?: number;
  includeReferences?: boolean;
  additionalInstructions?: string;
}

// Stud Marketing types
export interface StudMarketing {
  id: string;
  dogId?: string;
  dog?: Dog;
  title: string;
  description?: string;
  dnaHighlights?: {
    verified: boolean;
    coi?: number;
    prepotency?: number;
    colorCarrier?: string[];
    healthClearances?: string[];
  };
  colorGenetics?: {
    mainColor: string;
    pattern: string;
    carries: string[];
  };
  healthClearances?: {
    tests: string[];
    certificates?: string[];
  };
  feeStructure?: {
    baseFee: number;
    premiumFee?: number;
    puppyBackOption?: boolean;
    specialTerms?: string;
  };
  availabilityCalendar?: {
    isAvailable: boolean;
    availableDates?: string[];
    bookedDates?: string[];
    maxBookingsPerMonth?: number;
  };
  successMetrics?: {
    successRate: number;
    litterCount: number;
    puppyCount: number;
    averageLitterSize?: number;
    testimonials?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface StudProductionHistory {
  id: string;
  studId: string;
  litterId?: string;
  damId?: string;
  whelpingDate?: string;
  puppyCount?: number;
  colorOutcomes?: any;
  testimonial?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

// Kennel Website types
export interface KennelWebsite {
  id: string;
  breederId: string;
  templateType:
    | "professional-breeder"
    | "show-kennel"
    | "family-breeder"
    | "multi-service-kennel";
  siteName: string;
  domain?: string;
  logoUrl?: string;
  colorScheme?: any;
  content?: any;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
