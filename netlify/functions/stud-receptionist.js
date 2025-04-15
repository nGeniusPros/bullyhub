// Netlify function entry point for Stud Receptionist
// This redirects to the feature-specific implementation

import { handler as featureHandler } from "../../src/features/stud-services/functions/stud-receptionist.js";

export const handler = featureHandler;
