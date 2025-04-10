-- Migration: Add comprehensive health record tables to existing schema

-- Assumes existing tables: dogs, dna_test_results, genetic_markers, health_markers, vaccinations, etc.

-- Extended health record tables
\i '../extended_health_schema.sql'
