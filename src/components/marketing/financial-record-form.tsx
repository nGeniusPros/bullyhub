"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinancialRecords } from "@/hooks/useFinancialRecords";
import { toast } from "@/components/ui/use-toast";
import { FinancialRecord, Dog, Client } from "@/types";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { useAuth } from "@/contexts/AuthContext";

interface FinancialRecordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<FinancialRecord>;
  isEditing?: boolean;
}

export function FinancialRecordForm({
  onSuccess,
  onCancel,
  initialData,
  isEditing = false,
}: FinancialRecordFormProps) {
  const router = useRouter();
  const { addRecord, updateRecord } = useFinancialRecords();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const { user } = useAuth();
  const supabase = createBrowserSupabaseClient();

  const [formData, setFormData] = useState<Partial<FinancialRecord>>(
    initialData || {
      recordType: "income",
      category: "",
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      relatedDogId: undefined,
      relatedClientId: undefined,
      receiptUrl: undefined,
    }
  );

  // Fetch dogs and clients for the dropdown selectors
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!user) return;

      // Fetch dogs
      const { data: dogsData, error: dogsError } = await supabase
        .from("dogs")
        .select("*")
        .eq("owner_id", user.id);

      if (dogsError) {
        console.error("Error fetching dogs:", dogsError);
      } else {
        setDogs(dogsData.map(dog => ({
          id: dog.id,
          name: dog.name,
          breed: dog.breed,
          dateOfBirth: dog.date_of_birth,
          color: dog.color,
          ownerId: dog.owner_id,
          isStud: dog.is_stud,
          createdAt: dog.created_at
        })));
      }

      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .eq("breeder_id", user.id);

      if (clientsError) {
        console.error("Error fetching clients:", clientsError);
      } else {
        setClients(clientsData.map(client => ({
          id: client.id,
          breederId: client.breeder_id,
          firstName: client.first_name,
          lastName: client.last_name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          city: client.city,
          state: client.state,
          zip: client.zip,
          country: client.country,
          status: client.status as "prospect" | "active" | "past",
          source: client.source,
          notes: client.notes,
          createdAt: client.created_at,
          updatedAt: client.updated_at
        })));
      }
    };

    fetchRelatedData();
  }, [user, supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle amount as a number
    if (name === "amount") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && initialData?.id) {
        // Update existing record
        const success = await updateRecord(initialData.id, formData);
        if (success) {
          toast({
            title: "Success",
            description: "Financial record updated successfully",
          });
          if (onSuccess) onSuccess();
        }
      } else {
        // Add new record
        const requiredFields = ["recordType", "category", "amount", "date"];
        const missingFields = requiredFields.filter(
          (field) => !formData[field as keyof typeof formData]
        );

        if (missingFields.length > 0) {
          toast({
            title: "Error",
            description: `Please fill in the required fields: ${missingFields.join(", ")}`,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const newRecord = await addRecord(formData as Omit<FinancialRecord, "id" | "breederId" | "createdAt" | "updatedAt">);
        if (newRecord) {
          toast({
            title: "Success",
            description: "Financial record added successfully",
          });
          if (onSuccess) onSuccess();
          else router.push("/dashboard/marketing/finances");
        }
      }
    } catch (error) {
      console.error("Error submitting financial record form:", error);
      toast({
        title: "Error",
        description: "Failed to save financial record",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define category options based on record type
  const getCategoryOptions = () => {
    if (formData.recordType === "income") {
      return [
        { value: "stud_fee", label: "Stud Fee" },
        { value: "puppy_sale", label: "Puppy Sale" },
        { value: "breeding_rights", label: "Breeding Rights" },
        { value: "training", label: "Training Services" },
        { value: "boarding", label: "Boarding" },
        { value: "other_income", label: "Other Income" },
      ];
    } else {
      return [
        { value: "food", label: "Food" },
        { value: "veterinary", label: "Veterinary Care" },
        { value: "supplies", label: "Supplies" },
        { value: "equipment", label: "Equipment" },
        { value: "registration", label: "Registration Fees" },
        { value: "show_fees", label: "Show Fees" },
        { value: "travel", label: "Travel" },
        { value: "marketing", label: "Marketing" },
        { value: "insurance", label: "Insurance" },
        { value: "other_expense", label: "Other Expense" },
      ];
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Financial Record" : "Add New Financial Record"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update financial record information"
              : "Enter information about the new financial transaction"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recordType">
                Record Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.recordType || "income"}
                onValueChange={(value) => handleSelectChange("recordType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getCategoryOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount || ""}
                  onChange={handleChange}
                  className="pl-7"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Enter details about this transaction..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="relatedDogId">Related Dog</Label>
              <Select
                value={formData.relatedDogId || ""}
                onValueChange={(value) => handleSelectChange("relatedDogId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a dog (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {dogs.map((dog) => (
                    <SelectItem key={dog.id} value={dog.id}>
                      {dog.name} ({dog.breed})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="relatedClientId">Related Client</Label>
              <Select
                value={formData.relatedClientId || ""}
                onValueChange={(value) => handleSelectChange("relatedClientId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiptUrl">Receipt URL</Label>
            <Input
              id="receiptUrl"
              name="receiptUrl"
              value={formData.receiptUrl || ""}
              onChange={handleChange}
              placeholder="Link to receipt image or document (optional)"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel || (() => router.back())}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Record" : "Add Record"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
