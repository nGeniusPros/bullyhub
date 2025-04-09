"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertCircle } from "lucide-react";
import { BreedingProgram } from "@/types";

interface ExtendedBreedingProgram extends BreedingProgram {
  dogCount: number;
  litterCount: number;
}

export default function BreedingProgramsPage() {
  const [breedingPrograms, setBreedingPrograms] = useState<
    ExtendedBreedingProgram[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreedingPrograms = async () => {
      try {
        const response = await fetch("/api/breeding-programs");

        if (!response.ok) {
          throw new Error("Failed to fetch breeding programs");
        }

        const data = await response.json();
        setBreedingPrograms(data);
      } catch (err) {
        console.error("Error fetching breeding programs:", err);
        setError("Failed to load breeding programs");
      } finally {
        setLoading(false);
      }
    };

    fetchBreedingPrograms();
  }, []);

  const getProgramTypeBadge = (type: string) => {
    switch (type) {
      case "standard":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Standard
          </Badge>
        );
      case "rare":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Rare
          </Badge>
        );
      case "specialized":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            Specialized
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Breeding Programs
          </h1>
          <p className="text-muted-foreground">
            Manage your breeding programs and strategies
          </p>
        </div>
        <Link href="/dashboard/breeding-programs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Program
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-medium">Error</h3>
            </div>
            <p>{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : breedingPrograms.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No Breeding Programs Yet</h3>
              <p className="text-muted-foreground mt-2">
                Create your first breeding program to get started
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/breeding-programs/create">
                  Create Your First Program
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {breedingPrograms.map((program) => (
            <Link
              key={program.id}
              href={`/dashboard/breeding-programs/${program.id}`}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{program.name}</CardTitle>
                    <div className="flex space-x-2">
                      {getProgramTypeBadge(program.programType)}
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        {program.colorFocus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="text-sm mb-4">
                        <p>{program.description}</p>
                      </div>
                      {program.goals.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Goals:</h3>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {program.goals.slice(0, 3).map((goal, index) => (
                              <li key={index}>{goal}</li>
                            ))}
                            {program.goals.length > 3 && (
                              <li className="text-muted-foreground">
                                +{program.goals.length - 3} more goals
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-md bg-muted p-4">
                        <div className="text-sm font-medium mb-1">
                          Dogs in Program
                        </div>
                        <div className="text-2xl font-bold">
                          {program.dogCount}
                        </div>
                      </div>
                      <div className="rounded-md bg-muted p-4">
                        <div className="text-sm font-medium mb-1">Litters</div>
                        <div className="text-2xl font-bold">
                          {program.litterCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
