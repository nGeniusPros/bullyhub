// Dogs Feature - Dogs API Function
import { createResponse, handleOptions } from "../../../netlify/utils/cors-headers.js";
import { supabase } from "../../../netlify/utils/supabase-client.js";

/**
 * Handle requests for dogs
 * 
 * GET: Get all dogs for the authenticated user
 * POST: Create a new dog
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

  // Handle GET request
  if (event.httpMethod === "GET") {
    try {
      // Get all dogs for the user
      const { data, error } = await supabase
        .from("dogs")
        .select(`
          *,
          breeding_program:breeding_programs(id, name)
        `)
        .eq("owner_id", user.id)
        .order("name");

      if (error) {
        console.error("Error fetching dogs:", error);
        return createResponse(500, { error: "Failed to fetch dogs" });
      }

      // Format the response
      const formattedDogs = data.map(dog => ({
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
        createdAt: dog.created_at
      }));

      return createResponse(200, formattedDogs);
    } catch (error) {
      console.error("Error processing request:", error);
      return createResponse(500, { error: "Internal server error" });
    }
  }

  // Handle POST request
  if (event.httpMethod === "POST") {
    try {
      // Parse the request body
      const dogData = JSON.parse(event.body);

      // Validate required fields
      if (!dogData.name || !dogData.breed) {
        return createResponse(400, { error: "Name and breed are required" });
      }

      // Insert the dog
      const { data: newDog, error: insertError } = await supabase
        .from("dogs")
        .insert({
          name: dogData.name,
          breed: dogData.breed,
          date_of_birth: dogData.dateOfBirth,
          color: dogData.color,
          owner_id: user.id,
          is_stud: dogData.isStud || false,
          weight: dogData.weight,
          height: dogData.height,
          microchip_number: dogData.microchipNumber,
          registration_number: dogData.registrationNumber,
          breeding_program_id: dogData.breedingProgramId
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating dog:", insertError);
        return createResponse(500, { error: "Failed to create dog" });
      }

      // Format the response
      const formattedDog = {
        id: newDog.id,
        name: newDog.name,
        breed: newDog.breed,
        dateOfBirth: newDog.date_of_birth,
        color: newDog.color,
        ownerId: newDog.owner_id,
        isStud: newDog.is_stud,
        profileImageUrl: newDog.profile_image_url,
        weight: newDog.weight,
        height: newDog.height,
        microchipNumber: newDog.microchip_number,
        registrationNumber: newDog.registration_number,
        breedingProgramId: newDog.breeding_program_id,
        createdAt: newDog.created_at
      };

      return createResponse(201, formattedDog);
    } catch (error) {
      console.error("Error processing request:", error);
      return createResponse(500, { error: "Internal server error" });
    }
  }

  // Handle unsupported methods
  return createResponse(405, { error: "Method not allowed" });
};
