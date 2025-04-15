// Breeding Programs Feature - Data Queries
import { createClient } from '@/lib/supabase-server';
import { createClient as createBrowserClient } from '@/lib/supabase-browser';
import { useCallback } from 'react';
import { BreedingProgram, BreedingPair, Litter, Dog } from '../types';

/**
 * Server-side queries (for use in Netlify functions and server components)
 */
export const breedingProgramQueries = {
  /**
   * Get all breeding programs for a breeder
   * @param breederId - The ID of the breeder
   * @returns Array of breeding programs
   */
  getAllBreedingPrograms: async (breederId: string): Promise<BreedingProgram[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('breeding_programs')
      .select(`
        *,
        dogs:dogs(id, name, breed, color, gender, date_of_birth),
        breeding_pairs:breeding_pairs(
          id, 
          status,
          sire:sire_id(id, name, breed, color),
          dam:dam_id(id, name, breed, color)
        )
      `)
      .eq('breeder_id', breederId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching breeding programs:', error);
      throw new Error(`Failed to fetch breeding programs: ${error.message}`);
    }

    return data as BreedingProgram[];
  },

  /**
   * Get a breeding program by ID
   * @param programId - The ID of the breeding program
   * @returns The breeding program
   */
  getBreedingProgramById: async (programId: string): Promise<BreedingProgram> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('breeding_programs')
      .select(`
        *,
        dogs:dogs(id, name, breed, color, gender, date_of_birth),
        breeding_pairs:breeding_pairs(
          id, 
          status,
          sire:sire_id(id, name, breed, color),
          dam:dam_id(id, name, breed, color)
        )
      `)
      .eq('id', programId)
      .single();

    if (error) {
      console.error('Error fetching breeding program:', error);
      throw new Error(`Failed to fetch breeding program: ${error.message}`);
    }

    return data as BreedingProgram;
  },

  /**
   * Add dogs to a breeding program
   * @param programId - The ID of the breeding program
   * @param dogIds - Array of dog IDs to add
   * @param userId - The ID of the user making the request
   * @returns Success status
   */
  addDogsToProgram: async (programId: string, dogIds: string[], userId: string): Promise<boolean> => {
    const supabase = createClient();
    
    // Verify program ownership
    const { data: program, error: programError } = await supabase
      .from('breeding_programs')
      .select('breeder_id')
      .eq('id', programId)
      .single();
    
    if (programError || !program) {
      console.error('Error fetching breeding program:', programError);
      throw new Error('Breeding program not found');
    }
    
    if (program.breeder_id !== userId) {
      throw new Error('Unauthorized: You do not own this breeding program');
    }
    
    // Update dogs
    const { error: updateError } = await supabase
      .from('dogs')
      .update({ breeding_program_id: programId })
      .in('id', dogIds)
      .eq('owner_id', userId);
    
    if (updateError) {
      console.error('Error adding dogs to breeding program:', updateError);
      throw new Error(`Failed to add dogs to breeding program: ${updateError.message}`);
    }
    
    return true;
  },

  /**
   * Remove a dog from a breeding program
   * @param programId - The ID of the breeding program
   * @param dogId - The ID of the dog to remove
   * @param userId - The ID of the user making the request
   * @returns Success status
   */
  removeDogFromProgram: async (programId: string, dogId: string, userId: string): Promise<boolean> => {
    const supabase = createClient();
    
    // Verify program ownership
    const { data: program, error: programError } = await supabase
      .from('breeding_programs')
      .select('breeder_id')
      .eq('id', programId)
      .single();
    
    if (programError || !program) {
      console.error('Error fetching breeding program:', programError);
      throw new Error('Breeding program not found');
    }
    
    if (program.breeder_id !== userId) {
      throw new Error('Unauthorized: You do not own this breeding program');
    }
    
    // Update dog
    const { error: updateError } = await supabase
      .from('dogs')
      .update({ breeding_program_id: null })
      .eq('id', dogId)
      .eq('owner_id', userId);
    
    if (updateError) {
      console.error('Error removing dog from breeding program:', updateError);
      throw new Error(`Failed to remove dog from breeding program: ${updateError.message}`);
    }
    
    return true;
  }
};

/**
 * Client-side queries (for use in React components)
 */
export const useBreedingProgramQueries = () => {
  const supabase = createBrowserClient();

  const getAllBreedingPrograms = useCallback(async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('breeding_programs')
      .select(`
        *,
        dogs:dogs(id, name, breed, color, gender, date_of_birth),
        breeding_pairs:breeding_pairs(
          id, 
          status,
          sire:sire_id(id, name, breed, color),
          dam:dam_id(id, name, breed, color)
        )
      `)
      .eq('breeder_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching breeding programs:', error);
      throw new Error(`Failed to fetch breeding programs: ${error.message}`);
    }

    return data as BreedingProgram[];
  }, [supabase]);

  const getBreedingProgram = useCallback(async (programId: string) => {
    const { data, error } = await supabase
      .from('breeding_programs')
      .select(`
        *,
        dogs:dogs(id, name, breed, color, gender, date_of_birth),
        breeding_pairs:breeding_pairs(
          id, 
          status,
          sire:sire_id(id, name, breed, color),
          dam:dam_id(id, name, breed, color)
        )
      `)
      .eq('id', programId)
      .single();

    if (error) {
      console.error('Error fetching breeding program:', error);
      throw new Error(`Failed to fetch breeding program: ${error.message}`);
    }

    return data as BreedingProgram;
  }, [supabase]);

  const createBreedingProgram = useCallback(async (programData: Partial<BreedingProgram>) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('breeding_programs')
      .insert({
        ...programData,
        breeder_id: user.user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating breeding program:', error);
      throw new Error(`Failed to create breeding program: ${error.message}`);
    }

    return data as BreedingProgram;
  }, [supabase]);

  const updateBreedingProgram = useCallback(async (programId: string, programData: Partial<BreedingProgram>) => {
    const { data, error } = await supabase
      .from('breeding_programs')
      .update({
        ...programData,
        updated_at: new Date().toISOString()
      })
      .eq('id', programId)
      .select()
      .single();

    if (error) {
      console.error('Error updating breeding program:', error);
      throw new Error(`Failed to update breeding program: ${error.message}`);
    }

    return data as BreedingProgram;
  }, [supabase]);

  const deleteBreedingProgram = useCallback(async (programId: string) => {
    const { error } = await supabase
      .from('breeding_programs')
      .delete()
      .eq('id', programId);

    if (error) {
      console.error('Error deleting breeding program:', error);
      throw new Error(`Failed to delete breeding program: ${error.message}`);
    }

    return true;
  }, [supabase]);

  const addDogsToProgram = useCallback(async (programId: string, dogIds: string[]) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('dogs')
      .update({ breeding_program_id: programId })
      .in('id', dogIds)
      .eq('owner_id', user.user.id);

    if (error) {
      console.error('Error adding dogs to breeding program:', error);
      throw new Error(`Failed to add dogs to breeding program: ${error.message}`);
    }

    return true;
  }, [supabase]);

  const removeDogFromProgram = useCallback(async (dogId: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('dogs')
      .update({ breeding_program_id: null })
      .eq('id', dogId)
      .eq('owner_id', user.user.id);

    if (error) {
      console.error('Error removing dog from breeding program:', error);
      throw new Error(`Failed to remove dog from breeding program: ${error.message}`);
    }

    return true;
  }, [supabase]);

  return {
    getAllBreedingPrograms,
    getBreedingProgram,
    createBreedingProgram,
    updateBreedingProgram,
    deleteBreedingProgram,
    addDogsToProgram,
    removeDogFromProgram
  };
};
