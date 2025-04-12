// Import the supabase client from the utility file
const { supabase } = require("./utils/supabase-client.js");

exports.handler = async (event) => {
  try {
    // TODO: Extract user ID from JWT or session
    // For now, use a placeholder user ID for testing
    const userId = event.queryStringParameters?.user_id || null;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing user_id" }),
      };
    }

    const { data, error } = await supabase
      .from("dogs")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unexpected error" }),
    };
  }
};
