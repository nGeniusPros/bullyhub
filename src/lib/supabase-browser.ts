"use client";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { ENV } from "./env-config";

// Create a single supabase client for the entire session
export const createClient = () => {
  const supabaseUrl = ENV.SUPABASE_URL;
  const supabaseKey = ENV.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables");
    throw new Error("Missing Supabase environment variables");
  }

  return createSupabaseClient(supabaseUrl, supabaseKey);
};

export const createBrowserSupabaseClient = () => {
  const supabaseUrl = ENV.SUPABASE_URL;
  const supabaseKey = ENV.SUPABASE_ANON_KEY;

  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Key available:", !!supabaseKey);

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables");
    console.error("Missing variables:", ENV.getMissingVars());
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
