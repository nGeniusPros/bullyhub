-- Create function to drop all tables
CREATE OR REPLACE FUNCTION drop_all_tables()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Drop all tables in reverse dependency order
    EXECUTE (
        SELECT string_agg(
            'DROP TABLE IF EXISTS ' || quote_ident(schemaname) || '.' || quote_ident(tablename) || ' CASCADE;',
            E'\n'
        )
        FROM pg_tables
        WHERE schemaname = 'public'
    );
END;
$$;
