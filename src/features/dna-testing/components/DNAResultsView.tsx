"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { DNATestResult, DNATestSummary } from "../types";
import { useDNATestingQueries } from "../data/queries";

interface DNAResultsViewProps {
  dogId: string;
}

export default function DNAResultsView({ dogId }: DNAResultsViewProps) {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<DNATestResult[]>([]);
  const [summary, setSummary] = useState<DNATestSummary | null>(null);
  const [selectedTest, setSelectedTest] = useState<DNATestResult | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  
  // Get the DNA testing queries
  const dnaQueries = useDNATestingQueries();

  // Fetch DNA test data
  const fetchDNATests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/.netlify/functions/get-dna-data?dogId=${dogId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch DNA tests");
      }
      
      const data = await response.json();
      setTests(data.tests || []);
      setSummary(data.summary || null);
      
      // Set the selected test to the latest one if available
      if (data.tests && data.tests.length > 0) {
        setSelectedTest(data.tests[0]);
      }
    } catch (error) {
      console.error("Error fetching DNA tests:", error);
      toast.error("Failed to load DNA test results");
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchDNATests();
    
    // Subscribe to changes
    const subscription = dnaQueries.subscribeToDogDNATests(dogId, (payload) => {
      // Refresh the data when changes occur
      fetchDNATests();
    });
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [dogId]);

  // Handle test selection
  const handleSelectTest = (test: DNATestResult) => {
    setSelectedTest(test);
    setActiveTab("details");
  };

  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-1/2" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render empty state
  if (tests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No DNA Tests Found</CardTitle>
          <CardDescription>
            No DNA test results have been submitted for this dog yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Submit a DNA test to see results here. You can upload test results from providers like Embark, Wisdom Panel, or Paw Print Genetics.
          </p>
          <Button variant="outline">Submit DNA Test</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>DNA Test Results</CardTitle>
        <CardDescription>
          View and analyze DNA test results for this dog
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Test Details</TabsTrigger>
            <TabsTrigger value="history">Test History</TabsTrigger>
          </TabsList>
          
          {/* Summary Tab */}
          <TabsContent value="summary">
            {summary && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{summary.totalTests}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Latest Test</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {summary.latestTest ? (
                        <div>
                          <p className="font-medium">{summary.latestTest.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(summary.latestTest.date).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <p>No tests available</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Providers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(summary.byProvider).map(([provider, count]) => (
                          <Badge key={provider} variant="outline">
                            {provider} ({count})
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Test Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(summary.byType).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="font-medium">{type}</span>
                          <Badge>{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          {/* Test Details Tab */}
          <TabsContent value="details">
            {selectedTest ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedTest.test_type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedTest.test_provider} • {new Date(selectedTest.test_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={selectedTest.verified ? "success" : "outline"}>
                    {selectedTest.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Test Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTest.results.markers ? (
                      <div className="space-y-4">
                        {Object.entries(selectedTest.results.markers).map(([key, value]: [string, any]) => (
                          <div key={key} className="border-b pb-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{value.name || key}</span>
                              <Badge variant="secondary">{value.value}</Badge>
                            </div>
                            {value.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {value.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(selectedTest.results, null, 2)}
                      </pre>
                    )}
                  </CardContent>
                </Card>
                
                {selectedTest.raw_results && (
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Raw Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-40 overflow-auto">
                        <pre className="text-xs bg-muted p-2 rounded">
                          {selectedTest.raw_results}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <p>Select a test to view details</p>
            )}
          </TabsContent>
          
          {/* Test History Tab */}
          <TabsContent value="history">
            <div className="space-y-2">
              {tests.map((test) => (
                <Card 
                  key={test.id} 
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedTest?.id === test.id ? "border-primary" : ""
                  }`}
                  onClick={() => handleSelectTest(test)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{test.test_type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {test.test_provider} • {new Date(test.test_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
