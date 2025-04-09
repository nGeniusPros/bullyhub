"use client";

// This file provides access to environment variables in the client-side code
// It uses the window.ENV object that's set in the layout.tsx file

// Define the window.ENV interface
declare global {
  interface Window {
    ENV?: {
      SUPABASE_URL?: string;
      SUPABASE_ANON_KEY?: string;
    };
  }
}

// Get environment variables from window.ENV or process.env
const getEnv = () => {
  if (typeof window !== "undefined" && window.ENV) {
    return {
      SUPABASE_URL: window.ENV.SUPABASE_URL || "",
      SUPABASE_ANON_KEY: window.ENV.SUPABASE_ANON_KEY || "",
    };
  }

  // Fallback to process.env (for server-side rendering)
  return {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  };
};

export const ENV = {
  // Supabase configuration
  ...getEnv(),

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",

  // Helper function to check if all required variables are set
  isConfigured: function () {
    const env = getEnv();
    return !!env.SUPABASE_URL && !!env.SUPABASE_ANON_KEY;
  },

  // Helper function to get missing variables
  getMissingVars: function () {
    const env = getEnv();
    const missing = [];
    if (!env.SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!env.SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return missing;
  },
};
