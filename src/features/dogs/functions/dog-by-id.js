// Dogs Feature - Dog By ID API Function
import { createResponse, handleOptions } from "../../../netlify/utils/cors-headers.js";
import { supabase } from "../../../netlify/utils/supabase-client.js";

/**
 * Handle requests for a specific dog
 * 
 * GET: Get a dog by ID
 * PUT: Update a dog
 * DELETE: Delete a dog
 */
export const handler = async (event, context) => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  // Get the authenticated user
  const { user, error: authError } = await supabase.auth.api.getUserByCookie(event);
  if (authError || !user) {
    return createResponse(401, { error: "Unauthorized" });
  }

  // Get the dog ID from the path
  const dogId = event.path.split("/").pop();
  if (!dogId) {
    return createResponse(400, { error: "Dog ID is required" });
  }

  // Handle GET request
  if (event.httpMethod === "GET") {
    try {
      // Get the dog
      const { data: dog, error } = await supabase
        .from("dogs")
        .select(`
          *,
          owner:profiles(id, first_name, last_name, email),
          breeding_program:breeding_programs(id, name)
        `)
        .eq("id", dogId)
        .single();

      if (error) {
        console.error("Error fetching dog:", error);
        return createResponse(404, { error: "Dog not found" });
      }

      // Verify that the dog belongs to the user
      if (dog.owner_id !== user.id) {
        return createResponse(403, { error: "Unauthorized" });
      }

      // Format the response
      const formattedDog = {
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
        dateOfBirth: dog.date_of_birth,
        color: dog.color,
        ownerId: dog.owner_id,
        isStud: dog.is_stud,
        profileImageUrl: dog.profile_image_url,
        weight: dog.weight,
        height: dog.height,
        microchipNumber: dog.microchip_number,
        registrationNumber: dog.registration_number,
        breedingProgramId: dog.breeding_program_id,
        breedingProgramName: dog.breeding_program ? dog.breeding_program.name : null,
        owner: dog.owner ? {
          id: dog.owner.id,
          firstName: dog.owner.first_name,
          lastName: dog.owner.last_name,
          email: dog.owner.email
        } : null,
        createdAt: dog.created_at
      };

      return createResponse(200, formattedDog);
    } catch (error) {
      console.error("Error processing request:", error);
      return createResponse(500, { error: "Internal server error" });
    }
  }

  // Handle PUT request
  if (event.httpMethod === "PUT") {
    try {
      // Verify that the dog belongs to the user
      const { data: existingDog, error: fetchError } = await supabase
        .from("dogs")
        .select("owner_id")
        .eq("id", dogId)
        .single();

      if (fetchError || !existingDog) {
        return createResponse(404, { error: "Dog not found" });
      }

      if (existingDog.owner_id !== user.id) {
        return createResponse(403, { error: "Unauthorized" });
      }

      // Parse the request body
      const dogData = JSON.parse(event.body);

      // Update the dog
      const { data: updatedDog, error: updateError } = await supabase
        .from("dogs")
        .update({
          name: dogData.name,
          breed: dogData.breed,
          date_of_birth: dogData.dateOfBirth,
          color: dogData.color,
          is_stud: dogData.isStud,
          weight: dogData.weight,
          height: dogData.height,
          microchip_number: dogData.microchipNumber,
          registration_number: dogData.registrationNumber,
          breeding_program_id: dogData.breedingProgramId
        })
        .eq("id", dogId)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating dog:", updateError);
        return createResponse(500, { error: "Failed to update dog" });
      }

      // Format the response
      const formattedDog = {
        id: updatedDog.id,
        name: updatedDog.name,
        breed: updatedDog.breed,
        dateOfBirth: updatedDog.date_of_birth,
        color: updatedDog.color,
        ownerId: updatedDog.owner_id,
        isStud: updatedDog.is_stud,
        profileImageUrl: updatedDog.profile_image_url,
        weight: updatedDog.weight,
        height: updatedDog.height,
        microchipNumber: updatedDog.microchip_number,
        registrationNumber: updatedDog.registration_number,
        breedingProgramId: updatedDog.breeding_program_id,
        createdAt: updatedDog.created_at
      };

      return createResponse(200, formattedDog);
    } catch (error) {
      console.error("Error processing request:", error);
      return createResponse(500, { error: "Internal server error" });
    }
  }

  // Handle DELETE request
  if (event.httpMethod === "DELETE") {
    try {
      // Verify that the dog belongs to the user
      const { data: existingDog, error: fetchError } = await supabase
        .from("dogs")
        .select("owner_id")
        .eq("id", dogId)
        .single();

      if (fetchError || !existingDog) {
        return createResponse(404, { error: "Dog not found" });
      }

      if (existingDog.owner_id !== user.id) {
        return createResponse(403, { error: "Unauthorized" });
      }

      // Delete the dog
      const { error: deleteError } = await supabase
        .from("dogs")
        .delete()
        .eq("id", dogId);

      if (deleteError) {
        console.error("Error deleting dog:", deleteError);
        return createResponse(500, { error: "Failed to delete dog" });
      }

      return createResponse(200, { message: "Dog deleted successfully" });
    } catch (error) {
      console.error("Error processing request:", error);
      return createResponse(500, { error: "Internal server error" });
    }
  }

  // Handle unsupported methods
  return createResponse(405, { error: "Method not allowed" });
};
