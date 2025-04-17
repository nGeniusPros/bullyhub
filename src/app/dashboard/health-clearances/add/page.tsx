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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Upload, X } from "lucide-react";

// Define the Dog type if it's not imported
interface Dog {
  id: string;
  name: string;
}

export default function AddHealthClearancePage() {
  const router = useRouter();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dogId: "",
    test: "",
    date: "",
    result: "",
    status: "",
    expiryDate: "",
    verificationNumber: "",
    notes: "",
    documents: [] as string[],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadDocument = async (file: File, folder: string): Promise<string> => {
    // This is a placeholder function - in a real app, you would implement file upload
    // to your storage service (e.g., Supabase Storage)
    console.log(`Uploading ${file.name} to ${folder}...`);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return a mock URL
    return `https://storage.example.com/${folder}/${file.name}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      // Upload documents if any
      if (selectedFiles.length > 0) {
        setUploading(true);
        toast.loading("Uploading documents...");

        const uploadPromises = selectedFiles.map(file =>
          uploadDocument(file, 'health-clearances')
        );

        const documentUrls = await Promise.all(uploadPromises);

        // Update form data with document URLs
        setFormData(prev => ({
          ...prev,
          documents: documentUrls
        }));

        toast.dismiss();
        setUploading(false);
      }

      toast.loading("Saving health clearance...");

      // Submit the form data with document URLs
      const dataToSubmit = {
        ...formData,
        documents: selectedFiles.length > 0 ?
          // If we just uploaded files, use those URLs
          await Promise.all(selectedFiles.map(file => uploadDocument(file, 'health-clearances'))) :
          // Otherwise use any existing URLs
          formData.documents
      };

      const response = await fetch("/api/health-clearances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create health clearance");
      }

      toast.dismiss();
      toast.success("Health clearance added successfully");
      router.push("/dashboard/health-clearances");
    } catch (error) {
      console.error("Error adding health clearance:", error);
      toast.dismiss();
      toast.error(typeof error === 'object' && error !== null && 'message' in error
        ? (error as Error).message
        : "Failed to add health clearance");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Add Health Clearance
        </h1>
        <p className="text-muted-foreground">
          Record a new health clearance or certification for your dog
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Health Clearance Information</CardTitle>
            <CardDescription>
              Enter the details of the health clearance or certification
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
                  <Label htmlFor="test">Test/Certification</Label>
                  <Input
                    id="test"
                    placeholder="e.g., Hip Evaluation, BOAS Assessment"
                    required
                    value={formData.test}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Test Date</Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">
                      Expiry Date (if applicable)
                    </Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="result">Result</Label>
                  <Input
                    id="result"
                    placeholder="e.g., OFA Good, Normal, Grade 1"
                    required
                    value={formData.result}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    required
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verificationNumber">
                    Verification Number
                  </Label>
                  <Input
                    id="verificationNumber"
                    placeholder="e.g., OFA12345, CERF-123456"
                    required
                    value={formData.verificationNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional information about the test or results"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Documents</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload certification documents, reports, or images
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supported formats: PDF, JPG, PNG
                    </p>
                    <Input
                      id="documents"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      multiple
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("documents")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Select Files
                    </Button>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/health-clearances")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || loading || uploading}>
              {submitting || uploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                  {uploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                "Save Health Clearance"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
