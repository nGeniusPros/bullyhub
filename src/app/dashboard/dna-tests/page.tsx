"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { DNATestResult } from "@/types";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-browser";

export default function DNATestsPage() {
  const [dnaTests, setDnaTests] = useState<DNATestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDNATests = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        const response = await fetch("/api/dna-tests", {
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
          },
          credentials: "include"
        });

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dnaTests.map((test) => (
            <Link key={test.id} href={`/dashboard/dna-tests/${test.id}`}>
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{test.dogName}</CardTitle>
                    <div className="px-2 py-1 rounded text-xs bg-primary/10 text-primary font-medium">
                      {test.provider}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tested on {new Date(test.testDate).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Health Markers</h3>
                      <div className="flex flex-wrap gap-2">
                        {test.healthMarkers.length > 0 ? (
                          <>
                            {test.healthMarkers.slice(0, 3).map((marker, index) => (
                              <div
                                key={index}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  marker.status === "Clear"
                                    ? "bg-green-100 text-green-800"
                                    : marker.status === "Carrier"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {marker.condition}: {marker.status}
                              </div>
                            ))}
                            {test.healthMarkers.length > 3 && (
                              <div className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                                +{test.healthMarkers.length - 3} more
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">No health markers</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Genetic Markers</h3>
                      <div className="flex flex-wrap gap-2">
                        {test.markers.length > 0 ? (
                          <>
                            {test.markers.slice(0, 2).map((marker, index) => (
                              <div
                                key={index}
                                className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {marker.locus}: {marker.alleles.join('/')}
                              </div>
                            ))}
                            {test.markers.length > 2 && (
                              <div className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                                +{test.markers.length - 2} more
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">No genetic markers</span>
                        )}
                      </div>
                    </div>

                    {test.documents && test.documents.length > 0 && (
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        {test.documents.length} document{test.documents.length > 1 ? 's' : ''}
                      </div>
                    )}
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
