# PetPals Troubleshooting Guide

This guide helps you diagnose and fix common issues with the PetPals application.

## Common Issues and Solutions

### 1. Application Crashes When Clicking Buttons

#### Possible Causes:
- Missing environment variables
- Database connection issues
- Authentication problems
- React state management issues

#### Solutions:

1. **Check Environment Variables**
   - Make sure you have a `.env.local` file in the root directory
   - Copy the required variables from `.env.local.example`
   - Ensure all variables have valid values

2. **Test Database Connection**
   - Run the diagnostic script: `node scripts/diagnose-connection-issues.js`
   - Check if Supabase is accessible and properly configured

3. **Clear Browser Cache and Cookies**
   - This can resolve authentication and state persistence issues

4. **Check Console for Errors**
   - Open browser developer tools (F12) and check the console for specific error messages

### 2. Authentication Issues

#### Possible Causes:
- Invalid Supabase credentials
- Session management problems
- CORS issues

#### Solutions:

1. **Verify Supabase Configuration**
   - Check that your Supabase URL and API keys are correct
   - Ensure your Supabase project is active and running

2. **Test Authentication**
   - Run `node scripts/test-login.js` to verify authentication works

3. **Check CORS Settings**
   - In your Supabase dashboard, ensure your application URL is allowed in CORS settings

### 3. Database Connection Issues

#### Possible Causes:
- Network connectivity problems
- Invalid database credentials
- Missing tables or schema issues

#### Solutions:

1. **Run Database Diagnostics**
   - Execute `node scripts/test-database-connection.js`
   - Check for specific error messages

2. **Verify Database Schema**
   - Run `node scripts/apply-schema.js` to ensure all required tables exist

3. **Check Network Connectivity**
   - Ensure your network allows connections to Supabase

### 4. UI Rendering Issues

#### Possible Causes:
- CSS conflicts
- React component errors
- Missing dependencies

#### Solutions:

1. **Clear Cache and Rebuild**
   - Delete the `.next` folder
   - Run `npm run build` followed by `npm run start`

2. **Check Component Props**
   - Ensure all required props are passed to components
   - Check for null or undefined values

## Running Diagnostics

To run a comprehensive diagnostic check:

```bash
# Install dependencies if needed
npm install

# Run the connection diagnostics
node scripts/diagnose-connection-issues.js

# Test database connection
node scripts/test-database-connection.js

# Test authentication
node scripts/test-login.js
```

## Getting Help

If you continue to experience issues after trying these solutions, please:

1. Gather all error messages from the console
2. Note which specific actions cause the application to crash
3. Document your environment (browser, operating system, Node.js version)
4. Contact support with this information
