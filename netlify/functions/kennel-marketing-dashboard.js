// netlify/functions/kennel-marketing-dashboard.js
import { supabase } from "../utils/supabase-client.js";
import { createResponse, handleOptions } from "../utils/cors-headers.js";

export async function handler(event, context) {
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (event.httpMethod === "GET") {
    try {
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .select("*");
      if (error) {
        console.error("Error fetching marketing campaigns:", error);
        return createResponse(500, {
          error: "Failed to fetch marketing campaigns",
        });
      }
      return createResponse(200, { campaigns: data });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const campaignData = JSON.parse(event.body);
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .insert([campaignData]);
      if (error) {
        console.error("Error creating marketing campaign:", error);
        return createResponse(500, {
          error: "Failed to create marketing campaign",
        });
      }
      return createResponse(201, { campaign: data[0] });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  return createResponse(405, { error: "Method Not Allowed" });
}
