// Netlify function entry point for Stud Receptionist
// This redirects to the feature-specific implementation

import { createHandler } from "../../src/features/stud-services/functions/stud-receptionist.js";
import { createResponse, handleOptions } from "../utils/cors-headers.js";
import { supabase } from "../utils/supabase-client.js";

// Create the handler with the utility functions
export const handler = createHandler({ createResponse, handleOptions, supabase });
