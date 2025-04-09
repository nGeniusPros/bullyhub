# Setting Up Environment Variables in Netlify for Bully Hub

This guide explains how to set up the required environment variables for deploying Bully Hub to Netlify.

## Required Environment Variables

The following environment variables are required for Bully Hub to function properly:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `OPENAI_API_KEY` | Your OpenAI API key for AI features |
| `AYRSHARE_API_KEY` | Your Ayrshare API key for social media integration (optional) |

## Setting Up Environment Variables in Netlify

### Method 1: Using the Netlify Dashboard

1. Log in to your Netlify account and navigate to your site dashboard
2. Click on **Site settings**
3. In the left sidebar, click on **Environment variables**
4. Click on **Add a variable**
5. Enter the variable name and value
6. Repeat for each required variable
7. Deploy your site again to apply the changes

### Method 2: Using the Netlify CLI

1. Make sure you have the Netlify CLI installed and are logged in
2. Run the following commands to set each environment variable:

```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your-supabase-url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-supabase-anon-key"
netlify env:set OPENAI_API_KEY "your-openai-api-key"
netlify env:set AYRSHARE_API_KEY "your-ayrshare-api-key"
```

3. Deploy your site again to apply the changes

### Method 3: Using a .env File During Deployment

1. Create a `.env` file in your project root with your environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
AYRSHARE_API_KEY=your-ayrshare-api-key
```

2. Use the `--env` flag when deploying with the Netlify CLI:

```bash
netlify deploy --env
```

## Verifying Environment Variables

To verify that your environment variables are set correctly:

1. Go to your Netlify site dashboard
2. Click on **Functions**
3. Test the "hello-world" function
4. If it works, your environment is set up correctly

## Troubleshooting

If you encounter issues with environment variables:

- Make sure you've spelled the variable names correctly
- Check that the values are correct and properly formatted
- Redeploy your site after making changes to environment variables
- Check the function logs in the Netlify dashboard for any errors

## Environment Variables in Local Development

For local development, create a `.env.local` file in your project root with the same environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
AYRSHARE_API_KEY=your-ayrshare-api-key
```

Then run the development server:

```bash
npm run netlify:dev
```

This will start the Netlify development server with your environment variables loaded.
