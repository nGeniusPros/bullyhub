"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { ENV } from "./env-config";

// Define database schema types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      dogs: {
        Row: Dog;
        Insert: Omit<Dog, "created_at" | "updated_at">;
        Update: Partial<Omit<Dog, "id" | "created_at" | "updated_at">>;
      };
      dna_test_results: {
        Row: DnaTestResult;
        Insert: Omit<DnaTestResult, "created_at" | "updated_at">;
        Update: Partial<
          Omit<DnaTestResult, "id" | "created_at" | "updated_at">
        >;
      };
      genetic_markers: {
        Row: GeneticMarker;
        Insert: Omit<GeneticMarker, "created_at" | "updated_at">;
        Update: Partial<
          Omit<GeneticMarker, "id" | "created_at" | "updated_at">
        >;
      };
      health_markers: {
        Row: HealthMarker;
        Insert: Omit<HealthMarker, "created_at" | "updated_at">;
        Update: Partial<Omit<HealthMarker, "id" | "created_at" | "updated_at">>;
      };
      breeding_programs: {
        Row: BreedingProgram;
        Insert: Omit<BreedingProgram, "created_at" | "updated_at">;
        Update: Partial<
          Omit<BreedingProgram, "id" | "created_at" | "updated_at">
        >;
      };
      stud_services: {
        Row: StudService;
        Insert: Omit<StudService, "created_at" | "updated_at">;
        Update: Partial<Omit<StudService, "id" | "created_at" | "updated_at">>;
      };
      litters: {
        Row: Litter;
        Insert: Omit<Litter, "created_at" | "updated_at">;
        Update: Partial<Omit<Litter, "id" | "created_at" | "updated_at">>;
      };
      puppies: {
        Row: Puppy;
        Insert: Omit<Puppy, "created_at" | "updated_at">;
        Update: Partial<Omit<Puppy, "id" | "created_at" | "updated_at">>;
      };
      clients: {
        Row: Client;
        Insert: Omit<Client, "created_at" | "updated_at">;
        Update: Partial<Omit<Client, "id" | "created_at" | "updated_at">>;
      };
      client_interactions: {
        Row: ClientInteraction;
        Insert: Omit<ClientInteraction, "created_at" | "updated_at">;
        Update: Partial<
          Omit<ClientInteraction, "id" | "created_at" | "updated_at">
        >;
      };
      financial_records: {
        Row: FinancialRecord;
        Insert: Omit<FinancialRecord, "created_at" | "updated_at">;
        Update: Partial<
          Omit<FinancialRecord, "id" | "created_at" | "updated_at">
        >;
      };
      marketing_assets: {
        Row: MarketingAsset;
        Insert: Omit<MarketingAsset, "created_at" | "updated_at">;
        Update: Partial<
          Omit<MarketingAsset, "id" | "created_at" | "updated_at">
        >;
      };
      educational_content: {
        Row: EducationalContent;
        Insert: Omit<EducationalContent, "created_at" | "updated_at">;
        Update: Partial<
          Omit<EducationalContent, "id" | "created_at" | "updated_at">
        >;
      };
      stud_marketing: {
        Row: StudMarketing;
        Insert: Omit<StudMarketing, "created_at" | "updated_at">;
        Update: Partial<
          Omit<StudMarketing, "id" | "created_at" | "updated_at">
        >;
      };
      stud_production_history: {
        Row: StudProductionHistory;
        Insert: Omit<StudProductionHistory, "created_at" | "updated_at">;
        Update: Partial<
          Omit<StudProductionHistory, "id" | "created_at" | "updated_at">
        >;
      };
      kennel_websites: {
        Row: KennelWebsite;
        Insert: Omit<KennelWebsite, "created_at" | "updated_at">;
        Update: Partial<
          Omit<KennelWebsite, "id" | "created_at" | "updated_at">
        >;
      };
      appointments: {
        Row: Appointment;
        Insert: Omit<Appointment, "created_at" | "updated_at">;
        Update: Partial<Omit<Appointment, "id" | "created_at" | "updated_at">>;
      };
      gallery_images: {
        Row: GalleryImage;
        Insert: Omit<GalleryImage, "created_at" | "updated_at">;
        Update: Partial<Omit<GalleryImage, "id" | "created_at" | "updated_at">>;
      };
      gallery_collections: {
        Row: GalleryCollection;
        Insert: Omit<GalleryCollection, "created_at" | "updated_at">;
        Update: Partial<
          Omit<GalleryCollection, "id" | "created_at" | "updated_at">
        >;
      };
      gallery_collection_images: {
        Row: GalleryCollectionImage;
        Insert: Omit<GalleryCollectionImage, "created_at">;
        Update: Partial<
          Omit<
            GalleryCollectionImage,
            "collection_id" | "image_id" | "created_at"
          >
        >;
      };
      health_records: {
        Row: HealthRecord;
        Insert: Omit<HealthRecord, "created_at" | "updated_at">;
        Update: Partial<Omit<HealthRecord, "id" | "created_at" | "updated_at">>;
      };
      medications: {
        Row: Medication;
        Insert: Omit<Medication, "created_at" | "updated_at">;
        Update: Partial<Omit<Medication, "id" | "created_at" | "updated_at">>;
      };
      reminders: {
        Row: Reminder;
        Insert: Omit<Reminder, "created_at" | "updated_at">;
        Update: Partial<Omit<Reminder, "id" | "created_at" | "updated_at">>;
      };
      breeding_plans: {
        Row: BreedingPlan;
        Insert: Omit<BreedingPlan, "created_at" | "updated_at">;
        Update: Partial<Omit<BreedingPlan, "id" | "created_at" | "updated_at">>;
      };
      breeding_compatibility_analyses: {
        Row: BreedingCompatibilityAnalysis;
        Insert: Omit<BreedingCompatibilityAnalysis, "created_at">;
        Update: Partial<
          Omit<BreedingCompatibilityAnalysis, "id" | "created_at">
        >;
      };
      ai_conversations: {
        Row: AIConversation;
        Insert: Omit<AIConversation, "created_at">;
        Update: Partial<Omit<AIConversation, "id" | "created_at">>;
      };
      breeding_program_types: {
        Row: BreedingProgramType;
        Insert: Omit<BreedingProgramType, "created_at" | "updated_at">;
        Update: Partial<
          Omit<BreedingProgramType, "id" | "created_at" | "updated_at">
        >;
      };
      color_genetics: {
        Row: ColorGenetics;
        Insert: Omit<ColorGenetics, "created_at" | "updated_at">;
        Update: Partial<
          Omit<ColorGenetics, "id" | "created_at" | "updated_at">
        >;
      };
      color_inheritance: {
        Row: ColorInheritance;
        Insert: Omit<ColorInheritance, "created_at" | "updated_at">;
        Update: Partial<
          Omit<ColorInheritance, "id" | "created_at" | "updated_at">
        >;
      };
      health_testing_requirements: {
        Row: HealthTestingRequirement;
        Insert: Omit<HealthTestingRequirement, "created_at" | "updated_at">;
        Update: Partial<
          Omit<HealthTestingRequirement, "id" | "created_at" | "updated_at">
        >;
      };
      breeding_compatibility_rules: {
        Row: BreedingCompatibilityRule;
        Insert: Omit<BreedingCompatibilityRule, "created_at" | "updated_at">;
        Update: Partial<
          Omit<BreedingCompatibilityRule, "id" | "created_at" | "updated_at">
        >;
      };
      ai_breeding_advice_templates: {
        Row: AIBreedingAdviceTemplate;
        Insert: Omit<AIBreedingAdviceTemplate, "created_at" | "updated_at">;
        Update: Partial<
          Omit<AIBreedingAdviceTemplate, "id" | "created_at" | "updated_at">
        >;
      };
    };
    Views: {};
    Functions: {};
  };
};

// Types for database tables
export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  role: "breeder" | "petOwner";
  created_at: string;
  updated_at: string;
};

export type Dog = {
  id: string;
  name: string;
  breed: string;
  date_of_birth?: string;
  color?: string;
  owner_id: string;
  is_stud: boolean;
  breeding_program_id?: string;
  created_at: string;
  updated_at: string;
};

export type DnaTestResult = {
  id: string;
  dog_id: string;
  provider: "AnimalGenetics" | "Embark" | "Other";
  test_date: string;
  created_at: string;
  updated_at: string;
};

export type GeneticMarker = {
  id: string;
  dna_test_id: string;
  locus: string;
  alleles: any;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type HealthMarker = {
  id: string;
  dna_test_id: string;
  condition: string;
  status: "Clear" | "Carrier" | "At Risk";
  created_at: string;
  updated_at: string;
};

export type BreedingProgram = {
  id: string;
  breeder_id: string;
  name: string;
  description?: string;
  goals?: any;
  program_type: string;
  color_focus: string;
  health_protocols?: any;
  cost_range?: any;
  special_considerations?: string[];
  created_at: string;
  updated_at: string;
};

export type StudService = {
  id: string;
  stud_id: string;
  fee: number;
  description?: string;
  availability: boolean;
  created_at: string;
  updated_at: string;
};

export type Litter = {
  id: string;
  breeding_program_id?: string;
  sire_id: string;
  dam_id: string;
  whelping_date?: string;
  puppy_count?: number;
  created_at: string;
  updated_at: string;
};

export type Puppy = {
  id: string;
  litter_id: string;
  name?: string;
  color?: string;
  gender?: string;
  created_at: string;
  updated_at: string;
};

// Marketing Suite Types
export type Client = {
  id: string;
  breeder_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  status?: string;
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type ClientInteraction = {
  id: string;
  client_id: string;
  interaction_type: string;
  interaction_date: string;
  notes?: string;
  follow_up_date?: string;
  follow_up_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type FinancialRecord = {
  id: string;
  breeder_id: string;
  record_type: string;
  category: string;
  amount: number;
  description?: string;
  date: string;
  related_dog_id?: string;
  related_client_id?: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
};

export type MarketingAsset = {
  id: string;
  breeder_id: string;
  asset_type: string;
  title: string;
  description?: string;
  file_url?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
};

export type EducationalContent = {
  id: string;
  breeder_id: string;
  content_type: string;
  title: string;
  description?: string;
  content?: string;
  media_url?: string;
  thumbnail_url?: string;
  tags?: string[];
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
};

export type StudMarketing = {
  id: string;
  stud_id: string;
  title: string;
  description?: string;
  dna_highlights?: any;
  color_genetics?: any;
  health_clearances?: any;
  fee_structure?: any;
  availability_calendar?: any;
  success_metrics?: any;
  created_at: string;
  updated_at: string;
};

export type StudProductionHistory = {
  id: string;
  stud_id: string;
  litter_id?: string;
  dam_id?: string;
  whelping_date?: string;
  puppy_count?: number;
  color_outcomes?: any;
  testimonial?: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
};

export type KennelWebsite = {
  id: string;
  breeder_id: string;
  template_type: string;
  site_name: string;
  domain?: string;
  logo_url?: string;
  color_scheme?: any;
  content?: any;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
};

// Pet Owner Feature Types
export type Appointment = {
  id: string;
  dog_id: string;
  date: string;
  time: string;
  type: string;
  vet_name?: string;
  clinic?: string;
  address?: string;
  phone?: string;
  email?: string;
  notes?: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
};

export type GalleryImage = {
  id: string;
  owner_id: string;
  dog_id?: string;
  title?: string;
  description?: string;
  url: string;
  storage_path: string;
  tags?: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryCollection = {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  cover_image_id?: string;
  created_at: string;
  updated_at: string;
};

export type GalleryCollectionImage = {
  collection_id: string;
  image_id: string;
  created_at: string;
};

export type HealthRecord = {
  id: string;
  dog_id: string;
  record_date: string;
  record_type: string;
  description?: string;
  provider?: string;
  results?: string;
  notes?: string;
  documents?: any;
  created_at: string;
  updated_at: string;
};

export type Medication = {
  id: string;
  dog_id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Reminder = {
  id: string;
  owner_id: string;
  dog_id?: string;
  title: string;
  description?: string;
  due_date: string;
  category: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  notify_before: number;
  created_at: string;
  updated_at: string;
};

// Breeding Feature Types
export type BreedingPlan = {
  id: string;
  breeder_id: string;
  name: string;
  breeding_program_id?: string;
  sire_id: string;
  dam_id: string;
  planned_date?: string;
  status: "planned" | "in-progress" | "completed" | "cancelled";
  notes?: string;
  ai_recommendations?: any;
  compatibility?: {
    score: number;
    colorPredictions: Array<{ color: string; percentage: number }>;
    healthRisks: Array<{ condition: string; risk: string }>;
    coi: number;
  };
  created_at: string;
  updated_at: string;
};

export type BreedingCompatibilityAnalysis = {
  id: string;
  user_id: string;
  sire_id: string;
  dam_id: string;
  breeding_program_id?: string;
  compatibility_score: number;
  color_predictions?: any;
  health_risks?: any;
  coi?: number;
  recommendation?: string;
  created_at: string;
};

export type AIConversation = {
  id: string;
  user_id: string;
  query: string;
  response: string;
  context?: any;
  created_at: string;
};

// Breeding Logic Types
export type BreedingProgramType = {
  id: string;
  name: string;
  category: "standard" | "rare" | "specialized";
  description?: string;
  health_focus?: string;
  min_cost?: number;
  max_cost?: number;
  created_at: string;
  updated_at: string;
};

export type ColorGenetics = {
  id: string;
  color_name: string;
  gene_loci: Record<string, string>; // e.g., {"E": "E/E", "K": "k/k", "A": "ay/ay"}
  description?: string;
  category: "standard" | "rare" | "specialized";
  health_considerations?: string[];
  created_at: string;
  updated_at: string;
};

export type ColorInheritance = {
  id: string;
  parent1_color_id: string;
  parent2_color_id: string;
  possible_offspring_colors: Array<{ color: string; probability: number }>;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type HealthTestingRequirement = {
  id: string;
  test_name: string;
  description?: string;
  is_mandatory: boolean;
  applicable_colors?: string[];
  action_on_positive?: string;
  created_at: string;
  updated_at: string;
};

export type BreedingCompatibilityRule = {
  id: string;
  rule_name: string;
  rule_description: string;
  rule_type: "health" | "color" | "structure" | "genetic";
  rule_severity: "warning" | "caution" | "prohibited";
  rule_logic: any; // Complex rule logic structure
  created_at: string;
  updated_at: string;
};

export type AIBreedingAdviceTemplate = {
  id: string;
  template_name: string;
  template_type:
    | "color_specific"
    | "health_specific"
    | "general"
    | "program_specific";
  applicable_colors?: string[];
  applicable_programs?: string[];
  template_content: string;
  variables?: Record<string, string>;
  created_at: string;
  updated_at: string;
};

// Create a Supabase client for browser environments
export const createBrowserSupabaseClient = () => {
  try {
    const supabaseUrl = ENV.SUPABASE_URL;
    const supabaseKey = ENV.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");
      console.error("Missing variables:", ENV.getMissingVars());
      throw new Error("Missing Supabase environment variables");
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    // Provide a user-friendly error message
    throw new Error("Failed to connect to the database. Please try again later.");
  }
};

// Safe utility function to get a Supabase client with error handling
export const getSafeSupabaseClient = () => {
  try {
    return createBrowserSupabaseClient();
  } catch (error) {
    console.error("Error getting Supabase client:", error);
    // Provide a user-friendly error message
    throw new Error("Failed to connect to the database. Please try again later.");
  }
};

// Note: Server-side Supabase client is now in supabase-server.ts

// Helper function to check if the database connection is working
export const checkDatabaseConnection = async () => {
  try {
    const supabase = getSafeSupabaseClient();

    // Just check if we can connect to Supabase at all
    // This avoids issues with specific tables not existing
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Database connection error:", error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }

    // If we get here, we have a connection to Supabase
    console.log("Successfully connected to Supabase");
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error("Unexpected error checking database connection:", error);
    return {
      success: false,
      error: error.message || "Unknown error",
      details: error
    };
  }
};

// Export a default client for use in components
export const supabase = (() => {
  try {
    return typeof window !== "undefined" ? getSafeSupabaseClient() : null; // Will be null on server side
  } catch (error) {
    console.error("Error initializing default Supabase client:", error);
    return null;
  }
})();
