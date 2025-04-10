-- Function: exec_sql(query text)
-- WARNING: This function allows execution of arbitrary SQL and should be used with caution.
-- Create this function manually in Supabase SQL Editor before running apply-schema.js

CREATE OR REPLACE FUNCTION public.exec_sql(query text)
RETURNS void AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
