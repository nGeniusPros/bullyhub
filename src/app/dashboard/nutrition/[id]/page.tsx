"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Pill, 
  Utensils, 
  Edit, 
  Trash2,
  AlertCircle
} from "lucide-react";
import { MealPlan } from "@/types";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MealPlanDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    setDeleting(true);
    
    try {
      // In a real implementation, we would call the API to delete the meal plan
      // For now, we'll just simulate a successful deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Meal plan deleted successfully");
      router.push("/dashboard/nutrition");
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      toast.error("Failed to delete meal plan");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Function to get meal plan status badge
  const getMealPlanStatusBadge = (mealPlan: MealPlan) => {
    if (!mealPlan.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    
    const now = new Date();
    const startDate = new Date(mealPlan.startDate);
    const endDate = mealPlan.endDate ? new Date(mealPlan.endDate) : null;
    
    if (now < startDate) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>;
    }
    
    if (endDate && now > endDate) {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Completed</Badge>;
    }
    
    return <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Meal Plan Not Found</h1>
        <p className="text-muted-foreground mb-6">The meal plan you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/dashboard/nutrition")}>Back to Nutrition</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{mealPlan.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">{mealPlan.description}</p>
            {getMealPlanStatusBadge(mealPlan)}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/nutrition")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={() => router.push(`/dashboard/nutrition/edit/${mealPlan.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Meal Plan</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this meal plan? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meal Plan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{formatDate(mealPlan.startDate)}</span>
              </div>
            </div>
            
            {mealPlan.endDate && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{formatDate(mealPlan.endDate)}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <div className="flex items-center gap-2">
                {getMealPlanStatusBadge(mealPlan)}
              </div>
            </div>
          </div>

          <Tabs defaultValue="meals">
            <TabsList>
              <TabsTrigger value="meals">Meals ({mealPlan.meals.length})</TabsTrigger>
              <TabsTrigger value="supplements">Supplements ({mealPlan.supplements.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="meals" className="pt-4">
              <div className="space-y-4">
                {mealPlan.meals.map((meal) => (
                  <Card key={meal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{meal.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{meal.time}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-sm font-medium mb-2">Food Items</h3>
                      <div className="space-y-3">
                        {meal.foodItems.map((item) => (
                          <div key={item.id} className="border rounded-md p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {item.amount} {item.unit}
                                </p>
                              </div>
                              {(item.calories || item.protein || item.fat || item.carbs) && (
                                <div className="text-xs text-muted-foreground space-y-1">
                                  {item.calories && <div>Calories: {item.calories}</div>}
                                  {item.protein && <div>Protein: {item.protein}g</div>}
                                  {item.fat && <div>Fat: {item.fat}g</div>}
                                  {item.carbs && <div>Carbs: {item.carbs}g</div>}
                                </div>
                              )}
                            </div>
                            {item.notes && (
                              <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="supplements" className="pt-4">
              {mealPlan.supplements.length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No supplements in this meal plan.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {mealPlan.supplements.map((supplement) => (
                    <Card key={supplement.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{supplement.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Dosage</h3>
                            <p>{supplement.dosage}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Frequency</h3>
                            <p>{supplement.frequency}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Purpose</h3>
                            <p>{supplement.purpose}</p>
                          </div>
                        </div>
                        {supplement.notes && (
                          <div className="mt-4 pt-2 border-t">
                            <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                            <p className="text-sm">{supplement.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Utensils className="h-4 w-4" />
        <span>Last updated: {new Date(mealPlan.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
