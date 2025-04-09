"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Check,
  Dna,
  FileText,
  Loader2,
  PieChart,
  Upload,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface COIResult {
  coiPercentage: number;
  diversityAssessment: string;
  riskLevel: "Low" | "Low to Medium" | "Medium" | "High";
  recommendations: string[];
  keyAncestors?: {
    name: string;
    contribution: number;
    pathDescription: string;
  }[];
  analysisDate?: string;
  isEstimate?: boolean;
}

export default function COICalculatorPage() {
  const router = useRouter();
  const [selectedSire, setSelectedSire] = useState<string>("");
  const [selectedDam, setSelectedDam] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [coiResult, setCoiResult] = useState<COIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPedigree, setHasPedigree] = useState({
    sire: false,
    dam: false,
  });

  // Mock data for dogs
  const dogs = [
    {
      id: "1",
      name: "Max",
      breed: "American Bully",
      color: "Blue",
      hasDNA: true,
    },
    {
      id: "2",
      name: "Bella",
      breed: "American Bully",
      color: "Fawn",
      hasDNA: true,
    },
    {
      id: "3",
      name: "Rocky",
      breed: "American Bully",
      color: "Brindle",
      hasDNA: true,
    },
    {
      id: "4",
      name: "Luna",
      breed: "American Bully",
      color: "Chocolate",
      hasDNA: false,
    },
  ];

  const handleAnalyze = async () => {
    if (!selectedSire || !selectedDam) {
      setError("Please select both a sire and a dam");
      return;
    }

    setError(null);
    setAnalyzing(true);

    try {
      // Call the Netlify serverless function
      const response = await fetch("/.netlify/functions/coi-calculator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sireId: selectedSire,
          damId: selectedDam,
          generations: 5, // Default to 5 generations
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setCoiResult(result);
    } catch (error) {
      console.error("Error calculating COI:", error);
      setError("Failed to calculate COI. Please try again later.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setCoiResult(null);
    setHasPedigree({
      sire: false,
      dam: false,
    });
  };

  const handleUploadPedigree = (dog: "sire" | "dam") => {
    // In a real implementation, this would open a file dialog
    // For now, we'll just set the state
    setHasPedigree((prev) => ({
      ...prev,
      [dog]: true,
    }));
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return "bg-green-500";
      case "Low to Medium":
        return "bg-green-400";
      case "Medium":
        return "bg-amber-500";
      case "High":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return <Badge className="bg-green-500">Low Risk</Badge>;
      case "Low to Medium":
        return <Badge className="bg-green-400">Low to Medium Risk</Badge>;
      case "Medium":
        return <Badge className="bg-amber-500">Medium Risk</Badge>;
      case "High":
        return <Badge className="bg-red-500">High Risk</Badge>;
      default:
        return <Badge>Unknown Risk</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">COI Calculator</h1>
          <p className="text-muted-foreground">
            Calculate Coefficient of Inbreeding for potential matings
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/breeding")}
        >
          Back to Breeding
        </Button>
      </div>

      {!coiResult ? (
        <Card>
          <CardHeader>
            <CardTitle>Calculate COI</CardTitle>
            <CardDescription>
              Select parents and upload pedigree data for more accurate results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sire selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Sire (Male)</label>
                <Select value={selectedSire} onValueChange={setSelectedSire}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sire" />
                  </SelectTrigger>
                  <SelectContent>
                    {dogs
                      .filter((dog) => dog.id !== selectedDam)
                      .map((dog) => (
                        <SelectItem key={dog.id} value={dog.id}>
                          <div className="flex items-center">
                            <span>{dog.name}</span>
                            <span className="ml-2 text-muted-foreground">
                              ({dog.breed})
                            </span>
                            {!dog.hasDNA && (
                              <span className="ml-auto text-amber-500 text-xs">
                                No DNA
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {selectedSire && (
                  <div className="space-y-3">
                    <div className="rounded-md bg-muted p-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium">
                            {dogs.find((d) => d.id === selectedSire)?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {dogs.find((d) => d.id === selectedSire)?.breed}
                          </div>
                        </div>
                        {dogs.find((d) => d.id === selectedSire)?.hasDNA ? (
                          <div className="ml-auto flex items-center text-xs text-green-500">
                            <Dna className="h-3 w-3 mr-1" />
                            DNA Available
                          </div>
                        ) : (
                          <div className="ml-auto flex items-center text-xs text-amber-500">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            No DNA Data
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleUploadPedigree("sire")}
                    >
                      {hasPedigree.sire ? (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Pedigree Uploaded
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Pedigree
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Dam selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Dam (Female)</label>
                <Select value={selectedDam} onValueChange={setSelectedDam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dam" />
                  </SelectTrigger>
                  <SelectContent>
                    {dogs
                      .filter((dog) => dog.id !== selectedSire)
                      .map((dog) => (
                        <SelectItem key={dog.id} value={dog.id}>
                          <div className="flex items-center">
                            <span>{dog.name}</span>
                            <span className="ml-2 text-muted-foreground">
                              ({dog.breed})
                            </span>
                            {!dog.hasDNA && (
                              <span className="ml-auto text-amber-500 text-xs">
                                No DNA
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {selectedDam && (
                  <div className="space-y-3">
                    <div className="rounded-md bg-muted p-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium">
                            {dogs.find((d) => d.id === selectedDam)?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {dogs.find((d) => d.id === selectedDam)?.breed}
                          </div>
                        </div>
                        {dogs.find((d) => d.id === selectedDam)?.hasDNA ? (
                          <div className="ml-auto flex items-center text-xs text-green-500">
                            <Dna className="h-3 w-3 mr-1" />
                            DNA Available
                          </div>
                        ) : (
                          <div className="ml-auto flex items-center text-xs text-amber-500">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            No DNA Data
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleUploadPedigree("dam")}
                    >
                      {hasPedigree.dam ? (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Pedigree Uploaded
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Pedigree
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>About COI Calculation</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  The Coefficient of Inbreeding (COI) measures the probability
                  that two alleles at any locus are identical by descent. Lower
                  COI values indicate greater genetic diversity.
                </p>
                <p>
                  For the most accurate COI calculation, upload pedigree data
                  for both parents. Without pedigree data, the calculation will
                  be based on DNA markers and breed averages.
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              onClick={handleAnalyze}
              disabled={!selectedSire || !selectedDam || analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <PieChart className="mr-2 h-4 w-4" />
                  Calculate COI
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>COI Calculation Results</CardTitle>
              <CardDescription>
                Based on {dogs.find((d) => d.id === selectedSire)?.name} ×{" "}
                {dogs.find((d) => d.id === selectedDam)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold">
                        {coiResult.coiPercentage}%
                      </div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={getRiskColor(coiResult.riskLevel)}
                        strokeWidth="10"
                        strokeDasharray={`${
                          coiResult.coiPercentage * 2.83
                        } 283`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <div className="text-center mb-2">
                    <div className="text-lg font-medium">
                      Coefficient of Inbreeding
                    </div>
                    <div className="text-muted-foreground">
                      {coiResult.diversityAssessment}
                    </div>
                  </div>
                  <div className="mb-4">
                    {getRiskBadge(coiResult.riskLevel)}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {coiResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {coiResult.keyAncestors &&
                  coiResult.keyAncestors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Key Common Ancestors
                      </h3>
                      <div className="space-y-3">
                        {coiResult.keyAncestors.map((ancestor, index) => (
                          <div key={index} className="rounded-md bg-muted p-3">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{ancestor.name}</div>
                              <div className="text-sm">
                                {ancestor.contribution}% contribution
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {ancestor.pathDescription}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertTitle>About This Calculation</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">
                      This COI calculation is based on{" "}
                      {hasPedigree.sire && hasPedigree.dam
                        ? "pedigree data and DNA markers"
                        : hasPedigree.sire || hasPedigree.dam
                        ? "partial pedigree data and DNA markers"
                        : "DNA markers and breed averages"}
                      .
                      {coiResult.isEstimate && (
                        <span className="text-amber-600 font-medium">
                          {" "}
                          This is an estimated value.
                        </span>
                      )}
                    </p>
                    {coiResult.analysisDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Analysis date:{" "}
                        {new Date(coiResult.analysisDate).toLocaleDateString()}
                      </p>
                    )}
                    <p>
                      Generally, a COI below 10% is considered acceptable for
                      most breeds. Lower values indicate greater genetic
                      diversity and potentially fewer health issues.
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetAnalysis}>
                Start Over
              </Button>
              <Button
                onClick={() => router.push("/dashboard/breeding/compatibility")}
              >
                Check Breeding Compatibility
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Understanding COI</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basics">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basics">Basics</TabsTrigger>
                  <TabsTrigger value="interpretation">
                    Interpretation
                  </TabsTrigger>
                  <TabsTrigger value="management">Management</TabsTrigger>
                </TabsList>

                <TabsContent value="basics" className="space-y-4 pt-4">
                  <p>
                    The Coefficient of Inbreeding (COI) is a measure of how
                    related two breeding animals are. It represents the
                    probability that two alleles at any given locus are
                    identical by descent.
                  </p>
                  <p>COI is expressed as a percentage:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>0%</strong>: No inbreeding (completely unrelated
                      animals)
                    </li>
                    <li>
                      <strong>25%</strong>: Equivalent to a parent-offspring or
                      full sibling mating
                    </li>
                    <li>
                      <strong>12.5%</strong>: Equivalent to a half-sibling or
                      grandparent-grandchild mating
                    </li>
                    <li>
                      <strong>6.25%</strong>: Equivalent to a first cousin
                      mating
                    </li>
                  </ul>
                </TabsContent>

                <TabsContent value="interpretation" className="space-y-4 pt-4">
                  <p>How to interpret COI values:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Below 5%</strong>: Low inbreeding, generally
                      considered safe
                    </li>
                    <li>
                      <strong>5-10%</strong>: Moderate inbreeding, acceptable in
                      most breeding programs
                    </li>
                    <li>
                      <strong>10-15%</strong>: Moderately high inbreeding,
                      should be monitored carefully
                    </li>
                    <li>
                      <strong>Above 15%</strong>: High inbreeding, increased
                      risk of genetic health issues
                    </li>
                  </ul>
                  <p className="mt-2">
                    Higher COI values are associated with reduced genetic
                    diversity, which can lead to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Increased expression of recessive genetic disorders</li>
                    <li>Reduced fertility and reproductive success</li>
                    <li>Smaller litter sizes</li>
                    <li>Reduced immune function</li>
                    <li>Shorter lifespan</li>
                  </ul>
                </TabsContent>

                <TabsContent value="management" className="space-y-4 pt-4">
                  <p>Strategies for managing COI in breeding programs:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Outcrossing</strong>: Breeding to less related
                      individuals to reduce COI
                    </li>
                    <li>
                      <strong>Line breeding</strong>: Careful selection to
                      maintain desirable traits while managing COI
                    </li>
                    <li>
                      <strong>Genetic testing</strong>: Identifying carriers of
                      genetic disorders
                    </li>
                    <li>
                      <strong>Pedigree analysis</strong>: Calculating COI before
                      breeding decisions
                    </li>
                    <li>
                      <strong>Population management</strong>: Working with other
                      breeders to maintain genetic diversity
                    </li>
                  </ul>
                  <p className="mt-2 text-amber-600">
                    Remember: Genetic diversity is essential for the long-term
                    health of any breed. Always prioritize health over
                    appearance or other traits.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
