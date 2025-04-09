"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata?: { [key: string]: any }
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);

      try {
        console.log("Getting session from Supabase...");
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        console.log("Session retrieved:", !!session);
        setSession(session);
        setUser(session?.user || null);

        // If we have a session, check if the profiles table exists
        if (session?.user) {
          try {
            console.log("Checking for user profile...");
            const { error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            // If the profiles table doesn't exist, we'll get an error
            // but we can still proceed with the session
            if (profileError) {
              console.warn(
                "Profile table may not exist:",
                profileError.message
              );
              // Don't throw the error, just log it
            }
          } catch (profileError: any) {
            console.warn("Error checking profile:", profileError.message);
            // Don't throw the error, just log it
          }
        }
      } catch (error: any) {
        console.error("Error getting session:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    metadata?: { [key: string]: any }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        throw error;
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    console.log("Attempting to sign in with email:", email);

    try {
      console.log("Calling Supabase auth.signInWithPassword");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Sign in response:", { data: !!data, error });

      if (error) {
        throw error;
      }

      // Check if the profiles table exists
      try {
        console.log("Checking for user profile...");
        const { error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user?.id)
          .single();

        if (profileError) {
          console.warn("Profile table may not exist:", profileError.message);
          // Don't throw the error, just log it and continue
        }
      } catch (profileError: any) {
        console.warn("Error checking profile:", profileError.message);
        // Don't throw the error, just log it and continue
      }

      console.log("Sign in successful, redirecting to dashboard");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error signing in:", error);
      setError(error.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.push("/");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
