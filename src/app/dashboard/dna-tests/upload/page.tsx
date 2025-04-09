"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Dog } from "@/types";

export default function UploadDNATestPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dogId: "",
    provider: "",
    testDate: "",
  });

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await fetch("/api/dogs");

        if (!response.ok) {
          throw new Error("Failed to fetch dogs");
        }

        const data = await response.json();
        setDogs(data);

        // Check if there's a dogId in the URL query params
        const searchParams = new URLSearchParams(window.location.search);
        const dogId = searchParams.get("dogId");

        if (dogId) {
          setFormData((prev) => ({ ...prev, dogId }));
        }
      } catch (error) {
        console.error("Error fetching dogs:", error);
        toast.error("Failed to load dogs");
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setSubmitting(true);

    try {
      // First, parse the file to extract DNA markers
      // This is a simplified example - in a real app, you'd need to parse different file formats
      const fileContent = await readFileAsText(selectedFile);

      // Mock parsing - in a real app, you'd parse the file based on its format and provider
      const mockMarkers = [
        { locus: "A Locus", alleles: ["at", "at"], description: "Tan points" },
        {
          locus: "B Locus",
          alleles: ["B", "b"],
          description: "Carrier for chocolate/liver",
        },
      ];

      const mockHealthMarkers = [
        { condition: "Hip Dysplasia", status: "Clear" },
        { condition: "Degenerative Myelopathy", status: "Clear" },
      ];

      // Create the DNA test record
      const response = await fetch("/api/dna-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          markers: mockMarkers,
          healthMarkers: mockHealthMarkers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create DNA test");
      }

      toast.success("DNA test uploaded successfully");
      router.push("/dashboard/dna-tests");
    } catch (error) {
      console.error("Error uploading DNA test:", error);
      toast.error("Failed to upload DNA test");
    } finally {
      setSubmitting(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload DNA Test</h1>
        <p className="text-muted-foreground">
          Upload DNA test results from major testing providers
        </p>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>DNA Test Information</CardTitle>
            <CardDescription>
              Upload your dog's DNA test results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dogId">Dog</Label>
                  <Select
                    required
                    value={formData.dogId}
                    onValueChange={(value) =>
                      handleSelectChange("dogId", value)
                    }
                  >
                    <SelectTrigger id="dogId">
                      <SelectValue placeholder="Select dog" />
                    </SelectTrigger>
                    <SelectContent>
                      {dogs.map((dog) => (
                        <SelectItem key={dog.id} value={dog.id}>
                          {dog.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Test Provider</Label>
                  <Select
                    required
                    value={formData.provider}
                    onValueChange={(value) =>
                      handleSelectChange("provider", value)
                    }
                  >
                    <SelectTrigger id="provider">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Embark">Embark</SelectItem>
                      <SelectItem value="AnimalGenetics">
                        Animal Genetics
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testDate">Test Date</Label>
                  <Input
                    id="testDate"
                    type="date"
                    required
                    value={formData.testDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Test Results File</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
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
                      className="h-8 w-8 text-muted-foreground mb-2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supported formats: PDF, CSV, XML
                    </p>
                    <Input
                      id="file"
                      type="file"
                      className="hidden"
                      accept=".pdf,.csv,.xml"
                      onChange={handleFileChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file")?.click()}
                    >
                      Browse Files
                    </Button>
                    {selectedFile && (
                      <div className="mt-4 text-sm">
                        Selected: {selectedFile.name}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/dna-tests")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || loading}>
              {submitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                  Uploading...
                </>
              ) : (
                "Upload DNA Test"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
