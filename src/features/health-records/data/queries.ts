// Health Records Feature - Supabase Queries
import { createClient } from "@/lib/supabase-server";
import { createClient as createBrowserClient } from "@/lib/supabase-browser";
import { HealthRecord, HealthRecordWithDog } from "../types";

/**
 * Server-side queries (for use in Netlify functions and server components)
 */
export const healthRecordQueries = {
  /**
   * Get all health records for a dog
   * @param dogId - The ID of the dog
   * @returns Array of health records
   */
  getDogHealthRecords: async (dogId: string): Promise<HealthRecord[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("health_records")
      .select("*")
      .eq("dog_id", dogId)
      .order("record_date", { ascending: false });

    if (error) {
      console.error("Error fetching health records:", error);
      throw new Error(`Failed to fetch health records: ${error.message}`);
    }

    return data as HealthRecord[];
  },

  /**
   * Get a health record by ID
   * @param recordId - The ID of the health record
   * @returns Health record with dog information
   */
  getHealthRecordById: async (recordId: string): Promise<HealthRecordWithDog | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("health_records")
      .select(`
        *,
        dog:dogs(id, name, breed)
      `)
      .eq("id", recordId)
      .single();

    if (error) {
      console.error("Error fetching health record:", error);
      throw new Error(`Failed to fetch health record: ${error.message}`);
    }

    if (!data) return null;

    return data as HealthRecordWithDog;
  },

  /**
   * Create a new health record
   * @param record - The health record data to create
   * @returns The created health record
   */
  createHealthRecord: async (record: Omit<HealthRecord, "id" | "created_at" | "updated_at">): Promise<HealthRecord> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("health_records")
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error("Error creating health record:", error);
      throw new Error(`Failed to create health record: ${error.message}`);
    }

    return data as HealthRecord;
  },

  /**
   * Update a health record
   * @param recordId - The ID of the health record to update
   * @param record - The health record data to update
   * @returns The updated health record
   */
  updateHealthRecord: async (recordId: string, record: Partial<Omit<HealthRecord, "id" | "created_at" | "updated_at">>): Promise<HealthRecord> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("health_records")
      .update(record)
      .eq("id", recordId)
      .select()
      .single();

    if (error) {
      console.error("Error updating health record:", error);
      throw new Error(`Failed to update health record: ${error.message}`);
    }

    return data as HealthRecord;
  },

  /**
   * Delete a health record
   * @param recordId - The ID of the health record to delete
   */
  deleteHealthRecord: async (recordId: string): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("health_records")
      .delete()
      .eq("id", recordId);

    if (error) {
      console.error("Error deleting health record:", error);
      throw new Error(`Failed to delete health record: ${error.message}`);
    }
  },

  /**
   * Upload a document for a health record
   * @param recordId - The ID of the health record
   * @param file - The document file to upload
   * @returns The URL of the uploaded document
   */
  uploadHealthRecordDocument: async (recordId: string, file: File): Promise<string> => {
    const supabase = createClient();
    
    // Upload the file to storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('health-documents')
      .upload(`${recordId}/${file.name}`, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error("Error uploading document:", uploadError);
      throw new Error(`Failed to upload document: ${uploadError.message}`);
    }
    
    // Get the public URL
    const { data: urlData } = supabase
      .storage
      .from('health-documents')
      .getPublicUrl(uploadData.path);
    
    // Get the current record to update the documents array
    const { data: record, error: recordError } = await supabase
      .from("health_records")
      .select("documents")
      .eq("id", recordId)
      .single();
    
    if (recordError) {
      console.error("Error fetching health record:", recordError);
      throw new Error(`Failed to fetch health record: ${recordError.message}`);
    }
    
    // Update the health record with the new document URL
    const documents = record.documents || [];
    documents.push(urlData.publicUrl);
    
    const { error: updateError } = await supabase
      .from("health_records")
      .update({ documents })
      .eq("id", recordId);
    
    if (updateError) {
      console.error("Error updating health record with document:", updateError);
      throw new Error(`Failed to update health record with document: ${updateError.message}`);
    }
    
    return urlData.publicUrl;
  }
};

/**
 * Client-side hooks (for use in React components)
 */
export const useHealthRecordQueries = () => {
  const supabase = createBrowserClient();
  
  return {
    /**
     * Get all health records for a dog
     * @param dogId - The ID of the dog
     * @returns Array of health records
     */
    getDogHealthRecords: async (dogId: string): Promise<HealthRecord[]> => {
      const { data, error } = await supabase
        .from("health_records")
        .select("*")
        .eq("dog_id", dogId)
        .order("record_date", { ascending: false });
      
      if (error) {
        console.error("Error fetching health records:", error);
        throw new Error(`Failed to fetch health records: ${error.message}`);
      }
      
      return data as HealthRecord[];
    },
    
    /**
     * Create a new health record
     * @param record - The health record data to create
     * @returns The created health record
     */
    createHealthRecord: async (record: Omit<HealthRecord, "id" | "created_at" | "updated_at">, files?: FileList): Promise<HealthRecord> => {
      // First create the record
      const { data, error } = await supabase
        .from("health_records")
        .insert(record)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating health record:", error);
        throw new Error(`Failed to create health record: ${error.message}`);
      }
      
      // If there are files, upload them
      if (files && files.length > 0) {
        const documents: string[] = [];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          // Upload the file to storage
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('health-documents')
            .upload(`${data.id}/${file.name}`, file, {
              cacheControl: '3600',
              upsert: true
            });
          
          if (uploadError) {
            console.error("Error uploading document:", uploadError);
            continue;
          }
          
          // Get the public URL
          const { data: urlData } = supabase
            .storage
            .from('health-documents')
            .getPublicUrl(uploadData.path);
          
          documents.push(urlData.publicUrl);
        }
        
        // Update the record with the document URLs
        if (documents.length > 0) {
          const { data: updatedData, error: updateError } = await supabase
            .from("health_records")
            .update({ documents })
            .eq("id", data.id)
            .select()
            .single();
          
          if (!updateError) {
            return updatedData as HealthRecord;
          }
        }
      }
      
      return data as HealthRecord;
    },
    
    /**
     * Update a health record
     * @param recordId - The ID of the health record to update
     * @param record - The health record data to update
     * @returns The updated health record
     */
    updateHealthRecord: async (recordId: string, record: Partial<Omit<HealthRecord, "id" | "created_at" | "updated_at">>, files?: FileList): Promise<HealthRecord> => {
      // First update the record
      const { data, error } = await supabase
        .from("health_records")
        .update(record)
        .eq("id", recordId)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating health record:", error);
        throw new Error(`Failed to update health record: ${error.message}`);
      }
      
      // If there are files, upload them
      if (files && files.length > 0) {
        const existingDocuments = data.documents || [];
        const newDocuments: string[] = [...existingDocuments];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          // Upload the file to storage
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('health-documents')
            .upload(`${recordId}/${file.name}`, file, {
              cacheControl: '3600',
              upsert: true
            });
          
          if (uploadError) {
            console.error("Error uploading document:", uploadError);
            continue;
          }
          
          // Get the public URL
          const { data: urlData } = supabase
            .storage
            .from('health-documents')
            .getPublicUrl(uploadData.path);
          
          newDocuments.push(urlData.publicUrl);
        }
        
        // Update the record with the document URLs
        if (newDocuments.length > existingDocuments.length) {
          const { data: updatedData, error: updateError } = await supabase
            .from("health_records")
            .update({ documents: newDocuments })
            .eq("id", recordId)
            .select()
            .single();
          
          if (!updateError) {
            return updatedData as HealthRecord;
          }
        }
      }
      
      return data as HealthRecord;
    },
    
    /**
     * Delete a health record
     * @param recordId - The ID of the health record to delete
     */
    deleteHealthRecord: async (recordId: string): Promise<void> => {
      // First get the record to find any documents
      const { data: record, error: recordError } = await supabase
        .from("health_records")
        .select("documents")
        .eq("id", recordId)
        .single();
      
      if (!recordError && record && record.documents && record.documents.length > 0) {
        // Extract file paths from URLs
        const filePaths = record.documents.map(url => {
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split('/');
          return pathParts.slice(pathParts.indexOf('health-documents') + 1).join('/');
        });
        
        // Delete files from storage
        if (filePaths.length > 0) {
          const { error: storageError } = await supabase
            .storage
            .from('health-documents')
            .remove(filePaths);
          
          if (storageError) {
            console.error("Error deleting documents:", storageError);
          }
        }
      }
      
      // Delete the record
      const { error } = await supabase
        .from("health_records")
        .delete()
        .eq("id", recordId);
      
      if (error) {
        console.error("Error deleting health record:", error);
        throw new Error(`Failed to delete health record: ${error.message}`);
      }
    }
  };
};
