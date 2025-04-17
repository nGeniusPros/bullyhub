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
      const result = await checkDatabaseConnection();

      // Log the result for debugging
      console.log("Database connection check result:", result);

      if (result.success) {
        setIsConnected(true);
        console.log("Database connection successful");
      } else {
        setIsConnected(false);
        const errorMsg = result.error || "Could not connect to the database. Please try again later.";
        setError(errorMsg);

        // In Netlify deployments, don't show error toasts
        if (!window.location.hostname.includes('netlify.app')) {
          toast({
            title: "Database Connection Error",
            description: errorMsg,
            variant: "destructive",
          });
        } else {
          console.warn("Database connection error in Netlify deployment:", errorMsg);
          // For Netlify deployments, we'll still proceed even with connection errors
          setIsConnected(true);
        }
      }
    } catch (err: any) {
      console.error("Database connection error:", err);
      setIsConnected(false);
      const errorMsg = err.message || "An unexpected error occurred";
      setError(errorMsg);

      // In Netlify deployments, don't show error toasts
      if (!window.location.hostname.includes('netlify.app')) {
        toast({
          title: "Database Connection Error",
          description: errorMsg,
          variant: "destructive",
        });
      } else {
        console.warn("Database connection error in Netlify deployment:", errorMsg);
        // For Netlify deployments, we'll still proceed even with connection errors
        setIsConnected(true);
      }
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
