"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { DNATestResult } from "@/types";
import { toast } from "sonner";

export default function DNATestsPage() {
  const [dnaTests, setDnaTests] = useState<DNATestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDNATests = async () => {
      try {
        const response = await fetch("/api/dna-tests");

        if (!response.ok) {
          throw new Error("Failed to fetch DNA tests");
        }

        const data = await response.json();
        setDnaTests(data);
      } catch (error) {
        console.error("Error fetching DNA tests:", error);
        toast.error("Failed to load DNA tests");
      } finally {
        setLoading(false);
      }
    };

    fetchDNATests();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DNA Tests</h1>
          <p className="text-muted-foreground">
            View and manage DNA test results for your dogs
          </p>
        </div>
        <Link href="/dashboard/dna-tests/upload">
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            Upload Test
          </Button>
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : dnaTests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No DNA tests found. Upload your first test to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {dnaTests.map((test) => (
            <Link key={test.id} href={`/dashboard/dna-tests/${test.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{test.dogName}'s DNA Test</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {test.provider} •{" "}
                      {new Date(test.testDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Genetic Markers</h3>
                      <div className="space-y-2">
                        {test.markers.map((marker, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{marker.locus}:</span>{" "}
                            {marker.alleles.join("/")} - {marker.description}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Health Markers</h3>
                      <div className="space-y-2">
                        {test.healthMarkers.map((marker, index) => (
                          <div
                            key={index}
                            className="text-sm flex items-center"
                          >
                            <span className="font-medium mr-2">
                              {marker.condition}:
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                marker.status === "Clear"
                                  ? "bg-green-100 text-green-800"
                                  : marker.status === "Carrier"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {marker.status}
                            </span>
                          </div>
                        ))}
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
