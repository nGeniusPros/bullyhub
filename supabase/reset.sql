-- Reset everything
-- Drop all tables
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all tables in reverse dependency order
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Drop all functions
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all functions in public schema
    FOR r IN (SELECT proname, oid FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || quote_ident(r.proname) || ' CASCADE';
    END LOOP;
END $$;

-- Drop all types
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all types in public schema
    FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;
END $$;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('breeder', 'petOwner');
CREATE TYPE dna_provider AS ENUM ('AnimalGenetics', 'Embark', 'Other');
CREATE TYPE health_status AS ENUM ('Clear', 'Carrier', 'At Risk');
CREATE TYPE risk_level AS ENUM ('Low', 'Medium', 'High');

-- Create tables
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    role user_role NOT NULL DEFAULT 'petOwner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE dogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    breed TEXT NOT NULL,
    date_of_birth DATE,
    color TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    is_stud BOOLEAN DEFAULT FALSE,
    breeding_program_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test user
INSERT INTO auth.users (id, email, email_confirmed_at, raw_app_meta_data)
VALUES (
    uuid_generate_v4(),
    'test@example.com',
    NOW(),
    '{"provider": "email"}'::jsonb
);
