// netlify/functions/kennel-marketplace.js
import { supabase } from "../utils/supabase-client.js";
import { createResponse, handleOptions } from "../utils/cors-headers.js";

export async function handler(event, context) {
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (event.httpMethod === "GET") {
    try {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select("*");
      if (error) {
        console.error("Error fetching marketplace listings:", error);
        return createResponse(500, {
          error: "Failed to fetch marketplace listings",
        });
      }
      return createResponse(200, { listings: data });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const listingData = JSON.parse(event.body);
      const { data, error } = await supabase
        .from("marketplace_listings")
        .insert([listingData]);
      if (error) {
        console.error("Error creating marketplace listing:", error);
        return createResponse(500, {
          error: "Failed to create marketplace listing",
        });
      }
      return createResponse(201, { listing: data[0] });
    } catch (error) {
      console.error("Unexpected error:", error);
      return createResponse(500, { error: "Internal Server Error" });
    }
  }

  return createResponse(405, { error: "Method Not Allowed" });
}
