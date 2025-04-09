import MainLayout from '@/components/layout/MainLayout';
import DatabaseConnectionTest from '@/components/DatabaseConnectionTest';

export default function DatabaseTestPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
        <p className="mb-8 text-muted-foreground">
          This page tests the connection to the Supabase database and displays the current status.
        </p>
        
        <DatabaseConnectionTest />
        
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">Database Information</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Supabase Configuration</h3>
            <ul className="space-y-2">
              <li><strong>Provider:</strong> Supabase</li>
              <li><strong>Connection Method:</strong> REST API via supabase-js client</li>
              <li><strong>Authentication:</strong> JWT-based with Row Level Security (RLS)</li>
              <li><strong>Environment Variables:</strong> 
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>SUPABASE_SERVICE_ROLE_KEY (for admin operations)</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Database Schema</h3>
            <p className="mb-4">The Bully Hub database includes the following main tables:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>profiles - User profiles with role information</li>
              <li>dogs - Dog information including breed, color, and owner</li>
              <li>dna_test_results - DNA test results for dogs</li>
              <li>genetic_markers - Genetic marker information from DNA tests</li>
              <li>health_markers - Health-related genetic markers</li>
              <li>breeding_programs - Breeding program information</li>
              <li>stud_services - Stud service offerings</li>
              <li>litters - Litter information</li>
              <li>puppies - Puppy information linked to litters</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Testing Tools</h3>
            <p className="mb-2">The following scripts are available for testing the database connection:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><code>scripts/test-supabase-connection.js</code> - Basic connection test</li>
              <li><code>scripts/test-database-connection.js</code> - Comprehensive connection test</li>
              <li><code>scripts/test-database-crud.js</code> - Tests CRUD operations</li>
              <li><code>scripts/test-login.js</code> - Tests authentication</li>
              <li><code>scripts/create-test-user.js</code> - Creates a test user</li>
              <li><code>scripts/apply-schema.js</code> - Applies the database schema</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Run these scripts with Node.js from the project root directory.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
