// Health Clearances Feature - Supabase Queries
import { createClient } from "@/lib/supabase-server";
import { createClient as createBrowserClient } from "@/lib/supabase-browser";
import { HealthClearance, HealthClearanceWithDog, HealthClearanceSummary } from "../types";

/**
 * Server-side queries (for use in Netlify functions and server components)
 */
export const healthClearanceQueries = {
  /**
   * Get all health clearances for a user
   * @param userId - The ID of the user
   * @returns Array of health clearances with dog information
   */
  getUserHealthClearances: async (userId: string): Promise<HealthClearanceWithDog[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("health_clearances")
      .select(`
        *,
        dog:dogs(id, name, breed, color)
      `)
      .eq("dogs.owner_id", userId);

    if (error) {
      console.error("Error fetching health clearances:", error);
      throw new Error(`Failed to fetch health clearances: ${error.message}`);
    }

    return data as HealthClearanceWithDog[];
  },

  /**
   * Get all health clearances for a dog
   * @param dogId - The ID of the dog
   * @returns Array of health clearances
   */
  getDogHealthClearances: async (dogId: string): Promise<HealthClearance[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("health_clearances")
      .select("*")
      .eq("dog_id", dogId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching health clearances:", error);
      throw new Error(`Failed to fetch health clearances: ${error.message}`);
    }

    return data as HealthClearance[];
  },

  /**
   * Get a specific health clearance
   * @param clearanceId - The ID of the health clearance
   * @returns Health clearance with dog information
   */
  getHealthClearance: async (clearanceId: string): Promise<HealthClearanceWithDog> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("health_clearances")
      .select(`
        *,
        dog:dogs(id, name, breed, color, owner_id)
      `)
      .eq("id", clearanceId)
      .single();

    if (error) {
      console.error("Error fetching health clearance:", error);
      throw new Error(`Failed to fetch health clearance: ${error.message}`);
    }

    return data as HealthClearanceWithDog;
  },

  /**
   * Create a new health clearance
   * @param clearanceData - The health clearance data to create
   * @returns The created health clearance
   */
  createHealthClearance: async (clearanceData: Omit<HealthClearance, "id" | "created_at" | "updated_at">): Promise<HealthClearance> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("health_clearances")
      .insert({
        dog_id: clearanceData.dog_id,
        test: clearanceData.test,
        date: clearanceData.date,
        result: clearanceData.result,
        status: clearanceData.status,
        expiry_date: clearanceData.expiry_date,
        verification_number: clearanceData.verification_number,
        notes: clearanceData.notes,
        documents: clearanceData.documents
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating health clearance:", error);
      throw new Error(`Failed to create health clearance: ${error.message}`);
    }

    return data as HealthClearance;
  },

  /**
   * Update a health clearance
   * @param clearanceId - The ID of the health clearance to update
   * @param clearanceData - The updated health clearance data
   * @returns The updated health clearance
   */
  updateHealthClearance: async (clearanceId: string, clearanceData: Partial<HealthClearance>): Promise<HealthClearance> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("health_clearances")
      .update({
        ...clearanceData,
        updated_at: new Date().toISOString()
      })
      .eq("id", clearanceId)
      .select()
      .single();

    if (error) {
      console.error("Error updating health clearance:", error);
      throw new Error(`Failed to update health clearance: ${error.message}`);
    }

    return data as HealthClearance;
  },

  /**
   * Delete a health clearance
   * @param clearanceId - The ID of the health clearance to delete
   * @returns Success status
   */
  deleteHealthClearance: async (clearanceId: string): Promise<boolean> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("health_clearances")
      .delete()
      .eq("id", clearanceId);

    if (error) {
      console.error("Error deleting health clearance:", error);
      throw new Error(`Failed to delete health clearance: ${error.message}`);
    }

    return true;
  },

  /**
   * Verify a health clearance by verification number
   * @param verificationNumber - The verification number to check
   * @returns Verification result
   */
  verifyHealthClearance: async (verificationNumber: string): Promise<HealthClearanceWithDog | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("health_clearances")
      .select(`
        *,
        dog:dogs(id, name, breed, color)
      `)
      .eq("verification_number", verificationNumber)
      .single();

    if (error) {
      console.error("Error verifying health clearance:", error);
      return null;
    }

    return data as HealthClearanceWithDog;
  },

  /**
   * Get a summary of health clearances for a user
   * @param userId - The ID of the user
   * @returns Health clearance summary
   */
  getHealthClearanceSummary: async (userId: string): Promise<HealthClearanceSummary> => {
    const clearances = await healthClearanceQueries.getUserHealthClearances(userId);
    
    // Calculate summary statistics
    const summary: HealthClearanceSummary = {
      totalClearances: clearances.length,
      byStatus: {
        passed: 0,
        pending: 0,
        failed: 0
      },
      byTest: {},
      expiringClearances: []
    };

    // Current date for expiry calculations
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    clearances.forEach(clearance => {
      // Count by status
      summary.byStatus[clearance.status]++;

      // Count by test type
      if (summary.byTest[clearance.test]) {
        summary.byTest[clearance.test]++;
      } else {
        summary.byTest[clearance.test] = 1;
      }

      // Check for expiring clearances
      if (clearance.expiry_date) {
        const expiryDate = new Date(clearance.expiry_date);
        if (expiryDate > now && expiryDate < thirtyDaysFromNow) {
          summary.expiringClearances.push(clearance);
        }
      }
    });

    return summary;
  }
};

/**
 * Client-side queries (for use in browser components)
 */
export const useHealthClearanceQueries = () => {
  const supabase = createBrowserClient();

  return {
    /**
     * Get all health clearances for the current user
     * @returns Array of health clearances with dog information
     */
    getUserHealthClearances: async (): Promise<HealthClearanceWithDog[]> => {
      const { data, error } = await supabase
        .from("health_clearances")
        .select(`
          *,
          dog:dogs(id, name, breed, color)
        `);

      if (error) {
        console.error("Error fetching health clearances:", error);
        throw new Error(`Failed to fetch health clearances: ${error.message}`);
      }

      return data as HealthClearanceWithDog[];
    },

    /**
     * Get all health clearances for a dog
     * @param dogId - The ID of the dog
     * @returns Array of health clearances
     */
    getDogHealthClearances: async (dogId: string): Promise<HealthClearance[]> => {
      const { data, error } = await supabase
        .from("health_clearances")
        .select("*")
        .eq("dog_id", dogId)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching health clearances:", error);
        throw new Error(`Failed to fetch health clearances: ${error.message}`);
      }

      return data as HealthClearance[];
    },

    /**
     * Get a specific health clearance
     * @param clearanceId - The ID of the health clearance
     * @returns Health clearance with dog information
     */
    getHealthClearance: async (clearanceId: string): Promise<HealthClearanceWithDog> => {
      const { data, error } = await supabase
        .from("health_clearances")
        .select(`
          *,
          dog:dogs(id, name, breed, color)
        `)
        .eq("id", clearanceId)
        .single();

      if (error) {
        console.error("Error fetching health clearance:", error);
        throw new Error(`Failed to fetch health clearance: ${error.message}`);
      }

      return data as HealthClearanceWithDog;
    },

    /**
     * Create a new health clearance
     * @param clearanceData - The health clearance data to create
     * @returns The created health clearance
     */
    createHealthClearance: async (clearanceData: Omit<HealthClearance, "id" | "created_at" | "updated_at">): Promise<HealthClearance> => {
      const { data, error } = await supabase
        .from("health_clearances")
        .insert({
          dog_id: clearanceData.dog_id,
          test: clearanceData.test,
          date: clearanceData.date,
          result: clearanceData.result,
          status: clearanceData.status,
          expiry_date: clearanceData.expiry_date,
          verification_number: clearanceData.verification_number,
          notes: clearanceData.notes,
          documents: clearanceData.documents
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating health clearance:", error);
        throw new Error(`Failed to create health clearance: ${error.message}`);
      }

      return data as HealthClearance;
    },

    /**
     * Update a health clearance
     * @param clearanceId - The ID of the health clearance to update
     * @param clearanceData - The updated health clearance data
     * @returns The updated health clearance
     */
    updateHealthClearance: async (clearanceId: string, clearanceData: Partial<HealthClearance>): Promise<HealthClearance> => {
      const { data, error } = await supabase
        .from("health_clearances")
        .update({
          ...clearanceData,
          updated_at: new Date().toISOString()
        })
        .eq("id", clearanceId)
        .select()
        .single();

      if (error) {
        console.error("Error updating health clearance:", error);
        throw new Error(`Failed to update health clearance: ${error.message}`);
      }

      return data as HealthClearance;
    },

    /**
     * Delete a health clearance
     * @param clearanceId - The ID of the health clearance to delete
     * @returns Success status
     */
    deleteHealthClearance: async (clearanceId: string): Promise<boolean> => {
      const { error } = await supabase
        .from("health_clearances")
        .delete()
        .eq("id", clearanceId);

      if (error) {
        console.error("Error deleting health clearance:", error);
        throw new Error(`Failed to delete health clearance: ${error.message}`);
      }

      return true;
    },

    /**
     * Subscribe to health clearances for a dog
     * @param dogId - The ID of the dog
     * @param callback - Callback function to handle new or updated health clearances
     * @returns Subscription object that can be used to unsubscribe
     */
    subscribeToDogHealthClearances: (dogId: string, callback: (payload: any) => void) => {
      return supabase
        .channel(`dog-health-clearances-${dogId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'health_clearances',
            filter: `dog_id=eq.${dogId}`
          },
          callback
        )
        .subscribe();
    }
  };
};
