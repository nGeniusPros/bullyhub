// Stud Services Feature - Supabase Queries
import { createClient } from "@/lib/supabase-server";
import { createClient as createBrowserClient } from "@/lib/supabase-browser";
import {
  StudService,
  StudServiceWithDog,
  StudBooking,
  StudBookingWithRelations
} from "../types";

/**
 * Server-side queries (for use in Netlify functions and server components)
 */
export const studServiceQueries = {
  /**
   * Get all stud services
   * @returns Array of stud services with dog information
   */
  getAllStudServices: async (): Promise<StudServiceWithDog[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("stud_services")
      .select(`
        *,
        stud:dogs(
          id,
          name,
          breed,
          color,
          date_of_birth,
          owner_id,
          profiles:owner_id(first_name, last_name, email)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching stud services:", error);
      throw new Error(`Failed to fetch stud services: ${error.message}`);
    }

    return data.map(service => ({
      id: service.id,
      studId: service.stud_id,
      fee: service.fee,
      description: service.description,
      availability: service.availability,
      createdAt: service.created_at,
      updatedAt: service.updated_at,
      stud: service.stud ? {
        id: service.stud.id,
        name: service.stud.name,
        breed: service.stud.breed,
        color: service.stud.color,
        dateOfBirth: service.stud.date_of_birth,
        ownerId: service.stud.owner_id,
        owner: service.stud.profiles ? {
          firstName: service.stud.profiles.first_name,
          lastName: service.stud.profiles.last_name,
          email: service.stud.profiles.email
        } : undefined
      } : undefined
    }));
  },

  /**
   * Get stud services by owner ID
   * @param ownerId - The ID of the owner
   * @returns Array of stud services with dog information
   */
  getStudServicesByOwner: async (ownerId: string): Promise<StudServiceWithDog[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("stud_services")
      .select(`
        *,
        stud:dogs(
          id,
          name,
          breed,
          color,
          date_of_birth,
          owner_id,
          profiles:owner_id(first_name, last_name, email)
        )
      `)
      .eq("dogs.owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching stud services:", error);
      throw new Error(`Failed to fetch stud services: ${error.message}`);
    }

    return data.map(service => ({
      id: service.id,
      studId: service.stud_id,
      fee: service.fee,
      description: service.description,
      availability: service.availability,
      createdAt: service.created_at,
      updatedAt: service.updated_at,
      stud: service.stud ? {
        id: service.stud.id,
        name: service.stud.name,
        breed: service.stud.breed,
        color: service.stud.color,
        dateOfBirth: service.stud.date_of_birth,
        ownerId: service.stud.owner_id,
        owner: service.stud.profiles ? {
          firstName: service.stud.profiles.first_name,
          lastName: service.stud.profiles.last_name,
          email: service.stud.profiles.email
        } : undefined
      } : undefined
    }));
  },

  /**
   * Get a specific stud service
   * @param serviceId - The ID of the stud service
   * @returns Stud service with dog information
   */
  getStudService: async (serviceId: string): Promise<StudServiceWithDog> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("stud_services")
      .select(`
        *,
        stud:dogs(
          id,
          name,
          breed,
          color,
          date_of_birth,
          owner_id,
          profiles:owner_id(first_name, last_name, email)
        )
      `)
      .eq("id", serviceId)
      .single();

    if (error) {
      console.error("Error fetching stud service:", error);
      throw new Error(`Failed to fetch stud service: ${error.message}`);
    }

    return {
      id: data.id,
      studId: data.stud_id,
      fee: data.fee,
      description: data.description,
      availability: data.availability,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      stud: data.stud ? {
        id: data.stud.id,
        name: data.stud.name,
        breed: data.stud.breed,
        color: data.stud.color,
        dateOfBirth: data.stud.date_of_birth,
        ownerId: data.stud.owner_id,
        owner: data.stud.profiles ? {
          firstName: data.stud.profiles.first_name,
          lastName: data.stud.profiles.last_name,
          email: data.stud.profiles.email
        } : undefined
      } : undefined
    };
  },

  /**
   * Create a new stud service
   * @param serviceData - The stud service data to create
   * @returns The created stud service
   */
  createStudService: async (serviceData: Omit<StudService, "id" | "createdAt" | "updatedAt">): Promise<StudService> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("stud_services")
      .insert({
        stud_id: serviceData.studId,
        fee: serviceData.fee,
        description: serviceData.description,
        availability: serviceData.availability
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating stud service:", error);
      throw new Error(`Failed to create stud service: ${error.message}`);
    }

    return {
      id: data.id,
      studId: data.stud_id,
      fee: data.fee,
      description: data.description,
      availability: data.availability,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  /**
   * Update a stud service
   * @param serviceId - The ID of the stud service to update
   * @param serviceData - The updated stud service data
   * @returns The updated stud service
   */
  updateStudService: async (serviceId: string, serviceData: Partial<StudService>): Promise<StudService> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("stud_services")
      .update({
        fee: serviceData.fee,
        description: serviceData.description,
        availability: serviceData.availability,
        updated_at: new Date().toISOString()
      })
      .eq("id", serviceId)
      .select()
      .single();

    if (error) {
      console.error("Error updating stud service:", error);
      throw new Error(`Failed to update stud service: ${error.message}`);
    }

    return {
      id: data.id,
      studId: data.stud_id,
      fee: data.fee,
      description: data.description,
      availability: data.availability,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  /**
   * Delete a stud service
   * @param serviceId - The ID of the stud service to delete
   * @returns Success status
   */
  deleteStudService: async (serviceId: string): Promise<boolean> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("stud_services")
      .delete()
      .eq("id", serviceId);

    if (error) {
      console.error("Error deleting stud service:", error);
      throw new Error(`Failed to delete stud service: ${error.message}`);
    }

    return true;
  },

  /**
   * Get bookings for a stud service
   * @param serviceId - The ID of the stud service
   * @returns Array of bookings with related information
   */
  getStudBookings: async (serviceId: string): Promise<StudBookingWithRelations[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("stud_bookings")
      .select(`
        *,
        female_dog:dogs(id, name, breed, color),
        client:profiles(id, first_name, last_name, email)
      `)
      .eq("stud_service_id", serviceId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching stud bookings:", error);
      throw new Error(`Failed to fetch stud bookings: ${error.message}`);
    }

    return data.map(booking => ({
      id: booking.id,
      studServiceId: booking.stud_service_id,
      clientId: booking.client_id,
      femaleDogId: booking.female_dog_id,
      status: booking.status,
      scheduledDate: booking.scheduled_date,
      notes: booking.notes,
      createdAt: booking.created_at,
      femaleDog: booking.female_dog ? {
        id: booking.female_dog.id,
        name: booking.female_dog.name,
        breed: booking.female_dog.breed,
        color: booking.female_dog.color
      } : undefined,
      client: booking.client ? {
        id: booking.client.id,
        firstName: booking.client.first_name,
        lastName: booking.client.last_name,
        email: booking.client.email
      } : undefined
    }));
  }
};

/**
 * Client-side queries (for use in browser components)
 */
export const useStudServiceQueries = () => {
  const supabase = createBrowserClient();

  return {
    /**
     * Get all stud services
     * @returns Array of stud services with dog information
     */
    getAllStudServices: async (): Promise<StudServiceWithDog[]> => {
      const { data, error } = await supabase
        .from("stud_services")
        .select(`
          *,
          stud:dogs(
            id,
            name,
            breed,
            color,
            date_of_birth,
            owner_id,
            profiles:owner_id(first_name, last_name, email)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching stud services:", error);
        throw new Error(`Failed to fetch stud services: ${error.message}`);
      }

      return data.map(service => ({
        id: service.id,
        studId: service.stud_id,
        fee: service.fee,
        description: service.description,
        availability: service.availability,
        createdAt: service.created_at,
        updatedAt: service.updated_at,
        stud: service.stud ? {
          id: service.stud.id,
          name: service.stud.name,
          breed: service.stud.breed,
          color: service.stud.color,
          dateOfBirth: service.stud.date_of_birth,
          ownerId: service.stud.owner_id,
          owner: service.stud.profiles ? {
            firstName: service.stud.profiles.first_name,
            lastName: service.stud.profiles.last_name,
            email: service.stud.profiles.email
          } : undefined
        } : undefined
      }));
    },

    /**
     * Get a specific stud service
     * @param serviceId - The ID of the stud service
     * @returns Stud service with dog information
     */
    getStudService: async (serviceId: string): Promise<StudServiceWithDog> => {
      const { data, error } = await supabase
        .from("stud_services")
        .select(`
          *,
          stud:dogs(
            id,
            name,
            breed,
            color,
            date_of_birth,
            owner_id,
            profiles:owner_id(first_name, last_name, email)
          )
        `)
        .eq("id", serviceId)
        .single();

      if (error) {
        console.error("Error fetching stud service:", error);
        throw new Error(`Failed to fetch stud service: ${error.message}`);
      }

      return {
        id: data.id,
        studId: data.stud_id,
        fee: data.fee,
        description: data.description,
        availability: data.availability,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        stud: data.stud ? {
          id: data.stud.id,
          name: data.stud.name,
          breed: data.stud.breed,
          color: data.stud.color,
          dateOfBirth: data.stud.date_of_birth,
          ownerId: data.stud.owner_id,
          owner: data.stud.profiles ? {
            firstName: data.stud.profiles.first_name,
            lastName: data.stud.profiles.last_name,
            email: data.stud.profiles.email
          } : undefined
        } : undefined
      };
    },

    /**
     * Create a new stud service
     * @param serviceData - The stud service data to create
     * @returns The created stud service
     */
    createStudService: async (serviceData: Omit<StudService, "id" | "createdAt" | "updatedAt">): Promise<StudService> => {
      const { data, error } = await supabase
        .from("stud_services")
        .insert({
          stud_id: serviceData.studId,
          fee: serviceData.fee,
          description: serviceData.description,
          availability: serviceData.availability
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating stud service:", error);
        throw new Error(`Failed to create stud service: ${error.message}`);
      }

      return {
        id: data.id,
        studId: data.stud_id,
        fee: data.fee,
        description: data.description,
        availability: data.availability,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    },

    /**
     * Update a stud service
     * @param serviceId - The ID of the stud service to update
     * @param serviceData - The updated stud service data
     * @returns The updated stud service
     */
    updateStudService: async (serviceId: string, serviceData: Partial<StudService>): Promise<StudService> => {
      const { data, error } = await supabase
        .from("stud_services")
        .update({
          fee: serviceData.fee,
          description: serviceData.description,
          availability: serviceData.availability,
          updated_at: new Date().toISOString()
        })
        .eq("id", serviceId)
        .select()
        .single();

      if (error) {
        console.error("Error updating stud service:", error);
        throw new Error(`Failed to update stud service: ${error.message}`);
      }

      return {
        id: data.id,
        studId: data.stud_id,
        fee: data.fee,
        description: data.description,
        availability: data.availability,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    },

    /**
     * Delete a stud service
     * @param serviceId - The ID of the stud service to delete
     * @returns Success status
     */
    deleteStudService: async (serviceId: string): Promise<boolean> => {
      const { error } = await supabase
        .from("stud_services")
        .delete()
        .eq("id", serviceId);

      if (error) {
        console.error("Error deleting stud service:", error);
        throw new Error(`Failed to delete stud service: ${error.message}`);
      }

      return true;
    },

    /**
     * Subscribe to stud services changes
     * @param callback - Callback function to handle changes
     * @returns Subscription object that can be used to unsubscribe
     */
    subscribeToStudServices: (callback: (payload: any) => void) => {
      return supabase
        .channel('stud-services-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'stud_services'
          },
          callback
        )
        .subscribe();
    },

    /**
     * Get bookings for a stud service
     * @param serviceId - The ID of the stud service
     * @returns Array of bookings with related information
     */
    getStudBookings: async (serviceId: string): Promise<StudBookingWithRelations[]> => {
      const { data, error } = await supabase
        .from("stud_bookings")
        .select(`
          *,
          female_dog:dogs(id, name, breed, color),
          client:profiles(id, first_name, last_name, email)
        `)
        .eq("stud_service_id", serviceId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching stud bookings:", error);
        throw new Error(`Failed to fetch stud bookings: ${error.message}`);
      }

      return data.map(booking => ({
        id: booking.id,
        studServiceId: booking.stud_service_id,
        clientId: booking.client_id,
        femaleDogId: booking.female_dog_id,
        status: booking.status,
        scheduledDate: booking.scheduled_date,
        notes: booking.notes,
        createdAt: booking.created_at,
        femaleDog: booking.female_dog ? {
          id: booking.female_dog.id,
          name: booking.female_dog.name,
          breed: booking.female_dog.breed,
          color: booking.female_dog.color
        } : undefined,
        client: booking.client ? {
          id: booking.client.id,
          firstName: booking.client.first_name,
          lastName: booking.client.last_name,
          email: booking.client.email
        } : undefined
      }));
    },

    /**
     * Create a new stud booking
     * @param bookingData - The booking data to create
     * @returns The created booking
     */
    createStudBooking: async (bookingData: Omit<StudBooking, "id" | "createdAt">): Promise<StudBooking> => {
      const { data, error } = await supabase
        .from("stud_bookings")
        .insert({
          stud_service_id: bookingData.studServiceId,
          client_id: bookingData.clientId,
          female_dog_id: bookingData.femaleDogId,
          status: bookingData.status,
          scheduled_date: bookingData.scheduledDate,
          notes: bookingData.notes
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating stud booking:", error);
        throw new Error(`Failed to create stud booking: ${error.message}`);
      }

      return {
        id: data.id,
        studServiceId: data.stud_service_id,
        clientId: data.client_id,
        femaleDogId: data.female_dog_id,
        status: data.status,
        scheduledDate: data.scheduled_date,
        notes: data.notes,
        createdAt: data.created_at
      };
    },

    /**
     * Update a stud booking
     * @param bookingId - The ID of the booking to update
     * @param bookingData - The updated booking data
     * @returns The updated booking
     */
    updateStudBooking: async (bookingId: string, bookingData: Partial<StudBooking>): Promise<StudBooking> => {
      const { data, error } = await supabase
        .from("stud_bookings")
        .update({
          status: bookingData.status,
          scheduled_date: bookingData.scheduledDate,
          notes: bookingData.notes,
          updated_at: new Date().toISOString()
        })
        .eq("id", bookingId)
        .select()
        .single();

      if (error) {
        console.error("Error updating stud booking:", error);
        throw new Error(`Failed to update stud booking: ${error.message}`);
      }

      return {
        id: data.id,
        studServiceId: data.stud_service_id,
        clientId: data.client_id,
        femaleDogId: data.female_dog_id,
        status: data.status,
        scheduledDate: data.scheduled_date,
        notes: data.notes,
        createdAt: data.created_at
      };
    }
  };
};
