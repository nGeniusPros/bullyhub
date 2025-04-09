"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealPlanForm } from "@/components/MealPlanForm";
import { toast } from "sonner";
import { MealPlan } from "@/types";

export default function EditMealPlanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        // In a real implementation, we would fetch from the API
        // For now, we'll fetch all meal plans and filter
        const response = await fetch("/api/nutrition/meal-plans");
        if (!response.ok) {
          throw new Error("Failed to fetch meal plans");
        }
        
        const mealPlans = await response.json();
        const foundMealPlan = mealPlans.find((p: MealPlan) => p.id === params.id);
        
        if (foundMealPlan) {
          setMealPlan(foundMealPlan);
        } else {
          toast.error("Meal plan not found");
          router.push("/dashboard/nutrition");
        }
      } catch (error) {
        console.error("Error fetching meal plan:", error);
        toast.error("Failed to load meal plan");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMealPlan();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!mealPlan) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Meal Plan</h1>
        <p className="text-muted-foreground">
          Update the meal plan for your dog
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meal Plan Details</CardTitle>
        </CardHeader>
        <CardContent>
          <MealPlanForm existingPlan={mealPlan} dogId={mealPlan.dogId} />
        </CardContent>
      </Card>
    </div>
  );
}
