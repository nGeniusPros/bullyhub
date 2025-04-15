// Netlify function entry point for Health Clearance Verification
// This redirects to the feature-specific implementation

import { handler as featureHandler } from "../../src/features/health-clearances/functions/health-clearance-verification.js";

export const handler = featureHandler;
