# Netlify Functions for PetPals

This directory contains serverless functions for the PetPals application. These functions handle backend operations that require server-side processing, such as DNA test integration, AI stud receptionist, color prediction, COI calculation, and other breeding-related computations.

## Directory Structure

```
netlify/
└── functions/
    ├── hello-world.js
    ├── dna-test-integration.js
    ├── stud-receptionist.js
    ├── color-prediction.js
    ├── coi-calculator.js
    ├── health-clearance-verification.js
    ├── breeding-program-compatibility.js
    └── social-media-integration.js
```

## Available Functions

### 1. Hello World

A simple test function to verify that serverless functions are working.

**Endpoint:** `/.netlify/functions/hello-world`
**Method:** GET
**Response:** JSON with a greeting message

### 2. DNA Test Integration

Stores DNA test results for dogs in the database.

**Endpoint:** `/.netlify/functions/dna-test-integration`
**Method:** POST
**Request Body:**
```json
{
  "dogId": "123",
  "testType": "color-genetics",
  "testResults": {
    "gene1": "Bb",
    "gene2": "dd",
    "gene3": "Kk"
  }
}
```
**Response:** JSON with confirmation and stored data

### 3. AI Stud Receptionist

Analyzes breeding compatibility and provides stud recommendations.

**Endpoint:** `/.netlify/functions/stud-receptionist`
**Method:** POST
**Request Body:**
```json
{
  "femaleId": "456",
  "message": "Looking for a stud for my female French Bulldog with blue coat",
  "breedingProgramId": "789" // Optional
}
```
**Response:** JSON with AI-generated recommendations

### 4. Color Prediction

Predicts puppy coat colors based on parents' genetics.

**Endpoint:** `/.netlify/functions/color-prediction`
**Method:** POST
**Request Body:**
```json
{
  "sireId": "123",
  "damId": "456"
}
```
**Response:** JSON with color predictions, parent colors, and confidence level

### 5. COI Calculator

Calculates Coefficient of Inbreeding for potential matings.

**Endpoint:** `/.netlify/functions/coi-calculator`
**Method:** POST
**Request Body:**
```json
{
  "sireId": "123",
  "damId": "456",
  "generations": 5 // Optional, defaults to 5
}
```
**Response:** JSON with COI percentage, risk level, and recommendations

### 6. Health Clearance Verification

Verifies health test results and certificates.

**Endpoint:** `/.netlify/functions/health-clearance-verification`
**Method:** GET
**Query Parameters:**
- `verificationNumber`: The verification number to check

**Method:** POST
**Request Body:**
```json
{
  "dogId": "123",
  "test": "Hip Dysplasia",
  "date": "2023-04-15",
  "result": "OFA Good",
  "verificationNumber": "HD-12345",
  "documents": ["https://example.com/document.pdf"] // Optional
}
```
**Response:** JSON with verification status and details

### 7. Breeding Program Compatibility

Checks if a dog meets specific breeding program requirements.

**Endpoint:** `/.netlify/functions/breeding-program-compatibility`
**Method:** POST
**Request Body:**
```json
{
  "dogId": "123",
  "breedingProgramId": "456"
}
```
**Response:** JSON with compatibility assessment and recommendations

### 8. Social Media Integration

Posts to social media platforms using Ayrshare API.

**Endpoint:** `/.netlify/functions/social-media-integration`
**Method:** POST
**Request Body:**
```json
{
  "text": "Check out our new litter of French Bulldog puppies!",
  "platforms": ["facebook", "instagram", "twitter"],
  "mediaUrls": ["https://example.com/image.jpg"], // Optional
  "scheduleDate": "2023-05-01T12:00:00Z", // Optional
  "hashtags": ["frenchbulldog", "puppies"], // Optional
  "userId": "user-123"
}
```

**Method:** GET
**Query Parameters:**
- `postId`: (Optional) The ID of a specific post to retrieve

**Method:** DELETE
**Query Parameters:**
- `postId`: The ID of the post to delete

**Response:** JSON with post status and details

## Development

To develop and test serverless functions locally:

1. Start the Netlify development server:
   ```
   npm run netlify:dev
   ```

2. Access your functions at `http://localhost:8888/.netlify/functions/function-name`

## Adding New Functions

To add a new serverless function:

1. Create a new JavaScript file in the `netlify/functions` directory
2. Export a handler function that takes `event` and `context` parameters
3. Return an object with `statusCode`, `body`, and `headers`

Example:
```javascript
export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Your function response" }),
    headers: { "Content-Type": "application/json" }
  };
}
```

## Environment Variables

The following environment variables are used by these functions:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `OPENAI_API_KEY`: OpenAI API key (for AI-powered functions)
- `AYRSHARE_API_KEY`: Ayrshare API key (for social media integration)

Make sure these are set in your Netlify environment variables or in your local `.env` file for development.

## Testing

You can test these functions using the test component at `/dashboard/serverless-functions` in the application.

For more information, refer to the [Netlify Functions documentation](https://docs.netlify.com/functions/overview/) and the [NETLIFY_FUNCTIONS.md](../NETLIFY_FUNCTIONS.md) file in the root directory.
