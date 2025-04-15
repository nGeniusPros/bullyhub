// Dogs Feature - Types

/**
 * Dog
 */
export interface Dog {
  id: string;
  name: string;
  breed: string;
  date_of_birth?: string;
  color: string;
  owner_id: string;
  is_stud: boolean;
  profile_image_url?: string;
  weight?: number;
  height?: number;
  microchip_number?: string;
  registration_number?: string;
  breeding_program_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Dog with Owner Information
 */
export interface DogWithOwner extends Dog {
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
  };
}

/**
 * Dog with Breeding Program Information
 */
export interface DogWithBreedingProgram extends Dog {
  breeding_program?: {
    id: string;
    name: string;
  };
}

/**
 * Pedigree Data
 */
export interface PedigreeData {
  dog: {
    id: string;
    name: string;
    breed?: string;
    color?: string;
    date_of_birth?: string;
    registration_number?: string;
    image?: string | null;
  };
  sire?: PedigreeData;
  dam?: PedigreeData;
}

/**
 * Line Breeding Analysis
 */
export interface LineBreedingAnalysis {
  key_ancestors: {
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

/**
 * Dog Form Data
 */
export interface DogFormData {
  name: string;
  breed: string;
  date_of_birth?: string;
  color: string;
  is_stud?: boolean;
  weight?: number;
  height?: number;
  microchip_number?: string;
  registration_number?: string;
  breeding_program_id?: string;
}
