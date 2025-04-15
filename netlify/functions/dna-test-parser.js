// Netlify function entry point for DNA Test Parser
// This redirects to the feature-specific implementation

import { handler as featureHandler } from "../../src/features/dna-testing/functions/dna-test-parser.js";

export const handler = featureHandler;
