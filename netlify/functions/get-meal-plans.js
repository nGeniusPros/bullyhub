const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  try {
    const userId = event.queryStringParameters?.user_id || null;
    const dogId = event.queryStringParameters?.dogId || null;

    if (!userId || !dogId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing user_id or dogId" }),
      };
    }

    const { data, error } = await supabase
      .from("meal_plans")
      .select("*")
      .eq("dog_id", dogId)
      .order("start_date", { ascending: false });

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
