"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { StudService } from "../types";
import { useStudServiceQueries } from "../data/queries";

// Form validation schema
const formSchema = z.object({
  studId: z.string().uuid({ message: "Please select a dog" }),
  fee: z.coerce.number().positive({ message: "Fee must be a positive number" }),
  description: z.string().optional(),
  availability: z.boolean().default(true),
});

interface StudServiceFormProps {
  initialData?: Partial<StudService>;
  onSuccess?: (serviceId: string) => void;
}

export default function StudServiceForm({
  initialData,
  onSuccess,
}: StudServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eligibleDogs, setEligibleDogs] = useState<{ id: string; name: string; breed: string; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const studServiceQueries = useStudServiceQueries();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studId: initialData?.studId || "",
      fee: initialData?.fee || 0,
      description: initialData?.description || "",
      availability: initialData?.availability !== undefined ? initialData.availability : true,
    },
  });

  // Fetch eligible dogs for stud services
  useEffect(() => {
    const fetchEligibleDogs = async () => {
      setLoading(true);
      try {
        // In a real implementation, we would fetch the user's male dogs
        // For now, we'll use mock data
        setEligibleDogs([
          { id: '1', name: 'Max', breed: 'American Bully', color: 'Blue' },
          { id: '2', name: 'Rocky', breed: 'American Bully', color: 'Tri-color' },
          { id: '3', name: 'Duke', breed: 'French Bulldog', color: 'Fawn' },
        ]);
      } catch (error) {
        console.error("Error fetching eligible dogs:", error);
        toast.error("Failed to load eligible dogs");
      } finally {
        setLoading(false);
      }
    };

    fetchEligibleDogs();
  }, []);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      let serviceId: string;

      if (initialData?.id) {
        // Update existing service
        const updatedService = await studServiceQueries.updateStudService(initialData.id, {
          fee: values.fee,
          description: values.description,
          availability: values.availability,
        });
        serviceId = updatedService.id;
        toast.success("Stud service updated successfully");
      } else {
        // Create new service
        const newService = await studServiceQueries.createStudService({
          studId: values.studId,
          fee: values.fee,
          description: values.description,
          availability: values.availability,
        });
        serviceId = newService.id;
        toast.success("Stud service created successfully");
      }

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(serviceId);
      } else {
        // Navigate to the service detail page
        router.push(`/dashboard/stud-services/${serviceId}`);
      }
    } catch (error) {
      console.error("Error saving stud service:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save stud service");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData?.id ? "Edit Stud Service" : "Create Stud Service"}
        </CardTitle>
        <CardDescription>
          {initialData?.id
            ? "Update the details of your stud service"
            : "Set up a stud service for one of your dogs"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Dog Selection */}
            <FormField
              control={form.control}
              name="studId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dog</FormLabel>
                  <Select
                    disabled={!!initialData?.id || isSubmitting || loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a dog" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eligibleDogs.map((dog) => (
                        <SelectItem key={dog.id} value={dog.id}>
                          {dog.name} ({dog.breed}, {dog.color})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the dog you want to offer for stud service
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stud Fee */}
            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stud Fee</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        type="number"
                        placeholder="1500"
                        className="pl-7"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The fee you charge for your stud service
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your stud dog and service..."
                      className="min-h-32"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include details about your dog's qualities, health testing, and any special terms
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Availability */}
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Availability</FormLabel>
                    <FormDescription>
                      Set whether this stud service is currently available
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/stud-services")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                  {initialData?.id ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{initialData?.id ? "Update Service" : "Create Service"}</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
