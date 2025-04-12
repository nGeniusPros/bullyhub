"use client";

import { createBrowserSupabaseClient } from "./supabase-browser";

/**
 * Get the current user's authentication token
 * @returns The JWT token or null if not authenticated
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      console.error("Error getting auth token:", error);
      return null;
    }
    
    return data.session.access_token;
  } catch (error) {
    console.error("Unexpected error getting auth token:", error);
    return null;
  }
}

/**
 * Get authorization headers for API requests
 * @returns Headers object with Authorization header if authenticated
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  
  if (!token) {
    return {};
  }
  
  return {
    Authorization: `Bearer ${token}`,
  };
}
