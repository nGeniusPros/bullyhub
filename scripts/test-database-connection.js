import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || !serviceRoleKey) {
  console.error("Missing Supabase URL, API key, or service role key");
  process.exit(1);
}

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key available:", !!supabaseKey);
console.log("Service Role Key available:", !!serviceRoleKey);

// Create Supabase client with anonymous key (limited permissions)
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Supabase admin client with service role key (full permissions)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function testConnection() {
  try {
    console.log("\n=== TESTING SUPABASE CONNECTION ===\n");

    // Test 1: Basic connection
    console.log("1. Testing basic connection...");
    const { data: tableData, error: tableError } = await supabaseAdmin
      .from("pg_tables")
      .select("tablename")
      .eq("schemaname", "public")
      .limit(10);

    if (tableError) {
      console.error("Error fetching tables:", tableError);
    } else {
      console.log("✅ Connection successful!");
      console.log(
        "Tables in public schema:",
        tableData.map((t) => t.tablename).join(", ")
      );
    }

    // Test 2: Authentication
    console.log("\n2. Testing authentication...");
    console.log(
      "Note: Using test credentials - authentication errors are expected and can be ignored"
    );
    console.log("This is just to verify the auth endpoints are accessible");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: "test@example.com",
          password: "password123",
        });

      if (authError) {
        console.log(
          "Authentication result: ❌ Failed (this is normal with test credentials)"
        );
        console.log("Error type:", authError.name);
        // Don't show the full error as it's expected and can be confusing
      } else {
        console.log("✅ Authentication successful!");
        console.log("User:", authData.user?.email);
        console.log("Session:", !!authData.session);

        // Test 3: RLS Policies (Row Level Security)
        console.log("\n3. Testing RLS policies with authenticated user...");

        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user?.id)
          .single();

        if (profileError) {
          console.log("Profile fetch result: ❌ Failed");
          console.log("Error type:", profileError.name);
        } else {
          console.log("✅ Profile data retrieved successfully!");
          console.log("Profile:", profileData);
        }
      }
    } catch (e) {
      console.log("Authentication test encountered an unexpected error");
      console.log("This might indicate network or configuration issues");
    }

    // Test 4: Database schema
    console.log("\n4. Checking database schema...");
    const { data: schemaData, error: schemaError } = await supabaseAdmin
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .order("table_name");

    if (schemaError) {
      console.error("Error fetching schema:", schemaError);
    } else {
      console.log("✅ Schema retrieved successfully!");
      console.log("Tables:");
      schemaData.forEach((table) => {
        console.log(`- ${table.table_name}`);
      });
    }

    // Test 5: Test a specific table (dogs)
    console.log("\n5. Testing dogs table...");
    const { data: dogsData, error: dogsError } = await supabaseAdmin
      .from("dogs")
      .select("*")
      .limit(5);

    if (dogsError) {
      console.error("Error fetching dogs:", dogsError);
      if (dogsError.code === "42P01") {
        console.log(
          "Note: The dogs table does not exist yet. You may need to run the schema.sql script."
        );
      }
    } else {
      console.log("✅ Dogs table query successful!");
      console.log(`Found ${dogsData.length} dogs:`);
      dogsData.forEach((dog) => {
        console.log(`- ${dog.name} (${dog.breed})`);
      });
    }

    console.log("\n=== DATABASE CONNECTION TESTS COMPLETE ===\n");
  } catch (error) {
    console.error("Unexpected error during testing:", error);
  }
}

testConnection();
