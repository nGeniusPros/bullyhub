"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicationForm } from "@/components/MedicationForm";

export default function AddMedicationPage() {
  const searchParams = useSearchParams();
  const dogId = searchParams.get("dogId") || undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Medication</h1>
        <p className="text-muted-foreground">
          Record a new medication for your dog
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medication Details</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicationForm dogId={dogId} />
        </CardContent>
      </Card>
    </div>
  );
}
