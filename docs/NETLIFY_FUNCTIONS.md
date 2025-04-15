# Netlify Functions in PetPals

This document describes how Netlify Functions are organized and implemented in the PetPals application using the Vertical Slice Architecture.

## Overview

Netlify Functions are serverless functions that run in response to HTTP requests. In PetPals, we use Netlify Functions to implement our API endpoints.

With our Vertical Slice Architecture, each feature has its own set of Netlify Functions, located in the feature's `functions/` directory. These functions are then exposed through thin wrappers in the `netlify/functions/` directory.

## Directory Structure

```
netlify/
└── functions/
    ├── dog-by-id.js              # Wrapper for src/features/dogs/functions/dog-by-id.js
    ├── dog-pedigree.js           # Wrapper for src/features/dogs/functions/dog-pedigree.js
    ├── dog-upload-image.js       # Wrapper for src/features/dogs/functions/dog-upload-image.js
    ├── dna-test-parser.js        # Wrapper for src/features/dna-testing/functions/dna-test-parser.js
    ├── get-dna-data.js           # Wrapper for src/features/dna-testing/functions/get-dna-data.js
    ├── health-clearance-verification.js # Wrapper for src/features/health-clearances/functions/health-clearance-verification.js
    ├── stud-receptionist.js      # Wrapper for src/features/stud-services/functions/stud-receptionist.js
    └── utils/
        ├── cors-headers.js       # CORS utilities
        └── supabase-client.js    # Supabase client initialization
```

## Implementation Pattern

Each Netlify Function follows this pattern:

1. The actual implementation is in the feature's `functions/` directory.
2. The implementation exports a `createHandler` function that accepts dependencies.
3. The Netlify Function wrapper imports the `createHandler` function and provides the dependencies.

### Example: Feature Implementation

```javascript
// src/features/dogs/functions/dog-by-id.js

/**
 * Handle requests for a specific dog
 * 
 * GET: Get a dog by ID
 * PUT: Update a dog
 * DELETE: Delete a dog
 */
export const createHandler = ({ createResponse, handleOptions, supabase }) => async (event, context) => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  const dogId = event.path.split("/").pop();

  if (!dogId) {
    return createResponse(400, { error: "Dog ID is required" });
  }

  // Handle different HTTP methods
  switch (event.httpMethod) {
    case "GET":
      return await getDog(dogId, { createResponse, supabase });
    case "PUT":
      return await updateDog(dogId, event, { createResponse, supabase });
    case "DELETE":
      return await deleteDog(dogId, { createResponse, supabase });
    default:
      return createResponse(405, { error: "Method not allowed" });
  }
};

// Helper functions
async function getDog(dogId, { createResponse, supabase }) {
  // Implementation...
}

async function updateDog(dogId, event, { createResponse, supabase }) {
  // Implementation...
}

async function deleteDog(dogId, { createResponse, supabase }) {
  // Implementation...
}
```

### Example: Netlify Function Wrapper

```javascript
// netlify/functions/dog-by-id.js

// Netlify Function Entry Point for Dog By ID API
import { createHandler } from "../../src/features/dogs/functions/dog-by-id.js";
import { createResponse, handleOptions } from "../utils/cors-headers.js";
import { supabase } from "../utils/supabase-client.js";

// Create the handler with the utility functions
export const handler = createHandler({ createResponse, handleOptions, supabase });
```

## Benefits of This Approach

1. **Dependency Injection**: The feature implementation doesn't directly depend on specific implementations of utilities like CORS handling or database access. This makes it easier to test and maintain.

2. **Separation of Concerns**: The feature implementation focuses on the business logic, while the Netlify Function wrapper handles the infrastructure concerns.

3. **Testability**: The feature implementation can be tested in isolation, without needing to mock Netlify-specific functionality.

4. **Reusability**: The feature implementation can be reused in different contexts, such as in a different serverless platform or in a server-side rendering context.

## API Routes

The Netlify Functions are exposed as API routes through the `netlify.toml` configuration file:

```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# Feature-specific redirects
[[redirects]]
  from = "/api/dogs/:id"
  to = "/.netlify/functions/dog-by-id/:id"
  status = 200

[[redirects]]
  from = "/api/dogs/:id/pedigree"
  to = "/.netlify/functions/dog-pedigree/:id"
  status = 200

# More redirects...
```

## Testing Netlify Functions

To test Netlify Functions locally:

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Run the development server: `netlify dev`
3. Access the functions at `http://localhost:8888/.netlify/functions/function-name`

For unit testing, you can test the feature implementation directly:

```javascript
// src/features/dogs/__tests__/dog-by-id.test.js

import { createHandler } from "../functions/dog-by-id.js";

describe("dog-by-id", () => {
  // Mock dependencies
  const createResponse = jest.fn();
  const handleOptions = jest.fn();
  const supabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };

  // Create the handler with mock dependencies
  const handler = createHandler({ createResponse, handleOptions, supabase });

  // Test cases...
});
```

## Conclusion

This approach to organizing Netlify Functions aligns with our Vertical Slice Architecture, keeping feature-specific code together while providing a clean separation of concerns between business logic and infrastructure concerns.
