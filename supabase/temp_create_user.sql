-- Temporarily disable trigger to avoid insert error
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- Create user via RPC (requires exec_sql function)
-- Alternatively, create via Admin API after running this script

-- After user is created, insert profile manually:
-- Replace <USER_ID> with the actual user UUID after creation
-- INSERT INTO profiles (id, first_name, last_name, role)
-- VALUES ('<USER_ID>', 'Test', 'User', 'petOwner');

-- Re-enable trigger after manual insert
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
