# PetPals Scripts

This directory contains utility scripts for the PetPals application.

## Database Initialization

The `init-database.js` script initializes the database by executing SQL schema files from each feature.

### Prerequisites

- Node.js installed
- Supabase project set up
- `.env` file with the following variables:
  - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
  - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (admin access)

### Usage

1. Make sure you have the required environment variables set in your `.env` file.
2. Run the script:

```bash
# Install dependencies if needed
npm install dotenv @supabase/supabase-js

# Make the script executable (Unix/Linux/macOS)
chmod +x scripts/init-database.js

# Run the script
node scripts/init-database.js
```

### What it does

The script:

1. Scans the `src/features` directory for feature folders
2. Looks for `data/schema.sql` files in each feature folder
3. Executes the SQL statements in each schema file against your Supabase database
4. Reports success or failure for each feature

### Notes

- This script requires the `exec_sql` RPC function to be enabled in your Supabase project
- You may need to create this function in the SQL editor:

```sql
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- The script uses the service role key which has admin privileges, so be careful when running it
- It's recommended to run this script only in development environments or during initial setup
