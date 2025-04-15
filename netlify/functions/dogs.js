// Netlify Function Entry Point for Dogs API
import { createHandler } from "../../src/features/dogs/functions/dogs.js";
import { createResponse, handleOptions } from "../utils/cors-headers.js";
import { supabase } from "../utils/supabase-client.js";

// Create the handler with the utility functions
export const handler = createHandler({ createResponse, handleOptions, supabase });
