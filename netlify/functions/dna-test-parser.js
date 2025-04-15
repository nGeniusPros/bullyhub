// Netlify function entry point for DNA Test Parser
// This redirects to the feature-specific implementation

import { createHandler } from "../../src/features/dna-testing/functions/dna-test-parser.js";
import { createResponse, handleOptions } from "../utils/cors-headers.js";
import { supabase } from "../utils/supabase-client.js";

// Create the handler with the utility functions
export const handler = createHandler({ createResponse, handleOptions, supabase });
