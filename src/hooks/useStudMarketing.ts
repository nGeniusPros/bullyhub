"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { StudMarketing, Dog } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function useStudMarketing() {
  const [studProfiles, setStudProfiles] = useState<(StudMarketing & { dog?: Dog })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createBrowserSupabaseClient();

  const fetchStudProfiles = async (includeUnavailable: boolean = true) => {
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, get all stud dogs owned by the user
      const { data: dogs, error: dogsError } = await supabase
        .from("dogs")
        .select("*")
        .eq("owner_id", user.id)
        .eq("is_stud", true);

      if (dogsError) {
        throw dogsError;
      }

      // Get all stud marketing profiles for these dogs
      const { data: profiles, error: profilesError } = await supabase
        .from("stud_marketing")
        .select("*")
        .in(
          "stud_id",
          dogs.map((dog) => dog.id)
        );

      if (profilesError) {
        throw profilesError;
      }

      // Transform the data to match our StudMarketing interface and merge with dog data
      const transformedData: (StudMarketing & { dog?: Dog })[] = profiles.map((profile) => {
        const matchingDog = dogs.find((dog) => dog.id === profile.stud_id);
        
        const dogData: Dog | undefined = matchingDog
          ? {
              id: matchingDog.id,
              name: matchingDog.name,
              breed: matchingDog.breed,
              dateOfBirth: matchingDog.date_of_birth || undefined,
              color: matchingDog.color || undefined,
              ownerId: matchingDog.owner_id,
              isStud: matchingDog.is_stud,
              createdAt: matchingDog.created_at,
            }
          : undefined;

        return {
          id: profile.id,
          studId: profile.stud_id,
          title: profile.title,
          description: profile.description || undefined,
          dnaHighlights: profile.dna_highlights || undefined,
          colorGenetics: profile.color_genetics || undefined,
          healthClearances: profile.health_clearances || undefined,
          feeStructure: profile.fee_structure || undefined,
          availabilityCalendar: profile.availability_calendar || undefined,
          successMetrics: profile.success_metrics || undefined,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
          dog: dogData,
        };
      });

      // Add dogs that don't have marketing profiles yet
      const dogsWithoutProfiles = dogs.filter(
        (dog) => !profiles.some((profile) => profile.stud_id === dog.id)
      );

      const additionalDogs = dogsWithoutProfiles.map((dog) => ({
        id: "",
        studId: dog.id,
        title: `${dog.name} - ${dog.breed}`,
        description: undefined,
        dnaHighlights: undefined,
        colorGenetics: undefined,
        healthClearances: undefined,
        feeStructure: undefined,
        availabilityCalendar: undefined,
        successMetrics: undefined,
        createdAt: "",
        updatedAt: "",
        dog: {
          id: dog.id,
          name: dog.name,
          breed: dog.breed,
          dateOfBirth: dog.date_of_birth || undefined,
          color: dog.color || undefined,
          ownerId: dog.owner_id,
          isStud: dog.is_stud,
          createdAt: dog.created_at,
        },
      }));

      setStudProfiles([...transformedData, ...additionalDogs]);
    } catch (err: any) {
      console.error("Error fetching stud profiles:", err);
      setError(err.message || "Failed to fetch stud profiles");
      toast({
        title: "Error",
        description: "Failed to fetch stud profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addStudProfile = async (
    profile: Omit<StudMarketing, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    try {
      setError(null);

      // First, verify that the stud dog belongs to the current user
      const { data: dogData, error: dogError } = await supabase
        .from("dogs")
        .select("*")
        .eq("id", profile.studId)
        .eq("owner_id", user.id)
        .single();

      if (dogError) {
        throw new Error("Dog not found or access denied");
      }

      // Transform the profile data to match the database schema
      const profileData = {
        stud_id: profile.studId,
        title: profile.title,
        description: profile.description,
        dna_highlights: profile.dnaHighlights,
        color_genetics: profile.colorGenetics,
        health_clearances: profile.healthClearances,
        fee_structure: profile.feeStructure,
        availability_calendar: profile.availabilityCalendar,
        success_metrics: profile.successMetrics,
      };

      const { data, error } = await supabase
        .from("stud_marketing")
        .insert(profileData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the returned data to match our StudMarketing interface
      const newProfile: StudMarketing & { dog?: Dog } = {
        id: data.id,
        studId: data.stud_id,
        title: data.title,
        description: data.description || undefined,
        dnaHighlights: data.dna_highlights || undefined,
        colorGenetics: data.color_genetics || undefined,
        healthClearances: data.health_clearances || undefined,
        feeStructure: data.fee_structure || undefined,
        availabilityCalendar: data.availability_calendar || undefined,
        successMetrics: data.success_metrics || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        dog: {
          id: dogData.id,
          name: dogData.name,
          breed: dogData.breed,
          dateOfBirth: dogData.date_of_birth || undefined,
          color: dogData.color || undefined,
          ownerId: dogData.owner_id,
          isStud: dogData.is_stud,
          createdAt: dogData.created_at,
        },
      };

      // Update the local state
      setStudProfiles((prev) => {
        // Remove any existing profile for this stud (including placeholder)
        const filtered = prev.filter((p) => p.studId !== profile.studId);
        return [newProfile, ...filtered];
      });

      toast({
        title: "Success",
        description: "Stud profile added successfully",
      });

      return newProfile;
    } catch (err: any) {
      console.error("Error adding stud profile:", err);
      setError(err.message || "Failed to add stud profile");
      toast({
        title: "Error",
        description: "Failed to add stud profile",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateStudProfile = async (
    id: string,
    updates: Partial<Omit<StudMarketing, "id" | "studId" | "createdAt" | "updatedAt">>
  ) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      setError(null);

      // First, verify that the profile belongs to a dog owned by the current user
      const { data: profileData, error: profileError } = await supabase
        .from("stud_marketing")
        .select("stud_id")
        .eq("id", id)
        .single();

      if (profileError) {
        throw new Error("Profile not found");
      }

      const { data: dogData, error: dogError } = await supabase
        .from("dogs")
        .select("owner_id")
        .eq("id", profileData.stud_id)
        .single();

      if (dogError) {
        throw new Error("Dog not found");
      }

      if (dogData.owner_id !== user.id) {
        throw new Error("Access denied");
      }

      // Transform the updates to match the database schema
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.dnaHighlights !== undefined) updateData.dna_highlights = updates.dnaHighlights;
      if (updates.colorGenetics !== undefined) updateData.color_genetics = updates.colorGenetics;
      if (updates.healthClearances !== undefined) updateData.health_clearances = updates.healthClearances;
      if (updates.feeStructure !== undefined) updateData.fee_structure = updates.feeStructure;
      if (updates.availabilityCalendar !== undefined) updateData.availability_calendar = updates.availabilityCalendar;
      if (updates.successMetrics !== undefined) updateData.success_metrics = updates.successMetrics;

      const { data, error } = await supabase
        .from("stud_marketing")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Get the dog data to include in the updated profile
      const { data: dog, error: dogFetchError } = await supabase
        .from("dogs")
        .select("*")
        .eq("id", data.stud_id)
        .single();

      if (dogFetchError) {
        throw dogFetchError;
      }

      // Transform the returned data to match our StudMarketing interface
      const updatedProfile: StudMarketing & { dog?: Dog } = {
        id: data.id,
        studId: data.stud_id,
        title: data.title,
        description: data.description || undefined,
        dnaHighlights: data.dna_highlights || undefined,
        colorGenetics: data.color_genetics || undefined,
        healthClearances: data.health_clearances || undefined,
        feeStructure: data.fee_structure || undefined,
        availabilityCalendar: data.availability_calendar || undefined,
        successMetrics: data.success_metrics || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        dog: {
          id: dog.id,
          name: dog.name,
          breed: dog.breed,
          dateOfBirth: dog.date_of_birth || undefined,
          color: dog.color || undefined,
          ownerId: dog.owner_id,
          isStud: dog.is_stud,
          createdAt: dog.created_at,
        },
      };

      // Update the local state
      setStudProfiles((prev) =>
        prev.map((profile) => (profile.id === id ? updatedProfile : profile))
      );

      toast({
        title: "Success",
        description: "Stud profile updated successfully",
      });

      return true;
    } catch (err: any) {
      console.error("Error updating stud profile:", err);
      setError(err.message || "Failed to update stud profile");
      toast({
        title: "Error",
        description: "Failed to update stud profile",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteStudProfile = async (id: string) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      setError(null);

      // First, verify that the profile belongs to a dog owned by the current user
      const { data: profileData, error: profileError } = await supabase
        .from("stud_marketing")
        .select("stud_id")
        .eq("id", id)
        .single();

      if (profileError) {
        throw new Error("Profile not found");
      }

      const { data: dogData, error: dogError } = await supabase
        .from("dogs")
        .select("owner_id")
        .eq("id", profileData.stud_id)
        .single();

      if (dogError) {
        throw new Error("Dog not found");
      }

      if (dogData.owner_id !== user.id) {
        throw new Error("Access denied");
      }

      const { error } = await supabase
        .from("stud_marketing")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Update the local state
      setStudProfiles((prev) => prev.filter((profile) => profile.id !== id));

      toast({
        title: "Success",
        description: "Stud profile deleted successfully",
      });

      return true;
    } catch (err: any) {
      console.error("Error deleting stud profile:", err);
      setError(err.message || "Failed to delete stud profile");
      toast({
        title: "Error",
        description: "Failed to delete stud profile",
        variant: "destructive",
      });
      return false;
    }
  };

  const getStudProfileById = async (id: string) => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    try {
      setError(null);

      const { data: profile, error: profileError } = await supabase
        .from("stud_marketing")
        .select("*")
        .eq("id", id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Get the dog data
      const { data: dog, error: dogError } = await supabase
        .from("dogs")
        .select("*")
        .eq("id", profile.stud_id)
        .single();

      if (dogError) {
        throw dogError;
      }

      // Verify ownership
      if (dog.owner_id !== user.id) {
        throw new Error("Access denied");
      }

      // Transform the data to match our StudMarketing interface
      const studProfile: StudMarketing & { dog: Dog } = {
        id: profile.id,
        studId: profile.stud_id,
        title: profile.title,
        description: profile.description || undefined,
        dnaHighlights: profile.dna_highlights || undefined,
        colorGenetics: profile.color_genetics || undefined,
        healthClearances: profile.health_clearances || undefined,
        feeStructure: profile.fee_structure || undefined,
        availabilityCalendar: profile.availability_calendar || undefined,
        successMetrics: profile.success_metrics || undefined,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        dog: {
          id: dog.id,
          name: dog.name,
          breed: dog.breed,
          dateOfBirth: dog.date_of_birth || undefined,
          color: dog.color || undefined,
          ownerId: dog.owner_id,
          isStud: dog.is_stud,
          createdAt: dog.created_at,
        },
      };

      return studProfile;
    } catch (err: any) {
      console.error("Error fetching stud profile:", err);
      setError(err.message || "Failed to fetch stud profile");
      toast({
        title: "Error",
        description: "Failed to fetch stud profile",
        variant: "destructive",
      });
      return null;
    }
  };

  // Fetch stud profiles on component mount
  useEffect(() => {
    if (user) {
      fetchStudProfiles();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    studProfiles,
    loading,
    error,
    fetchStudProfiles,
    addStudProfile,
    updateStudProfile,
    deleteStudProfile,
    getStudProfileById,
  };
}
