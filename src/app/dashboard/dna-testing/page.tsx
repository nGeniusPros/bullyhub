"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DNATestForm from "@/features/dna-testing/components/DNATestForm";
import DNAResultsView from "@/features/dna-testing/components/DNAResultsView";
import { createClient } from "@/lib/supabase-browser";

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

// Client component to fetch dogs
function DogSelector() {
  const router = useRouter();
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDogs() {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch dogs owned by the user
      const { data: dogs } = await supabase
        .from("dogs")
        .select("id, name")
        .eq("owner_id", user.id);

      setDogs(dogs || []);
      setLoading(false);
    }

    fetchDogs();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (!dogs || dogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Dogs Found</CardTitle>
          <CardDescription>
            You need to add a dog before you can manage DNA tests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Go to the Dogs section to add a dog to your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If there's only one dog, show the DNA test management directly
  if (dogs.length === 1) {
    return <DNATestingManager dogId={dogs[0].id} dogName={dogs[0].name} />;
  }

  // If there are multiple dogs, show a selector
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Select a Dog</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dogs.map((dog) => (
          <Card
            key={dog.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => {
              // Use client-side navigation to the dog's DNA testing page
              router.push(`/dashboard/dna-testing/${dog.id}`);
            }}
          >
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">{dog.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                View and manage DNA tests
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// DNA Testing Manager component
function DNATestingManager({ dogId, dogName }: { dogId: string; dogName: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">DNA Testing for {dogName}</h2>
        <p className="text-muted-foreground">
          Manage and analyze DNA test results
        </p>
      </div>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="submit">Submit New Test</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <DNAResultsView dogId={dogId} />
        </TabsContent>

        <TabsContent value="submit">
          <DNATestForm dogId={dogId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main page component
export default function DNATestingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">DNA Testing</h2>
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                You need to be logged in to access this page
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DogSelector />
    </DashboardLayout>
  );
}
