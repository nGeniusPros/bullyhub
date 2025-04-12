// netlify/functions/financial-management.js
import { supabase } from "../utils/supabase-client.js";
import { createResponse, handleOptions } from "../utils/cors-headers.js";

export async function handler(event, context) {
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  // Extract user ID from authorization header if present
  let userId = null;
  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error) {
        console.error("Error verifying token:", error);
      } else if (user) {
        userId = user.id;
      }
    }
  } catch (error) {
    console.error("Error processing authentication:", error);
  }

  // GET - Fetch financial records with optional filtering
  if (event.httpMethod === "GET") {
    try {
      // Parse query parameters
      const params = event.queryStringParameters || {};
      const {
        breeder_id,
        record_type,
        start_date,
        end_date,
        category,
        related_dog_id,
        related_client_id,
        limit = 100,
        offset = 0,
      } = params;

      // Start building the query
      let query = supabase.from("financial_records").select("*");

      // Apply filters if provided
      if (breeder_id) {
        query = query.eq("breeder_id", breeder_id);
      } else if (userId) {
        // If no breeder_id is specified but we have a userId, filter by the authenticated user
        query = query.eq("breeder_id", userId);
      }

      if (record_type) {
        query = query.eq("record_type", record_type);
      }

      if (start_date) {
        query = query.gte("date", start_date);
      }

      if (end_date) {
        query = query.lte("date", end_date);
      }

      if (category) {
        query = query.eq("category", category);
      }

      if (related_dog_id) {
        query = query.eq("related_dog_id", related_dog_id);
      }

      if (related_client_id) {
        query = query.eq("related_client_id", related_client_id);
      }

      // Order by date, most recent first
      query = query.order("date", { ascending: false });

      // Apply pagination
      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      // Execute the query
      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching financial records:", error);
        return createResponse(500, {
          error: "Failed to fetch financial records",
        });
      }

      return createResponse(200, {
        records: data,
        pagination: {
          total: count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  // POST - Create a new financial record
  if (event.httpMethod === "POST") {
    try {
      const recordData = JSON.parse(event.body);

      // If userId is available and no breeder_id is provided, set it
      if (userId && !recordData.breeder_id) {
        recordData.breeder_id = userId;
      }

      // Validate required fields
      const requiredFields = ["breeder_id", "record_type", "category", "amount", "date"];
      const missingFields = requiredFields.filter(field => !recordData[field]);

      if (missingFields.length > 0) {
        return createResponse(400, {
          error: `Missing required fields: ${missingFields.join(", ")}`
        });
      }

      // Insert the record
      const { data, error } = await supabase
        .from("financial_records")
        .insert([recordData])
        .select();

      if (error) {
        console.error("Error creating financial record:", error);
        return createResponse(500, {
          error: "Failed to create financial record",
        });
      }

      return createResponse(201, { record: data[0] });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  // PUT - Update an existing financial record
  if (event.httpMethod === "PUT") {
    try {
      const { id, ...updates } = JSON.parse(event.body);

      if (!id) {
        return createResponse(400, { error: "Missing record ID" });
      }

      // Build the query
      let query = supabase.from("financial_records").update(updates).eq("id", id);

      // If userId is available, ensure the user can only update their own records
      if (userId) {
        query = query.eq("breeder_id", userId);
      }

      const { data, error } = await query.select();

      if (error) {
        console.error("Error updating financial record:", error);
        return createResponse(500, {
          error: "Failed to update financial record",
        });
      }

      if (!data || data.length === 0) {
        return createResponse(404, { error: "Record not found or you don't have permission to update it" });
      }

      return createResponse(200, { record: data[0] });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  // DELETE - Delete a financial record
  if (event.httpMethod === "DELETE") {
    try {
      const { id } = event.queryStringParameters || {};

      if (!id) {
        return createResponse(400, { error: "Missing record ID" });
      }

      // Build the query
      let query = supabase.from("financial_records").delete().eq("id", id);

      // If userId is available, ensure the user can only delete their own records
      if (userId) {
        query = query.eq("breeder_id", userId);
      }

      const { error } = await query;

      if (error) {
        console.error("Error deleting financial record:", error);
        return createResponse(500, {
          error: "Failed to delete financial record",
        });
      }

      return createResponse(200, { success: true, message: "Record deleted successfully" });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  // If we get here, the HTTP method is not supported
  return createResponse(405, { error: "Method Not Allowed" });
}
