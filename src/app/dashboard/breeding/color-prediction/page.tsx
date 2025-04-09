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
  ChevronRight,
  Dna,
  Loader2,
  Palette,
  PieChart,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ColorPrediction } from "@/types";

export default function ColorPredictionPage() {
  const router = useRouter();
  const [selectedSire, setSelectedSire] = useState<string>("");
  const [selectedDam, setSelectedDam] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [colorPredictions, setColorPredictions] = useState<
    ColorPrediction[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

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
      // Call the Netlify serverless function for color prediction
      const response = await fetch("/.netlify/functions/color-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sireId: selectedSire,
          damId: selectedDam,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Set the color predictions from the API response
      setColorPredictions(data.predictions);
    } catch (error) {
      console.error("Error analyzing color prediction:", error);
      setError("Failed to analyze color prediction. Please try again later.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setColorPredictions(null);
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      Blue: "bg-blue-500",
      Brindle: "bg-amber-700",
      Fawn: "bg-amber-300",
      Chocolate: "bg-amber-900",
      Black: "bg-black",
      Lilac: "bg-purple-300",
      Merle: "bg-slate-400",
      Pied: "bg-white border border-gray-300",
      "Blue Brindle": "bg-blue-700",
    };

    return colorMap[color] || "bg-gray-500";
  };

  const getTextClass = (color: string) => {
    const darkColors = ["Fawn", "Lilac", "Pied", "Cream"];
    return darkColors.includes(color) ? "text-black" : "text-white";
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Color Prediction
          </h1>
          <p className="text-muted-foreground">
            Predict puppy coat colors based on parents' genetics
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/breeding")}
        >
          Back to Breeding
        </Button>
      </div>

      {!colorPredictions ? (
        <Card>
          <CardHeader>
            <CardTitle>Select Parents</CardTitle>
            <CardDescription>
              Choose the sire and dam to predict possible puppy colors
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
                              ({dog.color})
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
                  <div className="rounded-md bg-muted p-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full ${getColorClass(
                          dogs.find((d) => d.id === selectedSire)?.color || ""
                        )}`}
                      ></div>
                      <div>
                        <div className="font-medium">
                          {dogs.find((d) => d.id === selectedSire)?.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {dogs.find((d) => d.id === selectedSire)?.color}
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
                              ({dog.color})
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
                  <div className="rounded-md bg-muted p-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full ${getColorClass(
                          dogs.find((d) => d.id === selectedDam)?.color || ""
                        )}`}
                      ></div>
                      <div>
                        <div className="font-medium">
                          {dogs.find((d) => d.id === selectedDam)?.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {dogs.find((d) => d.id === selectedDam)?.color}
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
                )}
              </div>
            </div>

            {(!selectedSire || !selectedDam) && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>DNA Testing Recommended</AlertTitle>
                <AlertDescription>
                  For the most accurate color predictions, both parents should
                  have DNA test results. Without DNA data, predictions will be
                  based on visual color only.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              onClick={handleAnalyze}
              disabled={!selectedSire || !selectedDam || analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Palette className="mr-2 h-4 w-4" />
                  Predict Colors
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Prediction Results</CardTitle>
              <CardDescription>
                Based on {dogs.find((d) => d.id === selectedSire)?.name} ×{" "}
                {dogs.find((d) => d.id === selectedDam)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full mx-auto mb-2 ${getColorClass(
                        dogs.find((d) => d.id === selectedSire)?.color || ""
                      )}`}
                    ></div>
                    <div className="font-medium">
                      {dogs.find((d) => d.id === selectedSire)?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {dogs.find((d) => d.id === selectedSire)?.color}
                    </div>
                  </div>

                  <ChevronRight className="h-8 w-8 text-muted-foreground" />

                  <div className="flex flex-wrap justify-center gap-2">
                    {colorPredictions.map((prediction, index) => (
                      <div key={index} className="text-center">
                        <div
                          className={`w-12 h-12 rounded-full mx-auto mb-1 ${getColorClass(
                            prediction.color
                          )} ${getTextClass(
                            prediction.color
                          )} flex items-center justify-center text-xs font-medium`}
                        >
                          {prediction.percentage}%
                        </div>
                        <div className="text-xs">{prediction.color}</div>
                      </div>
                    ))}
                  </div>

                  <ChevronRight className="h-8 w-8 text-muted-foreground" />

                  <div className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full mx-auto mb-2 ${getColorClass(
                        dogs.find((d) => d.id === selectedDam)?.color || ""
                      )}`}
                    ></div>
                    <div className="font-medium">
                      {dogs.find((d) => d.id === selectedDam)?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {dogs.find((d) => d.id === selectedDam)?.color}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Detailed Color Predictions
                  </h3>
                  <div className="space-y-4">
                    {colorPredictions.map((prediction, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-4 items-center"
                      >
                        <div className="col-span-1">
                          <div
                            className={`w-8 h-8 rounded-full ${getColorClass(
                              prediction.color
                            )}`}
                          ></div>
                        </div>
                        <div className="col-span-3 font-medium">
                          {prediction.color}
                        </div>
                        <div className="col-span-6">
                          <Progress
                            value={prediction.percentage}
                            className="h-2"
                          />
                        </div>
                        <div className="col-span-2 text-right">
                          {prediction.percentage}%
                        </div>
                        <div className="col-span-1"></div>
                        <div className="col-span-11 text-sm text-muted-foreground">
                          {prediction.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertTitle>About Color Predictions</AlertTitle>
                  <AlertDescription>
                    These predictions are based on known color genetics for
                    Bulldogs. Actual results may vary. For the most accurate
                    predictions, both parents should have DNA test results that
                    include color markers.
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
              <CardTitle>Color Genetics Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basics">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basics">Basics</TabsTrigger>
                  <TabsTrigger value="inheritance">Inheritance</TabsTrigger>
                  <TabsTrigger value="rare">Rare Colors</TabsTrigger>
                </TabsList>

                <TabsContent value="basics" className="space-y-4 pt-4">
                  <p>
                    Bulldog coat colors are determined by several genes that
                    interact with each other. The main color genes include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>B Locus (Black/Brown):</strong> Controls black vs.
                      brown/chocolate pigment
                    </li>
                    <li>
                      <strong>D Locus (Dilution):</strong> Dilutes black to blue
                      or brown to lilac/isabella
                    </li>
                    <li>
                      <strong>K Locus (Dominant Black/Brindle):</strong>{" "}
                      Controls solid color vs. brindle pattern
                    </li>
                    <li>
                      <strong>S Locus (Spotting):</strong> Controls white
                      spotting/piebald pattern
                    </li>
                  </ul>
                </TabsContent>

                <TabsContent value="inheritance" className="space-y-4 pt-4">
                  <p>
                    Color inheritance follows Mendelian genetics, with some
                    genes being dominant and others recessive:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Dominant traits:</strong> Only need one copy of
                      the gene to be expressed
                    </li>
                    <li>
                      <strong>Recessive traits:</strong> Need two copies (one
                      from each parent) to be expressed
                    </li>
                    <li>
                      <strong>Carriers:</strong> Dogs with one copy of a
                      recessive gene that isn't expressed
                    </li>
                  </ul>
                  <p className="mt-2">
                    For example, blue is a recessive dilution of black. Both
                    parents must carry the dilution gene for puppies to be blue.
                  </p>
                </TabsContent>

                <TabsContent value="rare" className="space-y-4 pt-4">
                  <p>Rare colors in Bulldogs include:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Blue:</strong> Dilution of black (recessive)
                    </li>
                    <li>
                      <strong>Chocolate:</strong> Brown pigment instead of black
                      (recessive)
                    </li>
                    <li>
                      <strong>Lilac/Isabella:</strong> Dilution of chocolate
                      (double recessive)
                    </li>
                    <li>
                      <strong>Merle:</strong> Mottled pattern (dominant but rare
                      in Bulldogs)
                    </li>
                    <li>
                      <strong>Platinum:</strong> Extreme dilution (very rare)
                    </li>
                  </ul>
                  <p className="mt-2 text-amber-600">
                    Note: Some rare colors may be associated with health issues.
                    Always prioritize health over color in breeding decisions.
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
