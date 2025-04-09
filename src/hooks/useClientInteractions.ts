"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { ClientInteraction } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function useClientInteractions(clientId?: string) {
  const [interactions, setInteractions] = useState<ClientInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createBrowserSupabaseClient();

  const fetchInteractions = async (id?: string) => {
    const targetClientId = id || clientId;
    
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    if (!targetClientId) {
      setError("Client ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, verify that the client belongs to the current user
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("breeder_id")
        .eq("id", targetClientId)
        .single();

      if (clientError) {
        throw new Error("Client not found or access denied");
      }

      if (clientData.breeder_id !== user.id) {
        throw new Error("Access denied");
      }

      // Now fetch the interactions
      const { data, error } = await supabase
        .from("client_interactions")
        .select("*")
        .eq("client_id", targetClientId)
        .order("interaction_date", { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our ClientInteraction interface
      const transformedData: ClientInteraction[] = data.map((interaction) => ({
        id: interaction.id,
        clientId: interaction.client_id,
        interactionType: interaction.interaction_type,
        interactionDate: interaction.interaction_date,
        notes: interaction.notes || undefined,
        followUpDate: interaction.follow_up_date || undefined,
        followUpCompleted: interaction.follow_up_completed,
        createdAt: interaction.created_at,
        updatedAt: interaction.updated_at,
      }));

      setInteractions(transformedData);
    } catch (err: any) {
      console.error("Error fetching client interactions:", err);
      setError(err.message || "Failed to fetch client interactions");
      toast({
        title: "Error",
        description: "Failed to fetch client interactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addInteraction = async (
    interaction: Omit<ClientInteraction, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    try {
      setError(null);

      // First, verify that the client belongs to the current user
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("breeder_id")
        .eq("id", interaction.clientId)
        .single();

      if (clientError) {
        throw new Error("Client not found or access denied");
      }

      if (clientData.breeder_id !== user.id) {
        throw new Error("Access denied");
      }

      // Transform the interaction data to match the database schema
      const interactionData = {
        client_id: interaction.clientId,
        interaction_type: interaction.interactionType,
        interaction_date: interaction.interactionDate,
        notes: interaction.notes,
        follow_up_date: interaction.followUpDate,
        follow_up_completed: interaction.followUpCompleted,
      };

      const { data, error } = await supabase
        .from("client_interactions")
        .insert(interactionData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the returned data to match our ClientInteraction interface
      const newInteraction: ClientInteraction = {
        id: data.id,
        clientId: data.client_id,
        interactionType: data.interaction_type,
        interactionDate: data.interaction_date,
        notes: data.notes || undefined,
        followUpDate: data.follow_up_date || undefined,
        followUpCompleted: data.follow_up_completed,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      // Update the local state
      setInteractions((prev) => [newInteraction, ...prev]);

      toast({
        title: "Success",
        description: "Interaction added successfully",
      });

      return newInteraction;
    } catch (err: any) {
      console.error("Error adding client interaction:", err);
      setError(err.message || "Failed to add client interaction");
      toast({
        title: "Error",
        description: "Failed to add client interaction",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateInteraction = async (
    id: string,
    updates: Partial<Omit<ClientInteraction, "id" | "clientId" | "createdAt" | "updatedAt">>
  ) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      setError(null);

      // First, verify that the interaction belongs to a client owned by the current user
      const { data: interactionData, error: interactionError } = await supabase
        .from("client_interactions")
        .select("client_id")
        .eq("id", id)
        .single();

      if (interactionError) {
        throw new Error("Interaction not found");
      }

      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("breeder_id")
        .eq("id", interactionData.client_id)
        .single();

      if (clientError) {
        throw new Error("Client not found");
      }

      if (clientData.breeder_id !== user.id) {
        throw new Error("Access denied");
      }

      // Transform the updates to match the database schema
      const updateData: any = {};
      if (updates.interactionType !== undefined) updateData.interaction_type = updates.interactionType;
      if (updates.interactionDate !== undefined) updateData.interaction_date = updates.interactionDate;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.followUpDate !== undefined) updateData.follow_up_date = updates.followUpDate;
      if (updates.followUpCompleted !== undefined) updateData.follow_up_completed = updates.followUpCompleted;

      const { data, error } = await supabase
        .from("client_interactions")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the returned data to match our ClientInteraction interface
      const updatedInteraction: ClientInteraction = {
        id: data.id,
        clientId: data.client_id,
        interactionType: data.interaction_type,
        interactionDate: data.interaction_date,
        notes: data.notes || undefined,
        followUpDate: data.follow_up_date || undefined,
        followUpCompleted: data.follow_up_completed,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      // Update the local state
      setInteractions((prev) =>
        prev.map((interaction) => (interaction.id === id ? updatedInteraction : interaction))
      );

      toast({
        title: "Success",
        description: "Interaction updated successfully",
      });

      return true;
    } catch (err: any) {
      console.error("Error updating client interaction:", err);
      setError(err.message || "Failed to update client interaction");
      toast({
        title: "Error",
        description: "Failed to update client interaction",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteInteraction = async (id: string) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      setError(null);

      // First, verify that the interaction belongs to a client owned by the current user
      const { data: interactionData, error: interactionError } = await supabase
        .from("client_interactions")
        .select("client_id")
        .eq("id", id)
        .single();

      if (interactionError) {
        throw new Error("Interaction not found");
      }

      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("breeder_id")
        .eq("id", interactionData.client_id)
        .single();

      if (clientError) {
        throw new Error("Client not found");
      }

      if (clientData.breeder_id !== user.id) {
        throw new Error("Access denied");
      }

      const { error } = await supabase
        .from("client_interactions")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Update the local state
      setInteractions((prev) => prev.filter((interaction) => interaction.id !== id));

      toast({
        title: "Success",
        description: "Interaction deleted successfully",
      });

      return true;
    } catch (err: any) {
      console.error("Error deleting client interaction:", err);
      setError(err.message || "Failed to delete client interaction");
      toast({
        title: "Error",
        description: "Failed to delete client interaction",
        variant: "destructive",
      });
      return false;
    }
  };

  const completeFollowUp = async (id: string) => {
    return updateInteraction(id, { followUpCompleted: true });
  };

  // Fetch interactions on component mount if clientId is provided
  useEffect(() => {
    if (user && clientId) {
      fetchInteractions();
    } else {
      setLoading(false);
    }
  }, [user, clientId]);

  return {
    interactions,
    loading,
    error,
    fetchInteractions,
    addInteraction,
    updateInteraction,
    deleteInteraction,
    completeFollowUp,
  };
}
