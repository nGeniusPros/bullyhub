// Dogs Feature - Supabase Queries
import { createClient } from "@/lib/supabase-server";
import { createClient as createBrowserClient } from "@/lib/supabase-browser";
import {
  Dog,
  DogWithOwner,
  DogWithBreedingProgram,
  PedigreeData
} from "../types";

/**
 * Server-side queries (for use in Netlify functions and server components)
 */
export const dogQueries = {
  /**
   * Get all dogs for a user
   * @param userId - The ID of the user
   * @returns Array of dogs
   */
  getAllDogs: async (userId: string): Promise<DogWithBreedingProgram[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("dogs")
      .select(`
        *,
        breeding_program:breeding_programs(id, name)
      `)
      .eq("owner_id", userId)
      .order("name");

    if (error) {
      console.error("Error fetching dogs:", error);
      throw new Error(`Failed to fetch dogs: ${error.message}`);
    }

    return data.map(dog => ({
      id: dog.id,
      name: dog.name,
      breed: dog.breed,
      date_of_birth: dog.date_of_birth,
      color: dog.color,
      owner_id: dog.owner_id,
      is_stud: dog.is_stud,
      profile_image_url: dog.profile_image_url,
      weight: dog.weight,
      height: dog.height,
      microchip_number: dog.microchip_number,
      registration_number: dog.registration_number,
      breeding_program_id: dog.breeding_program_id,
      created_at: dog.created_at,
      updated_at: dog.updated_at,
      breeding_program: dog.breeding_program ? {
        id: dog.breeding_program.id,
        name: dog.breeding_program.name
      } : undefined
    }));
  },

  /**
   * Get a dog by ID
   * @param dogId - The ID of the dog
   * @returns Dog with owner information
   */
  getDogById: async (dogId: string): Promise<DogWithOwner | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("dogs")
      .select(`
        *,
        owner:profiles(id, first_name, last_name, email)
      `)
      .eq("id", dogId)
      .single();

    if (error) {
      console.error("Error fetching dog:", error);
      throw new Error(`Failed to fetch dog: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      breed: data.breed,
      date_of_birth: data.date_of_birth,
      color: data.color,
      owner_id: data.owner_id,
      is_stud: data.is_stud,
      profile_image_url: data.profile_image_url,
      weight: data.weight,
      height: data.height,
      microchip_number: data.microchip_number,
      registration_number: data.registration_number,
      breeding_program_id: data.breeding_program_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      owner: data.owner ? {
        id: data.owner.id,
        first_name: data.owner.first_name,
        last_name: data.owner.last_name,
        email: data.owner.email
      } : undefined
    };
  },

  /**
   * Create a new dog
   * @param dog - The dog data to create
   * @returns The created dog
   */
  createDog: async (dog: Omit<Dog, "id" | "created_at" | "updated_at">): Promise<Dog> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("dogs")
      .insert(dog)
      .select()
      .single();

    if (error) {
      console.error("Error creating dog:", error);
      throw new Error(`Failed to create dog: ${error.message}`);
    }

    return data as Dog;
  },

  /**
   * Update a dog
   * @param dogId - The ID of the dog to update
   * @param dog - The dog data to update
   * @returns The updated dog
   */
  updateDog: async (dogId: string, dog: Partial<Omit<Dog, "id" | "created_at" | "updated_at">>): Promise<Dog> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("dogs")
      .update(dog)
      .eq("id", dogId)
      .select()
      .single();

    if (error) {
      console.error("Error updating dog:", error);
      throw new Error(`Failed to update dog: ${error.message}`);
    }

    return data as Dog;
  },

  /**
   * Delete a dog
   * @param dogId - The ID of the dog to delete
   */
  deleteDog: async (dogId: string): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("dogs")
      .delete()
      .eq("id", dogId);

    if (error) {
      console.error("Error deleting dog:", error);
      throw new Error(`Failed to delete dog: ${error.message}`);
    }
  },

  /**
   * Get a dog's pedigree
   * @param dogId - The ID of the dog
   * @returns The dog's pedigree data
   */
  getDogPedigree: async (dogId: string): Promise<PedigreeData | null> => {
    const supabase = createClient();
    
    // This is a placeholder for actual pedigree retrieval logic
    // In a real implementation, this would query the pedigree data from the database
    
    // Get the dog first
    const { data: dog, error } = await supabase
      .from("dogs")
      .select("*")
      .eq("id", dogId)
      .single();
    
    if (error || !dog) {
      console.error("Error fetching dog for pedigree:", error);
      return null;
    }
    
    // For now, return a mock pedigree structure
    // This would be replaced with actual database queries in a production implementation
    return {
      dog: {
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
        color: dog.color,
        date_of_birth: dog.date_of_birth,
        registration_number: dog.registration_number,
        image: dog.profile_image_url
      },
      // Mock data for sire and dam
      sire: {
        dog: {
          id: 'sire-1',
          name: 'Sire Name',
          breed: dog.breed,
          color: 'Unknown',
          date_of_birth: undefined,
          registration_number: undefined,
          image: null
        }
      },
      dam: {
        dog: {
          id: 'dam-1',
          name: 'Dam Name',
          breed: dog.breed,
          color: 'Unknown',
          date_of_birth: undefined,
          registration_number: undefined,
          image: null
        }
      }
    };
  },

  /**
   * Upload an image for a dog
   * @param dogId - The ID of the dog
   * @param file - The image file to upload
   * @returns The URL of the uploaded image
   */
  uploadDogImage: async (dogId: string, file: File): Promise<string> => {
    const supabase = createClient();
    
    // Upload the file to storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('dog-images')
      .upload(`${dogId}/${file.name}`, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error("Error uploading dog image:", uploadError);
      throw new Error(`Failed to upload dog image: ${uploadError.message}`);
    }
    
    // Get the public URL
    const { data: urlData } = supabase
      .storage
      .from('dog-images')
      .getPublicUrl(uploadData.path);
    
    // Update the dog with the new image URL
    const { error: updateError } = await supabase
      .from("dogs")
      .update({ profile_image_url: urlData.publicUrl })
      .eq("id", dogId);
    
    if (updateError) {
      console.error("Error updating dog with image URL:", updateError);
      throw new Error(`Failed to update dog with image URL: ${updateError.message}`);
    }
    
    return urlData.publicUrl;
  }
};

/**
 * Client-side hooks (for use in React components)
 */
export const useDogQueries = () => {
  const supabase = createBrowserClient();
  
  return {
    /**
     * Get all dogs for the current user
     * @returns Array of dogs
     */
    getAllDogs: async (): Promise<DogWithBreedingProgram[]> => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from("dogs")
        .select(`
          *,
          breeding_program:breeding_programs(id, name)
        `)
        .eq("owner_id", user.id)
        .order("name");
      
      if (error) {
        console.error("Error fetching dogs:", error);
        throw new Error(`Failed to fetch dogs: ${error.message}`);
      }
      
      return data.map(dog => ({
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
        date_of_birth: dog.date_of_birth,
        color: dog.color,
        owner_id: dog.owner_id,
        is_stud: dog.is_stud,
        profile_image_url: dog.profile_image_url,
        weight: dog.weight,
        height: dog.height,
        microchip_number: dog.microchip_number,
        registration_number: dog.registration_number,
        breeding_program_id: dog.breeding_program_id,
        created_at: dog.created_at,
        updated_at: dog.updated_at,
        breeding_program: dog.breeding_program ? {
          id: dog.breeding_program.id,
          name: dog.breeding_program.name
        } : undefined
      }));
    },
    
    // Add client-side versions of other queries as needed
  };
};
