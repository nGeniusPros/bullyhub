"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealPlanForm } from "@/features/nutrition/components/MealPlanForm";

export default function AddMealPlanPage() {
  const searchParams = useSearchParams();
  const dogId = searchParams.get("dogId") || undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Meal Plan</h1>
        <p className="text-muted-foreground">
          Create a customized meal plan for your dog
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meal Plan Details</CardTitle>
        </CardHeader>
        <CardContent>
          <MealPlanForm dogId={dogId} />
        </CardContent>
      </Card>
    </div>
  );
}
