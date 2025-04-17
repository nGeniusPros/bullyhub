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
  // For client-side, try to get from window.ENV first
  if (typeof window !== "undefined") {
    // Log for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log('Window ENV object:', window.ENV);
      console.log('Process env NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    }

    // Try window.ENV first
    if (window.ENV && (window.ENV.SUPABASE_URL || window.ENV.SUPABASE_ANON_KEY)) {
      return {
        SUPABASE_URL: window.ENV.SUPABASE_URL || "",
        SUPABASE_ANON_KEY: window.ENV.SUPABASE_ANON_KEY || "",
      };
    }

    // If window.ENV doesn't have values, try process.env directly
    if (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      };
    }

    // For Netlify deployments, try hardcoded values as a last resort
    // This is a temporary solution for debugging purposes
    if (window.location.hostname.includes('netlify.app')) {
      console.warn('Using fallback Supabase configuration for Netlify deployment');
      // Using actual values for Netlify deployment
      return {
        SUPABASE_URL: "https://jpnfefhrsehxzcrrozpw.supabase.co",
        SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwbmZlZmhyc2VoeHpjcnJvenB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjIwMDEsImV4cCI6MjA1OTI5ODAwMX0.lBfrSd1DnPlpTn0MQwJlNacGouCz2on6kqEzDvK6AGM",
      };
    }
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
