"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function NetlifyFunctionsTest() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [dogId, setDogId] = useState("");
  const [testType, setTestType] = useState("");
  const [testResults, setTestResults] = useState("");
  const [femaleId, setFemaleId] = useState("");
  const [message, setMessage] = useState("");

  const testHelloWorld = async () => {
    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/hello-world");
      const data = await response.json();
      setResponse(data);
      toast.success("Hello World function called successfully!");
    } catch (error) {
      console.error("Error calling hello-world function:", error);
      toast.error("Failed to call Hello World function");
    } finally {
      setLoading(false);
    }
  };

  const testDnaIntegration = async () => {
    if (!dogId || !testType || !testResults) {
      toast.error("Please fill in all DNA test fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/dna-test-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dogId,
          testType,
          testResults: JSON.parse(testResults),
        }),
      });
      const data = await response.json();
      setResponse(data);
      toast.success("DNA test integration function called successfully!");
    } catch (error) {
      console.error("Error calling dna-test-integration function:", error);
      toast.error("Failed to call DNA test integration function");
    } finally {
      setLoading(false);
    }
  };

  const testStudReceptionist = async () => {
    if (!femaleId || !message) {
      toast.error("Please fill in all stud receptionist fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/stud-receptionist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          femaleId,
          message,
        }),
      });
      const data = await response.json();
      setResponse(data);
      toast.success("Stud receptionist function called successfully!");
    } catch (error) {
      console.error("Error calling stud-receptionist function:", error);
      toast.error("Failed to call stud receptionist function");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Netlify Functions Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hello World Test */}
        <Card>
          <CardHeader>
            <CardTitle>Hello World</CardTitle>
            <CardDescription>Test the basic serverless function</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This function returns a simple greeting message.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={testHelloWorld} disabled={loading}>
              {loading ? "Loading..." : "Test Hello World"}
            </Button>
          </CardFooter>
        </Card>

        {/* DNA Test Integration */}
        <Card>
          <CardHeader>
            <CardTitle>DNA Test Integration</CardTitle>
            <CardDescription>Test storing DNA test results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dog ID</label>
              <Input
                placeholder="Enter dog ID"
                value={dogId}
                onChange={(e) => setDogId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Type</label>
              <Input
                placeholder="e.g., color-genetics"
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Results (JSON)</label>
              <Textarea
                placeholder='{"gene1": "Bb", "gene2": "dd"}'
                value={testResults}
                onChange={(e) => setTestResults(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={testDnaIntegration} disabled={loading}>
              {loading ? "Loading..." : "Test DNA Integration"}
            </Button>
          </CardFooter>
        </Card>

        {/* Stud Receptionist */}
        <Card>
          <CardHeader>
            <CardTitle>AI Stud Receptionist</CardTitle>
            <CardDescription>Test the AI stud recommendation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Female Dog ID</label>
              <Input
                placeholder="Enter female dog ID"
                value={femaleId}
                onChange={(e) => setFemaleId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Looking for a stud for my female French Bulldog..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={testStudReceptionist} disabled={loading}>
              {loading ? "Loading..." : "Test Stud Receptionist"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Response Display */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Function Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
