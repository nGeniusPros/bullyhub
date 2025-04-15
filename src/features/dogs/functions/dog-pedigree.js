// Dogs Feature - Dog Pedigree API Function
import { createResponse, handleOptions } from "../../../netlify/utils/cors-headers.js";
import { supabase } from "../../../netlify/utils/supabase-client.js";

/**
 * Handle requests for a dog's pedigree
 * 
 * GET: Get a dog's pedigree
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
  const pathParts = event.path.split("/");
  const dogId = pathParts[pathParts.length - 2]; // The ID is the second-to-last part of the path
  
  if (!dogId) {
    return createResponse(400, { error: "Dog ID is required" });
  }

  // Handle GET request
  if (event.httpMethod === "GET") {
    try {
      // Get the dog
      const { data: dog, error: dogError } = await supabase
        .from("dogs")
        .select("*")
        .eq("id", dogId)
        .single();

      if (dogError || !dog) {
        console.error("Error fetching dog:", dogError);
        return createResponse(404, { error: "Dog not found" });
      }

      // For now, return a mock pedigree
      // In a real implementation, this would query the pedigree data from the database
      const mockPedigree = {
        dog: {
          id: dog.id,
          name: dog.name,
          breed: dog.breed,
          color: dog.color,
          dateOfBirth: dog.date_of_birth,
          registrationNumber: dog.registration_number,
          image: dog.profile_image_url
        },
        sire: {
          id: 'sire-1',
          name: 'Max',
          breed: dog.breed,
          color: 'Brindle',
          dateOfBirth: '2018-05-12',
          registrationNumber: 'REG123456',
          image: null,
          sire: {
            id: 'grandsire-1',
            name: 'Rocky',
            breed: dog.breed,
            color: 'Blue',
            dateOfBirth: '2015-03-20',
            registrationNumber: 'REG789012',
            image: null
          },
          dam: {
            id: 'granddam-1',
            name: 'Daisy',
            breed: dog.breed,
            color: 'Fawn',
            dateOfBirth: '2016-07-15',
            registrationNumber: 'REG345678',
            image: null
          }
        },
        dam: {
          id: 'dam-1',
          name: 'Luna',
          breed: dog.breed,
          color: 'Fawn',
          dateOfBirth: '2019-02-18',
          registrationNumber: 'REG567890',
          image: null,
          sire: {
            id: 'grandsire-2',
            name: 'Duke',
            breed: dog.breed,
            color: 'Brindle',
            dateOfBirth: '2016-11-05',
            registrationNumber: 'REG123789',
            image: null
          },
          dam: {
            id: 'granddam-2',
            name: 'Bella',
            breed: dog.breed,
            color: 'Fawn Pied',
            dateOfBirth: '2017-09-30',
            registrationNumber: 'REG456012',
            image: null
          }
        }
      };

      return createResponse(200, mockPedigree);
    } catch (error) {
      console.error("Error processing request:", error);
      return createResponse(500, { error: "Internal server error" });
    }
  }

  // Handle unsupported methods
  return createResponse(405, { error: "Method not allowed" });
};
