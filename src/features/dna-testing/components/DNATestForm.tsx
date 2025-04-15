"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DNATestFormData } from "../types";

// Form validation schema
const formSchema = z.object({
  dogId: z.string().uuid({ message: "Please select a dog" }),
  testType: z.string().min(1, { message: "Please select a test type" }),
  testProvider: z.string().min(1, { message: "Please select a test provider" }),
  testDate: z.string().min(1, { message: "Please enter the test date" }),
  testResults: z.string().optional(),
});

interface DNATestFormProps {
  dogId?: string;
  dogs?: { id: string; name: string }[];
  onSuccess?: (testId: string) => void;
}

export default function DNATestForm({ dogId, dogs = [], onSuccess }: DNATestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dogId: dogId || "",
      testType: "",
      testProvider: "",
      testDate: new Date().toISOString().split("T")[0],
      testResults: "",
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      let testData: Record<string, any> = {};
      let rawData: string | undefined;
      
      // Parse test results from JSON input or file
      if (values.testResults) {
        try {
          testData = JSON.parse(values.testResults);
        } catch (error) {
          // If not valid JSON, treat as raw text
          testData = { rawText: values.testResults };
          rawData = values.testResults;
        }
      }
      
      // If a file was selected, read and parse it
      if (selectedFile) {
        const fileText = await readFileAsText(selectedFile);
        rawData = fileText;
        
        try {
          // Try to parse as JSON
          const fileData = JSON.parse(fileText);
          testData = { ...testData, ...fileData };
        } catch (error) {
          // If not valid JSON, add as raw text
          testData.fileContent = fileText;
        }
      }
      
      // Submit to the API
      const response = await fetch("/.netlify/functions/dna-test-parser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dogId: values.dogId,
          testType: values.testType,
          testProvider: values.testProvider,
          testData,
          rawData,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit DNA test");
      }
      
      const result = await response.json();
      
      toast.success("DNA test submitted successfully");
      
      // Call the success callback if provided
      if (onSuccess && result.testId) {
        onSuccess(result.testId);
      }
      
      // Reset the form
      form.reset();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error submitting DNA test:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit DNA test");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to read a file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit DNA Test Results</CardTitle>
        <CardDescription>
          Upload DNA test results from Embark, Wisdom Panel, or other providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dog Selection */}
            <FormField
              control={form.control}
              name="dogId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dog</FormLabel>
                  <Select
                    disabled={!!dogId || isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a dog" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dogs.map((dog) => (
                        <SelectItem key={dog.id} value={dog.id}>
                          {dog.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Test Type */}
            <FormField
              control={form.control}
              name="testType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Type</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="color-genetics">Color Genetics</SelectItem>
                      <SelectItem value="health-markers">Health Markers</SelectItem>
                      <SelectItem value="breed-verification">Breed Verification</SelectItem>
                      <SelectItem value="trait-analysis">Trait Analysis</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Test Provider */}
            <FormField
              control={form.control}
              name="testProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Provider</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Embark">Embark</SelectItem>
                      <SelectItem value="Wisdom Panel">Wisdom Panel</SelectItem>
                      <SelectItem value="Paw Print Genetics">Paw Print Genetics</SelectItem>
                      <SelectItem value="Animal Genetics">Animal Genetics</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Test Date */}
            <FormField
              control={form.control}
              name="testDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload */}
            <FormItem>
              <FormLabel>Upload Test Results File (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".json,.txt,.csv,.pdf"
                  disabled={isSubmitting}
                  onChange={handleFileChange}
                />
              </FormControl>
              <FormDescription>
                Upload a file with your test results. Supported formats: JSON, TXT, CSV, PDF
              </FormDescription>
            </FormItem>

            {/* Manual Test Results */}
            <FormField
              control={form.control}
              name="testResults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Results (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your test results here (JSON format preferred)"
                      className="min-h-32"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Paste your test results here if you don't have a file to upload
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit DNA Test"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
