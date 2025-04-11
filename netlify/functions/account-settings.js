// netlify/functions/account-settings.js
import { supabase } from "../utils/supabase-client.js";
import { createResponse, handleOptions } from "../utils/cors-headers.js";

export async function handler(event, context) {
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (event.httpMethod === "GET") {
    try {
      const { data, error } = await supabase.from("user_settings").select("*");
      if (error) {
        console.error("Error fetching user settings:", error);
        return createResponse(500, { error: "Failed to fetch user settings" });
      }
      return createResponse(200, { settings: data });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const settingsData = JSON.parse(event.body);
      const { data, error } = await supabase
        .from("user_settings")
        .insert([settingsData]);
      if (error) {
        console.error("Error saving user settings:", error);
        return createResponse(500, { error: "Failed to save user settings" });
      }
      return createResponse(201, { settings: data[0] });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  return createResponse(405, { error: "Method Not Allowed" });
}
