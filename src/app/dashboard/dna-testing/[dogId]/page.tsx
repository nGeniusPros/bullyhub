import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DNATestForm from "@/features/dna-testing/components/DNATestForm";
import DNAResultsView from "@/features/dna-testing/components/DNAResultsView";

// Generate metadata dynamically
export async function generateMetadata({ params }: { params: { dogId: string } }) {
  const supabase = createServerSupabaseClient();

  // Fetch dog information
  const { data: dog } = await supabase
    .from("dogs")
    .select("name")
    .eq("id", params.dogId)
    .single();

  if (!dog) {
    return {
      title: "DNA Testing - PetPals",
      description: "Manage and analyze DNA test results for your dogs",
    };
  }

  return {
    title: `DNA Testing for ${dog.name} - PetPals`,
    description: `Manage and analyze DNA test results for ${dog.name}`,
  };
}

// Loading component
function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-64 mt-4" />
    </div>
  );
}

// Server component to fetch dog data
async function DogDNAManager({ dogId }: { dogId: string }) {
  const supabase = createServerSupabaseClient();

  // Fetch dog information
  const { data: dog, error } = await supabase
    .from("dogs")
    .select("id, name, breed, color, owner_id")
    .eq("id", dogId)
    .single();

  if (error || !dog) {
    notFound();
  }

  // Verify the current user owns this dog
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== dog.owner_id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to view this dog's DNA tests
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">DNA Testing for {dog.name}</h2>
        <p className="text-muted-foreground">
          {dog.breed} • {dog.color}
        </p>
      </div>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="submit">Submit New Test</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <DNAResultsView dogId={dogId} />
        </TabsContent>

        <TabsContent value="submit">
          <DNATestForm dogId={dogId} />
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>DNA Analysis</CardTitle>
              <CardDescription>
                Advanced analysis of DNA test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This feature will provide AI-powered analysis of your dog's DNA test results,
                including health insights, breeding recommendations, and more.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main page component
export default function DogDNATestingPage({ params }: { params: { dogId: string } }) {
  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingState />}>
        <DogDNAManager dogId={params.dogId} />
      </Suspense>
    </DashboardLayout>
  );
}
