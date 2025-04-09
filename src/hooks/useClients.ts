"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Client } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createBrowserSupabaseClient();

  const fetchClients = async () => {
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("breeder_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our Client interface
      const transformedData: Client[] = data.map((client) => ({
        id: client.id,
        breederId: client.breeder_id,
        firstName: client.first_name,
        lastName: client.last_name,
        email: client.email || undefined,
        phone: client.phone || undefined,
        address: client.address || undefined,
        city: client.city || undefined,
        state: client.state || undefined,
        zip: client.zip || undefined,
        country: client.country || undefined,
        status: client.status as "prospect" | "active" | "past" || "prospect",
        source: client.source || undefined,
        notes: client.notes || undefined,
        createdAt: client.created_at,
        updatedAt: client.updated_at,
      }));

      setClients(transformedData);
    } catch (err: any) {
      console.error("Error fetching clients:", err);
      setError(err.message || "Failed to fetch clients");
      toast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, "id" | "breederId" | "createdAt" | "updatedAt">) => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    try {
      setError(null);

      // Transform the client data to match the database schema
      const clientData = {
        breeder_id: user.id,
        first_name: client.firstName,
        last_name: client.lastName,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        state: client.state,
        zip: client.zip,
        country: client.country || "USA",
        status: client.status || "prospect",
        source: client.source,
        notes: client.notes,
      };

      const { data, error } = await supabase
        .from("clients")
        .insert(clientData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the returned data to match our Client interface
      const newClient: Client = {
        id: data.id,
        breederId: data.breeder_id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        zip: data.zip || undefined,
        country: data.country || undefined,
        status: data.status as "prospect" | "active" | "past" || "prospect",
        source: data.source || undefined,
        notes: data.notes || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      // Update the local state
      setClients((prev) => [newClient, ...prev]);

      toast({
        title: "Success",
        description: "Client added successfully",
      });

      return newClient;
    } catch (err: any) {
      console.error("Error adding client:", err);
      setError(err.message || "Failed to add client");
      toast({
        title: "Error",
        description: "Failed to add client",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateClient = async (
    id: string,
    updates: Partial<Omit<Client, "id" | "breederId" | "createdAt" | "updatedAt">>
  ) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      setError(null);

      // Transform the updates to match the database schema
      const updateData: any = {};
      if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
      if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.city !== undefined) updateData.city = updates.city;
      if (updates.state !== undefined) updateData.state = updates.state;
      if (updates.zip !== undefined) updateData.zip = updates.zip;
      if (updates.country !== undefined) updateData.country = updates.country;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.source !== undefined) updateData.source = updates.source;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { data, error } = await supabase
        .from("clients")
        .update(updateData)
        .eq("id", id)
        .eq("breeder_id", user.id) // Ensure the client belongs to the user
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the returned data to match our Client interface
      const updatedClient: Client = {
        id: data.id,
        breederId: data.breeder_id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        zip: data.zip || undefined,
        country: data.country || undefined,
        status: data.status as "prospect" | "active" | "past" || "prospect",
        source: data.source || undefined,
        notes: data.notes || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      // Update the local state
      setClients((prev) =>
        prev.map((client) => (client.id === id ? updatedClient : client))
      );

      toast({
        title: "Success",
        description: "Client updated successfully",
      });

      return true;
    } catch (err: any) {
      console.error("Error updating client:", err);
      setError(err.message || "Failed to update client");
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteClient = async (id: string) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      setError(null);

      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id)
        .eq("breeder_id", user.id); // Ensure the client belongs to the user

      if (error) {
        throw error;
      }

      // Update the local state
      setClients((prev) => prev.filter((client) => client.id !== id));

      toast({
        title: "Success",
        description: "Client deleted successfully",
      });

      return true;
    } catch (err: any) {
      console.error("Error deleting client:", err);
      setError(err.message || "Failed to delete client");
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
      return false;
    }
  };

  const getClientById = async (id: string) => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    try {
      setError(null);

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .eq("breeder_id", user.id) // Ensure the client belongs to the user
        .single();

      if (error) {
        throw error;
      }

      // Transform the data to match our Client interface
      const client: Client = {
        id: data.id,
        breederId: data.breeder_id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        zip: data.zip || undefined,
        country: data.country || undefined,
        status: data.status as "prospect" | "active" | "past" || "prospect",
        source: data.source || undefined,
        notes: data.notes || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return client;
    } catch (err: any) {
      console.error("Error fetching client:", err);
      setError(err.message || "Failed to fetch client");
      toast({
        title: "Error",
        description: "Failed to fetch client",
        variant: "destructive",
      });
      return null;
    }
  };

  // Fetch clients on component mount
  useEffect(() => {
    if (user) {
      fetchClients();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    clients,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
  };
}
