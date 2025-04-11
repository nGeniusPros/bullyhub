// netlify/functions/financial-management.js
import { supabase } from "../utils/supabase-client.js";
import { createResponse, handleOptions } from "../utils/cors-headers.js";

export async function handler(event, context) {
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (event.httpMethod === "GET") {
    try {
      const { data, error } = await supabase
        .from("financial_records")
        .select("*");
      if (error) {
        console.error("Error fetching financial records:", error);
        return createResponse(500, {
          error: "Failed to fetch financial records",
        });
      }
      return createResponse(200, { records: data });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const recordData = JSON.parse(event.body);
      const { data, error } = await supabase
        .from("financial_records")
        .insert([recordData]);
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

  return createResponse(405, { error: "Method Not Allowed" });
}
