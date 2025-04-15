// Netlify Function Entry Point for Dog Pedigree API
import { createHandler } from "../../src/features/dogs/functions/dog-pedigree.js";
import { createResponse, handleOptions } from "../utils/cors-headers.js";
import { supabase } from "../utils/supabase-client.js";

// Create the handler with the utility functions
export const handler = createHandler({ createResponse, handleOptions, supabase });
