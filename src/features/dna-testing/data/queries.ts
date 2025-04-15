// DNA Testing Feature - Supabase Queries
import { createClient } from "@/lib/supabase-server";
import { createClient as createBrowserClient } from "@/lib/supabase-browser";
import { DNATestResult, GeneticMarker, HealthMarker } from "../types";

/**
 * Server-side queries (for use in Netlify functions and server components)
 */
export const dnaTestingQueries = {
  /**
   * Get all DNA test results for a dog
   * @param dogId - The ID of the dog
   * @returns Array of DNA test results
   */
  getDogDNATests: async (dogId: string): Promise<DNATestResult[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("dna_test_results")
      .select("*")
      .eq("dog_id", dogId)
      .order("test_date", { ascending: false });

    if (error) {
      console.error("Error fetching DNA tests:", error);
      throw new Error(`Failed to fetch DNA tests: ${error.message}`);
    }

    return data as DNATestResult[];
  },

  /**
   * Get a specific DNA test result
   * @param testId - The ID of the DNA test
   * @returns DNA test result
   */
  getDNATest: async (testId: string): Promise<DNATestResult> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("dna_test_results")
      .select("*")
      .eq("id", testId)
      .single();

    if (error) {
      console.error("Error fetching DNA test:", error);
      throw new Error(`Failed to fetch DNA test: ${error.message}`);
    }

    return data as DNATestResult;
  },

  /**
   * Create a new DNA test result
   * @param testData - The DNA test data to create
   * @returns The created DNA test result
   */
  createDNATest: async (testData: Omit<DNATestResult, "id" | "created_at" | "updated_at">): Promise<DNATestResult> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("dna_test_results")
      .insert(testData)
      .select()
      .single();

    if (error) {
      console.error("Error creating DNA test:", error);
      throw new Error(`Failed to create DNA test: ${error.message}`);
    }

    return data as DNATestResult;
  },

  /**
   * Update a DNA test result
   * @param testId - The ID of the DNA test to update
   * @param testData - The updated DNA test data
   * @returns The updated DNA test result
   */
  updateDNATest: async (testId: string, testData: Partial<DNATestResult>): Promise<DNATestResult> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("dna_test_results")
      .update({ ...testData, updated_at: new Date().toISOString() })
      .eq("id", testId)
      .select()
      .single();

    if (error) {
      console.error("Error updating DNA test:", error);
      throw new Error(`Failed to update DNA test: ${error.message}`);
    }

    return data as DNATestResult;
  },

  /**
   * Get all genetic markers
   * @param markerType - Optional filter by marker type
   * @returns Array of genetic markers
   */
  getGeneticMarkers: async (markerType?: string): Promise<GeneticMarker[]> => {
    const supabase = createClient();
    let query = supabase.from("genetic_markers").select("*");
    
    if (markerType) {
      query = query.eq("marker_type", markerType);
    }
    
    const { data, error } = await query.order("marker_name");

    if (error) {
      console.error("Error fetching genetic markers:", error);
      throw new Error(`Failed to fetch genetic markers: ${error.message}`);
    }

    return data as GeneticMarker[];
  },

  /**
   * Get health markers for a specific genetic marker
   * @param geneticMarkerId - The ID of the genetic marker
   * @returns Array of health markers
   */
  getHealthMarkers: async (geneticMarkerId: string): Promise<HealthMarker[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("health_markers")
      .select("*")
      .eq("genetic_marker_id", geneticMarkerId);

    if (error) {
      console.error("Error fetching health markers:", error);
      throw new Error(`Failed to fetch health markers: ${error.message}`);
    }

    return data as HealthMarker[];
  }
};

/**
 * Client-side queries (for use in browser components)
 */
export const useDNATestingQueries = () => {
  const supabase = createBrowserClient();

  return {
    /**
     * Get all DNA test results for a dog
     * @param dogId - The ID of the dog
     * @returns Array of DNA test results
     */
    getDogDNATests: async (dogId: string): Promise<DNATestResult[]> => {
      const { data, error } = await supabase
        .from("dna_test_results")
        .select("*")
        .eq("dog_id", dogId)
        .order("test_date", { ascending: false });

      if (error) {
        console.error("Error fetching DNA tests:", error);
        throw new Error(`Failed to fetch DNA tests: ${error.message}`);
      }

      return data as DNATestResult[];
    },

    /**
     * Create a new DNA test result
     * @param testData - The DNA test data to create
     * @returns The created DNA test result
     */
    createDNATest: async (testData: Omit<DNATestResult, "id" | "created_at" | "updated_at">): Promise<DNATestResult> => {
      const { data, error } = await supabase
        .from("dna_test_results")
        .insert(testData)
        .select()
        .single();

      if (error) {
        console.error("Error creating DNA test:", error);
        throw new Error(`Failed to create DNA test: ${error.message}`);
      }

      return data as DNATestResult;
    },

    /**
     * Subscribe to DNA test results for a dog
     * @param dogId - The ID of the dog
     * @param callback - Callback function to handle new or updated DNA tests
     * @returns Subscription object that can be used to unsubscribe
     */
    subscribeToDogDNATests: (dogId: string, callback: (payload: any) => void) => {
      return supabase
        .channel(`dog-dna-tests-${dogId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'dna_test_results',
            filter: `dog_id=eq.${dogId}`
          },
          callback
        )
        .subscribe();
    }
  };
};
