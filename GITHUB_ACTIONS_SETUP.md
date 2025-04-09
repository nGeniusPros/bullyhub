# Setting Up GitHub Actions for Netlify Deployment

This guide explains how to set up GitHub Actions for continuous deployment to Netlify.

## Prerequisites

1. A GitHub repository for your Bully Hub project
2. A Netlify account with a site already created
3. Admin access to both GitHub and Netlify

## Step 1: Get Netlify API Credentials

1. Log in to your Netlify account
2. Go to **User Settings** > **Applications** > **Personal access tokens**
3. Click **New access token**
4. Give it a name (e.g., "GitHub Actions Deployment")
5. Copy the generated token (you'll need it for GitHub secrets)

Next, get your Netlify Site ID:

1. Go to your Netlify site dashboard
2. Go to **Site settings** > **General** > **Site details**
3. Copy the **API ID** (this is your Site ID)

## Step 2: Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Click on **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secrets:

   - `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
   - `NETLIFY_SITE_ID`: Your Netlify site ID
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `AYRSHARE_API_KEY`: Your Ayrshare API key (if using social media integration)

## Step 3: GitHub Actions Workflow

A GitHub Actions workflow file has been created at `.github/workflows/netlify-deploy.yml`. This workflow will:

1. Build your Next.js application
2. Deploy to Netlify as a preview for pull requests
3. Deploy to production when changes are pushed to the main branch

The workflow is already configured to use the secrets you added in Step 2.

## Step 4: Test the Workflow

1. Make a small change to your codebase
2. Commit and push the change to GitHub
3. Go to the **Actions** tab in your GitHub repository
4. You should see the workflow running
5. Once completed, check your Netlify site to verify the deployment

## Customizing the Workflow

You can customize the workflow by editing the `.github/workflows/netlify-deploy.yml` file:

- Change the branches that trigger deployments
- Add additional build steps or tests
- Modify environment variables
- Add notifications for successful/failed deployments

## Troubleshooting

If you encounter issues with the GitHub Actions workflow:

1. Check the workflow logs in the GitHub Actions tab
2. Verify that all secrets are correctly set
3. Make sure your Netlify site is properly configured
4. Check that your build process works locally

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started/)
- [Netlify GitHub Actions](https://github.com/netlify/actions)

For more information on Netlify deployment, see the [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) file.
