"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicationForm } from "@/components/MedicationForm";
import { toast } from "sonner";

export default function EditMedicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [medication, setMedication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedication = async () => {
      try {
        const response = await fetch(`/api/medications/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch medication");
        }
        
        const data = await response.json();
        setMedication(data);
      } catch (error) {
        console.error("Error fetching medication:", error);
        toast.error("Failed to load medication");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedication();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Medication Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The medication you're looking for doesn't exist or you don't have permission
          to view it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Medication</h1>
        <p className="text-muted-foreground">
          Update medication details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medication Details</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicationForm
            dogId={medication.dog_id}
            existingMedication={medication}
          />
        </CardContent>
      </Card>
    </div>
  );
}
