"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { checkDatabaseConnection } from "@/lib/database";
import { toast } from "@/components/ui/use-toast";
import { ENV } from "@/lib/env-config";

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
      // First check if environment variables are configured
      if (!ENV.isConfigured()) {
        console.warn("Supabase environment variables are not configured");
        const missingVars = ENV.getMissingVars();
        console.warn("Missing variables:", missingVars);

        // In development, we'll allow the app to continue even without DB connection
        if (process.env.NODE_ENV === 'development') {
          console.log("Running in development mode - allowing app to continue without DB connection");
          setIsConnected(true);
          return;
        } else {
          throw new Error(`Missing Supabase environment variables: ${missingVars.join(', ')}`);
        }
      }

      const connected = await checkDatabaseConnection();
      console.log("Database connection check result:", connected);
      setIsConnected(connected);

      if (!connected) {
        const errorMsg = "Could not connect to the database. Please try again later.";
        setError(errorMsg);

        // In development, we'll allow the app to continue even with DB errors
        if (process.env.NODE_ENV === 'development') {
          console.log("Running in development mode - allowing app to continue despite DB error");
          setIsConnected(true);
        } else {
          toast({
            title: "Database Connection Error",
            description: errorMsg,
            variant: "destructive",
          });
        }
      }
    } catch (err: any) {
      console.error("Database connection error:", err);
      setError(err.message || "An unexpected error occurred");

      // In development, we'll allow the app to continue even with errors
      if (process.env.NODE_ENV === 'development') {
        console.log("Running in development mode - allowing app to continue despite error");
        setIsConnected(true);
      } else {
        setIsConnected(false);
        toast({
          title: "Database Connection Error",
          description: err.message || "An unexpected error occurred",
          variant: "destructive",
        });
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
