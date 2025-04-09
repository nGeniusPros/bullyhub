"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ServerlessFunctionsTest() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  
  // Color Prediction
  const [sireId, setSireId] = useState("");
  const [damId, setDamId] = useState("");
  
  // COI Calculator
  const [coiSireId, setCoiSireId] = useState("");
  const [coiDamId, setCoiDamId] = useState("");
  const [generations, setGenerations] = useState("5");
  
  // Health Clearance
  const [verificationNumber, setVerificationNumber] = useState("");
  const [dogId, setDogId] = useState("");
  const [testType, setTestType] = useState("");
  const [testDate, setTestDate] = useState("");
  const [testResult, setTestResult] = useState("");
  
  // Breeding Program
  const [breedingDogId, setBreedingDogId] = useState("");
  const [breedingProgramId, setBreedingProgramId] = useState("");
  
  // Social Media
  const [postText, setPostText] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [mediaUrl, setMediaUrl] = useState("");

  const testColorPrediction = async () => {
    if (!sireId || !damId) {
      toast.error("Please fill in both Sire ID and Dam ID");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/color-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sireId,
          damId,
        }),
      });
      const data = await response.json();
      setResponse(data);
      toast.success("Color prediction function called successfully!");
    } catch (error) {
      console.error("Error calling color-prediction function:", error);
      toast.error("Failed to call color prediction function");
    } finally {
      setLoading(false);
    }
  };

  const testCoiCalculator = async () => {
    if (!coiSireId || !coiDamId) {
      toast.error("Please fill in both Sire ID and Dam ID");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/coi-calculator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sireId: coiSireId,
          damId: coiDamId,
          generations: parseInt(generations),
        }),
      });
      const data = await response.json();
      setResponse(data);
      toast.success("COI calculator function called successfully!");
    } catch (error) {
      console.error("Error calling coi-calculator function:", error);
      toast.error("Failed to call COI calculator function");
    } finally {
      setLoading(false);
    }
  };

  const verifyHealthClearance = async () => {
    if (!verificationNumber) {
      toast.error("Please enter a verification number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/.netlify/functions/health-clearance-verification?verificationNumber=${verificationNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setResponse(data);
      toast.success("Health clearance verification function called successfully!");
    } catch (error) {
      console.error("Error calling health-clearance-verification function:", error);
      toast.error("Failed to call health clearance verification function");
    } finally {
      setLoading(false);
    }
  };

  const submitHealthClearance = async () => {
    if (!dogId || !testType || !testDate || !testResult || !verificationNumber) {
      toast.error("Please fill in all health clearance fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/health-clearance-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dogId,
          test: testType,
          date: testDate,
          result: testResult,
          verificationNumber,
        }),
      });
      const data = await response.json();
      setResponse(data);
      toast.success("Health clearance submission function called successfully!");
    } catch (error) {
      console.error("Error calling health-clearance-verification function:", error);
      toast.error("Failed to call health clearance submission function");
    } finally {
      setLoading(false);
    }
  };

  const testBreedingProgramCompatibility = async () => {
    if (!breedingDogId || !breedingProgramId) {
      toast.error("Please fill in both Dog ID and Breeding Program ID");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/breeding-program-compatibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dogId: breedingDogId,
          breedingProgramId,
        }),
      });
      const data = await response.json();
      setResponse(data);
      toast.success("Breeding program compatibility function called successfully!");
    } catch (error) {
      console.error("Error calling breeding-program-compatibility function:", error);
      toast.error("Failed to call breeding program compatibility function");
    } finally {
      setLoading(false);
    }
  };

  const createSocialPost = async () => {
    if (!postText || platforms.length === 0) {
      toast.error("Please enter post text and select at least one platform");
      return;
    }

    setLoading(true);
    try {
      const mediaUrls = mediaUrl ? [mediaUrl] : [];
      const response = await fetch("/.netlify/functions/social-media-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: postText,
          platforms,
          mediaUrls,
          userId: "test-user-id", // In a real app, this would be the authenticated user's ID
        }),
      });
      const data = await response.json();
      setResponse(data);
      toast.success("Social media post function called successfully!");
    } catch (error) {
      console.error("Error calling social-media-integration function:", error);
      toast.error("Failed to call social media post function");
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformChange = (value: string) => {
    if (platforms.includes(value)) {
      setPlatforms(platforms.filter(p => p !== value));
    } else {
      setPlatforms([...platforms, value]);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Serverless Functions Test</h1>

      <Tabs defaultValue="color-prediction">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="color-prediction">Color Prediction</TabsTrigger>
          <TabsTrigger value="coi-calculator">COI Calculator</TabsTrigger>
          <TabsTrigger value="health-clearance">Health Clearance</TabsTrigger>
          <TabsTrigger value="breeding-program">Breeding Program</TabsTrigger>
          <TabsTrigger value="social-media">Social Media</TabsTrigger>
        </TabsList>

        {/* Color Prediction */}
        <TabsContent value="color-prediction">
          <Card>
            <CardHeader>
              <CardTitle>Color Prediction</CardTitle>
              <CardDescription>Predict puppy coat colors based on parents' genetics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sire ID</label>
                <Input
                  placeholder="Enter sire ID"
                  value={sireId}
                  onChange={(e) => setSireId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dam ID</label>
                <Input
                  placeholder="Enter dam ID"
                  value={damId}
                  onChange={(e) => setDamId(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={testColorPrediction} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Test Color Prediction"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* COI Calculator */}
        <TabsContent value="coi-calculator">
          <Card>
            <CardHeader>
              <CardTitle>COI Calculator</CardTitle>
              <CardDescription>Calculate Coefficient of Inbreeding for potential matings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sire ID</label>
                <Input
                  placeholder="Enter sire ID"
                  value={coiSireId}
                  onChange={(e) => setCoiSireId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dam ID</label>
                <Input
                  placeholder="Enter dam ID"
                  value={coiDamId}
                  onChange={(e) => setCoiDamId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Generations</label>
                <Input
                  type="number"
                  placeholder="Number of generations"
                  value={generations}
                  onChange={(e) => setGenerations(e.target.value)}
                  min="1"
                  max="10"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={testCoiCalculator} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Test COI Calculator"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Health Clearance */}
        <TabsContent value="health-clearance">
          <Card>
            <CardHeader>
              <CardTitle>Health Clearance Verification</CardTitle>
              <CardDescription>Verify health test results and certificates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Verify Existing Clearance</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Verification Number</label>
                    <Input
                      placeholder="Enter verification number"
                      value={verificationNumber}
                      onChange={(e) => setVerificationNumber(e.target.value)}
                    />
                  </div>
                  <Button onClick={verifyHealthClearance} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Verify Clearance"
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Submit New Clearance</h3>
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
                      placeholder="e.g., Hip Dysplasia"
                      value={testType}
                      onChange={(e) => setTestType(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Test Date</label>
                    <Input
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Test Result</label>
                    <Input
                      placeholder="e.g., OFA Good"
                      value={testResult}
                      onChange={(e) => setTestResult(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Verification Number</label>
                    <Input
                      placeholder="Enter verification number"
                      value={verificationNumber}
                      onChange={(e) => setVerificationNumber(e.target.value)}
                    />
                  </div>
                  <Button onClick={submitHealthClearance} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Submit Clearance"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breeding Program */}
        <TabsContent value="breeding-program">
          <Card>
            <CardHeader>
              <CardTitle>Breeding Program Compatibility</CardTitle>
              <CardDescription>Check if a dog meets specific breeding program requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dog ID</label>
                <Input
                  placeholder="Enter dog ID"
                  value={breedingDogId}
                  onChange={(e) => setBreedingDogId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Breeding Program ID</label>
                <Input
                  placeholder="Enter breeding program ID"
                  value={breedingProgramId}
                  onChange={(e) => setBreedingProgramId(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={testBreedingProgramCompatibility} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Test Compatibility"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social-media">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Integration</CardTitle>
              <CardDescription>Post to social media platforms using Ayrshare API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Post Text</label>
                <Textarea
                  placeholder="Enter your post text"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {["facebook", "twitter", "instagram", "linkedin"].map((platform) => (
                    <Button
                      key={platform}
                      type="button"
                      variant={platforms.includes(platform) ? "default" : "outline"}
                      onClick={() => handlePlatformChange(platform)}
                      className="capitalize"
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Media URL (optional)</label>
                <Input
                  placeholder="Enter image URL"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={createSocialPost} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create Post"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
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
