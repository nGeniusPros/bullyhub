# Netlify Serverless Functions for Bully Hub

This document provides information on how to use and deploy the Netlify serverless functions implemented in the Bully Hub project.

## Overview

Bully Hub uses Netlify serverless functions to handle backend operations that require server-side processing, such as:

- DNA test integration
- AI stud receptionist
- Color prediction
- COI calculation
- Other breeding-related computations

## Directory Structure

```
bullyhub/
├── netlify/
│   └── functions/
│       ├── hello-world.js
│       ├── dna-test-integration.js
│       └── stud-receptionist.js
└── netlify.toml
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

## Local Development

To develop and test serverless functions locally:

1. Install dependencies:
   ```
   npm install
   ```

2. Start the Netlify development server:
   ```
   npm run netlify:dev
   ```

3. Access your functions at `http://localhost:8888/.netlify/functions/function-name`

## Environment Variables

Ensure these environment variables are set in your Netlify dashboard and in your local `.env.local` file:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `OPENAI_API_KEY`: Your OpenAI API key for AI features

## Deployment

To deploy your functions to Netlify:

1. For a preview deployment:
   ```
   npm run netlify:deploy
   ```

2. For production deployment:
   ```
   npm run netlify:deploy:prod
   ```

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

## Troubleshooting

- **Function not found**: Ensure the function file is in the correct directory and the name matches the URL path
- **CORS issues**: Add appropriate headers to your function response
- **Environment variables not working**: Verify they are set in both Netlify dashboard and local .env file
- **Build errors**: Check the Netlify build logs for specific error messages

For more information, refer to the [Netlify Functions documentation](https://docs.netlify.com/functions/overview/).
