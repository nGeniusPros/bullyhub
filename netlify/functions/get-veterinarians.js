import { supabase } from "../utils/supabase-client.js";

export async function handler(event, context) {
  try {
    const params = new URLSearchParams(
      event.rawQuery || event.queryStringParameters,
    );
    const userId = params.get("user_id");

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing user_id parameter" }),
      };
    }

    const { data, error } = await supabase
      .from("veterinarians")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching veterinarians:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch veterinarians" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error in get-veterinarians function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}
