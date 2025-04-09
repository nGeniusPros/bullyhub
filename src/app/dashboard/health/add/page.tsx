"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthRecordForm } from "@/components/HealthRecordForm";

export default function AddHealthRecordPage() {
  const searchParams = useSearchParams();
  const dogId = searchParams.get("dogId") || undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Health Record</h1>
        <p className="text-muted-foreground">
          Record a new health event, examination, or procedure
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Record Details</CardTitle>
        </CardHeader>
        <CardContent>
          <HealthRecordForm dogId={dogId} />
        </CardContent>
      </Card>
    </div>
  );
}
