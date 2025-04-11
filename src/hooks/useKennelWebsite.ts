import { useState, useCallback } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { KennelWebsite } from "@/types";
import { toast } from "sonner";

export function useKennelWebsite() {
  const supabase = createBrowserSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all kennel websites for the current user
  const fetchKennelWebsites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: user } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("kennel_websites")
        .select("*")
        .eq("breeder_id", user.user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch kennel websites";
      setError(errorMessage);
      toast.error("Error", { description: errorMessage });
      return [];
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Fetch a single kennel website by ID
  const fetchKennelWebsite = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("kennel_websites")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch kennel website";
      setError(errorMessage);
      toast.error("Error", { description: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Create a new kennel website
  const createKennelWebsite = useCallback(async (website: Omit<KennelWebsite, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true);
      setError(null);

      const { data: user } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Check if site name is already taken
      const { data: existingSite, error: checkError } = await supabase
        .from("kennel_websites")
        .select("id")
        .eq("site_name", website.siteName)
        .maybeSingle();

      if (checkError) {
        throw new Error(checkError.message);
      }

      if (existingSite) {
        throw new Error("Site name is already taken. Please choose a different name.");
      }

      // Create the website
      const { data, error } = await supabase
        .from("kennel_websites")
        .insert({
          breeder_id: user.user?.id,
          template_type: website.templateType,
          site_name: website.siteName,
          domain: website.domain,
          logo_url: website.logoUrl,
          color_scheme: website.colorScheme,
          content: website.content,
          published: false,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Success", { description: "Kennel website created successfully" });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create kennel website";
      setError(errorMessage);
      toast.error("Error", { description: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Update an existing kennel website
  const updateKennelWebsite = useCallback(async (id: string, updates: Partial<Omit<KennelWebsite, "id" | "breederId" | "createdAt" | "updatedAt">>) => {
    try {
      setLoading(true);
      setError(null);

      // If updating site name, check if it's already taken
      if (updates.siteName) {
        const { data: existingSite, error: checkError } = await supabase
          .from("kennel_websites")
          .select("id")
          .eq("site_name", updates.siteName)
          .neq("id", id)
          .maybeSingle();

        if (checkError) {
          throw new Error(checkError.message);
        }

        if (existingSite) {
          throw new Error("Site name is already taken. Please choose a different name.");
        }
      }

      // Convert from camelCase to snake_case for database
      const dbUpdates: any = {};
      if (updates.siteName) dbUpdates.site_name = updates.siteName;
      if (updates.templateType) dbUpdates.template_type = updates.templateType;
      if (updates.domain !== undefined) dbUpdates.domain = updates.domain;
      if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
      if (updates.colorScheme !== undefined) dbUpdates.color_scheme = updates.colorScheme;
      if (updates.content !== undefined) dbUpdates.content = updates.content;
      if (updates.published !== undefined) dbUpdates.published = updates.published;
      if (updates.publishedAt !== undefined) dbUpdates.published_at = updates.publishedAt;

      const { data, error } = await supabase
        .from("kennel_websites")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Success", { description: "Kennel website updated successfully" });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update kennel website";
      setError(errorMessage);
      toast.error("Error", { description: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Publish a kennel website
  const publishKennelWebsite = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("kennel_websites")
        .update({
          published: true,
          published_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Success", { description: "Kennel website published successfully" });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to publish kennel website";
      setError(errorMessage);
      toast.error("Error", { description: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Unpublish a kennel website
  const unpublishKennelWebsite = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("kennel_websites")
        .update({
          published: false,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Success", { description: "Kennel website unpublished successfully" });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to unpublish kennel website";
      setError(errorMessage);
      toast.error("Error", { description: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Delete a kennel website
  const deleteKennelWebsite = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("kennel_websites")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Success", { description: "Kennel website deleted successfully" });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete kennel website";
      setError(errorMessage);
      toast.error("Error", { description: errorMessage });
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Check if a site name is available
  const checkSiteNameAvailability = useCallback(async (siteName: string, excludeId?: string) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("kennel_websites")
        .select("id")
        .eq("site_name", siteName);

      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return !data; // Return true if no data (site name is available)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to check site name availability";
      setError(errorMessage);
      toast.error("Error", { description: errorMessage });
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return {
    loading,
    error,
    fetchKennelWebsites,
    fetchKennelWebsite,
    createKennelWebsite,
    updateKennelWebsite,
    publishKennelWebsite,
    unpublishKennelWebsite,
    deleteKennelWebsite,
    checkSiteNameAvailability,
  };
}
