// Breeding Programs Feature - Types

export interface BreedingProgram {
  id: string;
  name: string;
  description?: string;
  breeder_id: string;
  goals?: string[];
  status: 'active' | 'inactive' | 'completed';
  created_at: string;
  updated_at: string;
  dogs?: Dog[];
  breeding_pairs?: BreedingPair[];
}

export interface BreedingPair {
  id: string;
  breeding_program_id: string;
  sire_id: string;
  dam_id: string;
  status: 'active' | 'inactive' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
  sire?: Dog;
  dam?: Dog;
  litters?: Litter[];
}

export interface Litter {
  id: string;
  breeding_pair_id: string;
  whelp_date?: string;
  puppy_count?: number;
  males?: number;
  females?: number;
  notes?: string;
  status: 'planned' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  puppies?: Dog[];
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  color: string;
  gender: 'male' | 'female';
  date_of_birth?: string;
  owner_id: string;
  breeding_program_id?: string;
  litter_id?: string;
}

export interface BreedingEvent {
  id: string;
  breeding_pair_id: string;
  event_type: 'heat' | 'breeding' | 'pregnancy_check' | 'whelping' | 'other';
  event_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
