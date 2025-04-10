const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    const dogId = event.queryStringParameters?.dog_id || null;

    if (!dogId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing dog_id" }),
      };
    }

    const { data, error } = await supabase
      .from("vaccinations")
      .select("*")
      .eq("dog_id", dogId)
      .order("date_administered", { ascending: false });

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
