# Deploying Bully Hub to Netlify

This guide explains how to deploy Bully Hub to Netlify, including setting up serverless functions and environment variables.

## Prerequisites

Before deploying to Netlify, make sure you have:

1. A Netlify account
2. The Netlify CLI installed: `npm install -g netlify-cli`
3. Required environment variables (see [NETLIFY_ENV_SETUP.md](./NETLIFY_ENV_SETUP.md))

## Deployment Steps

### 1. Install Dependencies

Make sure all dependencies are installed:

```bash
npm install
```

### 2. Set Up Environment Variables

Set up your environment variables as described in [NETLIFY_ENV_SETUP.md](./NETLIFY_ENV_SETUP.md).

### 3. Deploy to Netlify

#### Option 1: Using the Deployment Script

We've created a deployment script to simplify the process:

For a draft deployment (preview URL):
```bash
npm run netlify:deploy
```

For a production deployment:
```bash
npm run netlify:deploy:prod
```

#### Option 2: Manual Deployment

If you prefer to deploy manually:

For a draft deployment:
```bash
netlify deploy
```

For a production deployment:
```bash
netlify deploy --prod
```

## Serverless Functions

Bully Hub uses Netlify serverless functions for backend operations. These functions are located in the `netlify/functions` directory.

### Available Functions

- `hello-world.js`: A simple test function
- `dna-test-integration.js`: Stores DNA test results
- `stud-receptionist.js`: AI-powered stud recommendations
- `color-prediction.js`: Predicts puppy coat colors
- `coi-calculator.js`: Calculates Coefficient of Inbreeding
- `health-clearance-verification.js`: Verifies health clearances
- `breeding-program-compatibility.js`: Checks breeding program compatibility
- `social-media-integration.js`: Integrates with social media platforms

### Testing Functions

You can test the functions using the built-in test components:

1. Deploy the site to Netlify
2. Navigate to `/dashboard/netlify-functions` to test basic functions
3. Navigate to `/dashboard/serverless-functions` to test advanced functions

## Continuous Deployment

To set up continuous deployment:

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions`
3. Set up your environment variables in the Netlify dashboard

## Troubleshooting

If you encounter issues with deployment:

- Check the Netlify build logs for errors
- Verify that all environment variables are set correctly
- Make sure the Netlify CLI is installed and up to date
- Check that the `netlify.toml` file is configured correctly

For more information, see the [Netlify documentation](https://docs.netlify.com/) or the [Next.js on Netlify documentation](https://docs.netlify.com/integrations/frameworks/next-js/overview/).

## Local Development

To develop and test locally:

```bash
npm run netlify:dev
```

This will start the Netlify development server, which includes both the Next.js application and the serverless functions.
