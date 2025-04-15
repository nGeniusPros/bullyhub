// Dogs Feature - Dog Upload Image API Function
import busboy from "busboy";
import { Buffer } from "buffer";

/**
 * Handle requests for uploading a dog's image
 *
 * POST: Upload an image for a dog
 */
export const createHandler = ({ createResponse, handleOptions, supabase }) => async (event, context) => {
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

  // Handle POST request
  if (event.httpMethod === "POST") {
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

      // Parse the multipart form data
      const formData = await parseMultipartForm(event);

      if (!formData.file) {
        return createResponse(400, { error: "No file uploaded" });
      }

      // Upload the file to storage
      const fileName = `${Date.now()}-${formData.filename}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('dog-images')
        .upload(`${dogId}/${fileName}`, formData.file, {
          contentType: formData.contentType,
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error("Error uploading dog image:", uploadError);
        return createResponse(500, { error: "Failed to upload dog image" });
      }

      // Get the public URL
      const { data: urlData } = supabase
        .storage
        .from('dog-images')
        .getPublicUrl(uploadData.path);

      // Update the dog with the new image URL
      const { error: updateError } = await supabase
        .from("dogs")
        .update({ profile_image_url: urlData.publicUrl })
        .eq("id", dogId);

      if (updateError) {
        console.error("Error updating dog with image URL:", updateError);
        return createResponse(500, { error: "Failed to update dog with image URL" });
      }

      return createResponse(200, {
        message: "Image uploaded successfully",
        imageUrl: urlData.publicUrl
      });
    } catch (error) {
      console.error("Error processing request:", error);
      return createResponse(500, { error: "Internal server error" });
    }
  }

  // Handle unsupported methods
  return createResponse(405, { error: "Method not allowed" });
};

/**
 * Parse multipart form data
 * @param {Object} event - The Netlify function event
 * @returns {Promise<Object>} - The parsed form data
 */
async function parseMultipartForm(event) {
  return new Promise((resolve, reject) => {
    const formData = {
      fields: {},
      file: null,
      filename: '',
      contentType: ''
    };

    const bb = busboy({ headers: event.headers });

    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      formData.filename = filename;
      formData.contentType = mimeType;

      const chunks = [];
      file.on('data', (data) => {
        chunks.push(data);
      });

      file.on('end', () => {
        formData.file = Buffer.concat(chunks);
      });
    });

    bb.on('field', (name, val) => {
      formData.fields[name] = val;
    });

    bb.on('finish', () => {
      resolve(formData);
    });

    bb.on('error', (error) => {
      reject(error);
    });

    bb.write(event.body);
    bb.end();
  });
}
