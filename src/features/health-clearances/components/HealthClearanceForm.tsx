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
import { HealthClearanceFormData } from "../types";

// Form validation schema
const formSchema = z.object({
  dogId: z.string().uuid({ message: "Please select a dog" }),
  test: z.string().min(1, { message: "Please enter the test name" }),
  date: z.string().min(1, { message: "Please enter the test date" }),
  result: z.string().min(1, { message: "Please enter the test result" }),
  status: z.enum(["passed", "pending", "failed"], {
    message: "Please select a status",
  }),
  expiryDate: z.string().optional(),
  verificationNumber: z.string().min(1, { message: "Please enter a verification number" }),
  notes: z.string().optional(),
});

interface HealthClearanceFormProps {
  dogId?: string;
  dogs?: { id: string; name: string }[];
  initialData?: HealthClearanceFormData;
  onSuccess?: (clearanceId: string) => void;
}

export default function HealthClearanceForm({
  dogId,
  dogs = [],
  initialData,
  onSuccess,
}: HealthClearanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dogId: dogId || initialData?.dogId || "",
      test: initialData?.test || "",
      date: initialData?.date || new Date().toISOString().split("T")[0],
      result: initialData?.result || "",
      status: initialData?.status || "pending",
      expiryDate: initialData?.expiryDate || "",
      verificationNumber: initialData?.verificationNumber || "",
      notes: initialData?.notes || "",
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Handle file uploads if any
      let documentUrls: string[] = initialData?.documents || [];

      if (selectedFiles && selectedFiles.length > 0) {
        // In a real implementation, we would upload the files to storage
        // and get back the URLs
        // For now, we'll just use placeholder URLs
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          documentUrls.push(`https://example.com/documents/${file.name}`);
        }
      }

      // Prepare the data
      const clearanceData: HealthClearanceFormData = {
        dogId: values.dogId,
        test: values.test,
        date: values.date,
        result: values.result,
        status: values.status,
        expiryDate: values.expiryDate || "",
        verificationNumber: values.verificationNumber,
        notes: values.notes,
        documents: documentUrls,
      };

      // Submit to the API
      const response = await fetch("/.netlify/functions/health-clearance-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clearanceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit health clearance");
      }

      const result = await response.json();

      toast.success("Health clearance submitted successfully");

      // Call the success callback if provided
      if (onSuccess && result.clearanceId) {
        onSuccess(result.clearanceId);
      }

      // Reset the form if it's a new submission
      if (!initialData) {
        form.reset();
        setSelectedFiles(null);
      }
    } catch (error) {
      console.error("Error submitting health clearance:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit health clearance");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common test types for bulldogs
  const commonTests = [
    "BOAS Assessment",
    "Cardiac Evaluation",
    "Patella Evaluation",
    "Hip Evaluation",
    "Tracheal Hypoplasia",
    "DNA Test for HUU",
    "Eye Examination",
    "Annual Veterinary Exam",
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Health Clearance" : "Submit Health Clearance"}
        </CardTitle>
        <CardDescription>
          Record health test results and certifications for your dog
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

            {/* Test Name */}
            <FormField
              control={form.control}
              name="test"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select or enter test name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {commonTests.map((test) => (
                        <SelectItem key={test} value={test}>
                          {test}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.value === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="Enter custom test name"
                      onChange={(e) => form.setValue("test", e.target.value)}
                      disabled={isSubmitting}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Test Date */}
            <FormField
              control={form.control}
              name="date"
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

            {/* Test Result */}
            <FormField
              control={form.control}
              name="result"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Result</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Normal, Grade 1, Clear, etc."
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the exact result as shown on the test report
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expiry Date */}
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    If the test has an expiration date, enter it here
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Verification Number */}
            <FormField
              control={form.control}
              name="verificationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., OFA123456, CERF-123, etc."
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the verification number from the test certificate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload */}
            <FormItem>
              <FormLabel>Upload Documents (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={isSubmitting}
                  onChange={handleFileChange}
                  multiple
                />
              </FormControl>
              <FormDescription>
                Upload test certificates or reports. Supported formats: PDF, JPG, PNG
              </FormDescription>
            </FormItem>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes about this test"
                      className="min-h-20"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting
                ? "Submitting..."
                : initialData
                ? "Update Health Clearance"
                : "Submit Health Clearance"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
