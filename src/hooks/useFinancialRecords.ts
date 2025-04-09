"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { FinancialRecord } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function useFinancialRecords() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createBrowserSupabaseClient();

  const fetchRecords = async (filters?: {
    recordType?: "income" | "expense";
    startDate?: string;
    endDate?: string;
    category?: string;
    relatedDogId?: string;
    relatedClientId?: string;
  }) => {
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("financial_records")
        .select("*")
        .eq("breeder_id", user.id);

      // Apply filters if provided
      if (filters) {
        if (filters.recordType) {
          query = query.eq("record_type", filters.recordType);
        }
        if (filters.startDate) {
          query = query.gte("date", filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte("date", filters.endDate);
        }
        if (filters.category) {
          query = query.eq("category", filters.category);
        }
        if (filters.relatedDogId) {
          query = query.eq("related_dog_id", filters.relatedDogId);
        }
        if (filters.relatedClientId) {
          query = query.eq("related_client_id", filters.relatedClientId);
        }
      }

      // Order by date, most recent first
      query = query.order("date", { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Transform the data to match our FinancialRecord interface
      const transformedData: FinancialRecord[] = data.map((record) => ({
        id: record.id,
        breederId: record.breeder_id,
        recordType: record.record_type as "income" | "expense",
        category: record.category,
        amount: record.amount,
        description: record.description || undefined,
        date: record.date,
        relatedDogId: record.related_dog_id || undefined,
        relatedClientId: record.related_client_id || undefined,
        receiptUrl: record.receipt_url || undefined,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
      }));

      setRecords(transformedData);
    } catch (err: any) {
      console.error("Error fetching financial records:", err);
      setError(err.message || "Failed to fetch financial records");
      toast({
        title: "Error",
        description: "Failed to fetch financial records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (
    record: Omit<FinancialRecord, "id" | "breederId" | "createdAt" | "updatedAt">
  ) => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    try {
      setError(null);

      // Transform the record data to match the database schema
      const recordData = {
        breeder_id: user.id,
        record_type: record.recordType,
        category: record.category,
        amount: record.amount,
        description: record.description,
        date: record.date,
        related_dog_id: record.relatedDogId,
        related_client_id: record.relatedClientId,
        receipt_url: record.receiptUrl,
      };

      const { data, error } = await supabase
        .from("financial_records")
        .insert(recordData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the returned data to match our FinancialRecord interface
      const newRecord: FinancialRecord = {
        id: data.id,
        breederId: data.breeder_id,
        recordType: data.record_type as "income" | "expense",
        category: data.category,
        amount: data.amount,
        description: data.description || undefined,
        date: data.date,
        relatedDogId: data.related_dog_id || undefined,
        relatedClientId: data.related_client_id || undefined,
        receiptUrl: data.receipt_url || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      // Update the local state
      setRecords((prev) => [newRecord, ...prev]);

      toast({
        title: "Success",
        description: "Financial record added successfully",
      });

      return newRecord;
    } catch (err: any) {
      console.error("Error adding financial record:", err);
      setError(err.message || "Failed to add financial record");
      toast({
        title: "Error",
        description: "Failed to add financial record",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateRecord = async (
    id: string,
    updates: Partial<Omit<FinancialRecord, "id" | "breederId" | "createdAt" | "updatedAt">>
  ) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      setError(null);

      // Transform the updates to match the database schema
      const updateData: any = {};
      if (updates.recordType !== undefined) updateData.record_type = updates.recordType;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.relatedDogId !== undefined) updateData.related_dog_id = updates.relatedDogId;
      if (updates.relatedClientId !== undefined) updateData.related_client_id = updates.relatedClientId;
      if (updates.receiptUrl !== undefined) updateData.receipt_url = updates.receiptUrl;

      const { data, error } = await supabase
        .from("financial_records")
        .update(updateData)
        .eq("id", id)
        .eq("breeder_id", user.id) // Ensure the record belongs to the user
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the returned data to match our FinancialRecord interface
      const updatedRecord: FinancialRecord = {
        id: data.id,
        breederId: data.breeder_id,
        recordType: data.record_type as "income" | "expense",
        category: data.category,
        amount: data.amount,
        description: data.description || undefined,
        date: data.date,
        relatedDogId: data.related_dog_id || undefined,
        relatedClientId: data.related_client_id || undefined,
        receiptUrl: data.receipt_url || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      // Update the local state
      setRecords((prev) =>
        prev.map((record) => (record.id === id ? updatedRecord : record))
      );

      toast({
        title: "Success",
        description: "Financial record updated successfully",
      });

      return true;
    } catch (err: any) {
      console.error("Error updating financial record:", err);
      setError(err.message || "Failed to update financial record");
      toast({
        title: "Error",
        description: "Failed to update financial record",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteRecord = async (id: string) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      setError(null);

      const { error } = await supabase
        .from("financial_records")
        .delete()
        .eq("id", id)
        .eq("breeder_id", user.id); // Ensure the record belongs to the user

      if (error) {
        throw error;
      }

      // Update the local state
      setRecords((prev) => prev.filter((record) => record.id !== id));

      toast({
        title: "Success",
        description: "Financial record deleted successfully",
      });

      return true;
    } catch (err: any) {
      console.error("Error deleting financial record:", err);
      setError(err.message || "Failed to delete financial record");
      toast({
        title: "Error",
        description: "Failed to delete financial record",
        variant: "destructive",
      });
      return false;
    }
  };

  const getFinancialSummary = () => {
    const totalIncome = records
      .filter((record) => record.recordType === "income")
      .reduce((sum, record) => sum + record.amount, 0);

    const totalExpenses = records
      .filter((record) => record.recordType === "expense")
      .reduce((sum, record) => sum + record.amount, 0);

    const netProfit = totalIncome - totalExpenses;

    // Calculate by category
    const incomeByCategory = records
      .filter((record) => record.recordType === "income")
      .reduce((acc, record) => {
        acc[record.category] = (acc[record.category] || 0) + record.amount;
        return acc;
      }, {} as Record<string, number>);

    const expensesByCategory = records
      .filter((record) => record.recordType === "expense")
      .reduce((acc, record) => {
        acc[record.category] = (acc[record.category] || 0) + record.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      incomeByCategory,
      expensesByCategory,
    };
  };

  // Fetch records on component mount
  useEffect(() => {
    if (user) {
      fetchRecords();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    records,
    loading,
    error,
    fetchRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    getFinancialSummary,
  };
}
