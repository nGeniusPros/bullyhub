"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { checkDatabaseConnection } from "@/lib/database";
import { toast } from "@/components/ui/use-toast";

type DatabaseContextType = {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  retryConnection: () => Promise<void>;
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const connected = await checkDatabaseConnection();
      setIsConnected(connected);

      if (!connected) {
        setError("Could not connect to the database. Please try again later.");
        toast({
          title: "Database Connection Error",
          description: "Could not connect to the database. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Database connection error:", err);
      setIsConnected(false);
      setError(err.message || "An unexpected error occurred");
      toast({
        title: "Database Connection Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = async () => {
    await checkConnection();
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const value = {
    isConnected,
    isLoading,
    error,
    retryConnection,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
