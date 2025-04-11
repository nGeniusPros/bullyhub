// netlify/functions/client-management.js
import { supabase } from "../utils/supabase-client.js";
import { createResponse, handleOptions } from "../utils/cors-headers.js";

export async function handler(event, context) {
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (event.httpMethod === "GET") {
    try {
      const { data, error } = await supabase.from("clients").select("*");
      if (error) {
        console.error("Error fetching clients:", error);
        return createResponse(500, { error: "Failed to fetch clients" });
      }
      return createResponse(200, { clients: data });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const clientData = JSON.parse(event.body);
      const { data, error } = await supabase
        .from("clients")
        .insert([clientData]);
      if (error) {
        console.error("Error creating client:", error);
        return createResponse(500, { error: "Failed to create client" });
      }
      return createResponse(201, { client: data[0] });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  return createResponse(405, { error: "Method Not Allowed" });
}
