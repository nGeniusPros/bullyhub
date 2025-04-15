// Netlify function entry point for Get DNA Data
// This redirects to the feature-specific implementation

import { handler as featureHandler } from "../../src/features/dna-testing/functions/get-dna-data.js";

export const handler = featureHandler;
