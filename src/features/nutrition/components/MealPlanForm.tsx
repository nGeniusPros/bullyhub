"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Plus, Trash2, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useNutritionQueries } from "../data/queries";
import { useDogQueries } from "@/features/dogs/data/queries";
import { MealPlan, MealPlanFormData, UNIT_OPTIONS, TIME_OF_DAY_OPTIONS } from "../types";

interface Dog {
  id: string;
  name: string;
}

interface MealPlanFormProps {
  dogId?: string;
  onSuccess?: () => void;
  existingPlan?: MealPlan;
}

export function MealPlanForm({ dogId, onSuccess, existingPlan }: MealPlanFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDogId, setSelectedDogId] = useState<string>(dogId || "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    existingPlan ? new Date(existingPlan.start_date) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    existingPlan?.end_date ? new Date(existingPlan.end_date) : undefined
  );
  const [name, setName] = useState<string>(existingPlan?.name || "");
  const [description, setDescription] = useState<string>(existingPlan?.description || "");
  const [dailyCalories, setDailyCalories] = useState<string>(existingPlan?.daily_calories?.toString() || "");
  const [isActive, setIsActive] = useState<boolean>(true);
  
  // Initialize meals from existing plan or create default
  const [meals, setMeals] = useState<any[]>(() => {
    if (existingPlan?.meals && existingPlan.meals.length > 0) {
      return existingPlan.meals.map(meal => ({
        id: meal.id,
        name: meal.name,
        time_of_day: meal.time_of_day,
        notes: meal.notes || "",
        foodItems: meal.food_items.map(item => ({
          id: item.id,
          name: item.name,
          amount: item.amount.toString(),
          unit: item.unit,
          calories: item.calories?.toString() || "",
          protein: item.protein?.toString() || "",
          fat: item.fat?.toString() || "",
          carbs: item.carbs?.toString() || "",
          notes: item.notes || ""
        }))
      }));
    } else {
      return [
        {
          id: `meal-${Date.now()}-1`,
          name: "Breakfast",
          time_of_day: "morning",
          notes: "",
          foodItems: [
            {
              id: `food-${Date.now()}-1`,
              name: "",
              amount: "",
              unit: "cups",
              calories: "",
              protein: "",
              fat: "",
              carbs: "",
              notes: "",
            },
          ],
        }
      ];
    }
  });

  // Get the queries
  const nutritionQueries = useNutritionQueries();
  const dogQueries = useDogQueries();

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const fetchedDogs = await dogQueries.getAllDogs();
        setDogs(fetchedDogs.map(dog => ({ id: dog.id, name: dog.name })));
      } catch (error) {
        console.error("Error fetching dogs:", error);
        toast.error("Failed to load dogs");
      }
    };

    fetchDogs();
  }, []);

  const addMeal = () => {
    setMeals([
      ...meals,
      {
        id: `meal-${Date.now()}`,
        name: "",
        time_of_day: "",
        notes: "",
        foodItems: [
          {
            id: `food-${Date.now()}`,
            name: "",
            amount: "",
            unit: "cups",
            calories: "",
            protein: "",
            fat: "",
            carbs: "",
            notes: "",
          },
        ],
      },
    ]);
  };

  const removeMeal = (mealId: string) => {
    setMeals(meals.filter((meal) => meal.id !== mealId));
  };

  const updateMeal = (mealId: string, field: string, value: string) => {
    setMeals(
      meals.map((meal) => {
        if (meal.id === mealId) {
          return { ...meal, [field]: value };
        }
        return meal;
      })
    );
  };

  const addFoodItem = (mealId: string) => {
    setMeals(
      meals.map((meal) => {
        if (meal.id === mealId) {
          return {
            ...meal,
            foodItems: [
              ...meal.foodItems,
              {
                id: `food-${Date.now()}`,
                name: "",
                amount: "",
                unit: "cups",
                calories: "",
                protein: "",
                fat: "",
                carbs: "",
                notes: "",
              },
            ],
          };
        }
        return meal;
      })
    );
  };

  const removeFoodItem = (mealId: string, foodItemId: string) => {
    setMeals(
      meals.map((meal) => {
        if (meal.id === mealId) {
          return {
            ...meal,
            foodItems: meal.foodItems.filter((item: any) => item.id !== foodItemId),
          };
        }
        return meal;
      })
    );
  };

  const updateFoodItem = (mealId: string, foodItemId: string, field: string, value: string) => {
    setMeals(
      meals.map((meal) => {
        if (meal.id === mealId) {
          return {
            ...meal,
            foodItems: meal.foodItems.map((item: any) => {
              if (item.id === foodItemId) {
                return { ...item, [field]: value };
              }
              return item;
            }),
          };
        }
        return meal;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDogId) {
      toast.error("Please select a dog");
      return;
    }

    if (!name) {
      toast.error("Please enter a meal plan name");
      return;
    }

    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }

    // Validate meals
    for (const meal of meals) {
      if (!meal.name || !meal.time_of_day) {
        toast.error("Please complete all meal information");
        return;
      }

      for (const foodItem of meal.foodItems) {
        if (!foodItem.name || !foodItem.amount || !foodItem.unit) {
          toast.error("Please complete all food item information");
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      // Format the meal plan data for the API
      const formattedMeals = meals.map(meal => ({
        name: meal.name,
        time_of_day: meal.time_of_day,
        notes: meal.notes,
        food_items: meal.foodItems.map((item: any) => ({
          name: item.name,
          amount: parseFloat(item.amount),
          unit: item.unit,
          calories: item.calories ? parseFloat(item.calories) : undefined,
          protein: item.protein ? parseFloat(item.protein) : undefined,
          fat: item.fat ? parseFloat(item.fat) : undefined,
          carbs: item.carbs ? parseFloat(item.carbs) : undefined,
          notes: item.notes
        }))
      }));

      const mealPlanData: MealPlanFormData = {
        dog_id: selectedDogId,
        name,
        description,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate ? endDate.toISOString().split("T")[0] : undefined,
        daily_calories: dailyCalories ? parseFloat(dailyCalories) : undefined,
        meals: formattedMeals
      };

      if (existingPlan) {
        // Update existing plan
        await nutritionQueries.updateMealPlan(existingPlan.id, mealPlanData);
      } else {
        // Create new plan
        await nutritionQueries.createMealPlan(mealPlanData);
      }

      toast.success(`Meal plan ${existingPlan ? "updated" : "created"} successfully`);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/nutrition");
      }
    } catch (error) {
      console.error("Error saving meal plan:", error);
      toast.error(`Failed to ${existingPlan ? "update" : "create"} meal plan`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dogId">Dog</Label>
            <Select
              value={selectedDogId}
              onValueChange={setSelectedDogId}
              disabled={!!dogId || isSubmitting}
            >
              <SelectTrigger id="dogId">
                <SelectValue placeholder="Select a dog" />
              </SelectTrigger>
              <SelectContent>
                {dogs.map((dog) => (
                  <SelectItem key={dog.id} value={dog.id}>
                    {dog.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Meal Plan Name</Label>
            <Input
              id="name"
              placeholder="e.g., Adult Maintenance Diet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this meal plan"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dailyCalories">Daily Calories (Optional)</Label>
            <Input
              id="dailyCalories"
              type="number"
              placeholder="e.g., 1200"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) =>
                      startDate ? date < startDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive">Active Meal Plan</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Meals</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMeal}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Meal
          </Button>
        </div>

        {meals.map((meal, index) => (
          <Card key={meal.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Meal {index + 1}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMeal(meal.id)}
                  disabled={meals.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`meal-name-${meal.id}`}>Meal Name</Label>
                  <Input
                    id={`meal-name-${meal.id}`}
                    placeholder="e.g., Breakfast"
                    value={meal.name}
                    onChange={(e) =>
                      updateMeal(meal.id, "name", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`meal-time-${meal.id}`}>Time of Day</Label>
                  <Select
                    value={meal.time_of_day}
                    onValueChange={(value) => updateMeal(meal.id, "time_of_day", value)}
                  >
                    <SelectTrigger id={`meal-time-${meal.id}`}>
                      <SelectValue placeholder="Select time of day" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OF_DAY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Food Items</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addFoodItem(meal.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Food Item
                  </Button>
                </div>

                {meal.foodItems.map((foodItem: any, foodIndex: number) => (
                  <div
                    key={foodItem.id}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-3 border rounded-md"
                  >
                    <div className="space-y-1 lg:col-span-4">
                      <div className="flex justify-between items-center">
                        <Label
                          htmlFor={`food-name-${foodItem.id}`}
                          className="text-sm"
                        >
                          Food Name
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removeFoodItem(meal.id, foodItem.id)
                          }
                          disabled={meal.foodItems.length === 1}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Input
                        id={`food-name-${foodItem.id}`}
                        placeholder="e.g., Premium Kibble"
                        value={foodItem.name}
                        onChange={(e) =>
                          updateFoodItem(
                            meal.id,
                            foodItem.id,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor={`food-amount-${foodItem.id}`}
                        className="text-sm"
                      >
                        Amount
                      </Label>
                      <Input
                        id={`food-amount-${foodItem.id}`}
                        placeholder="e.g., 1"
                        value={foodItem.amount}
                        onChange={(e) =>
                          updateFoodItem(
                            meal.id,
                            foodItem.id,
                            "amount",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor={`food-unit-${foodItem.id}`}
                        className="text-sm"
                      >
                        Unit
                      </Label>
                      <Select
                        value={foodItem.unit}
                        onValueChange={(value) =>
                          updateFoodItem(
                            meal.id,
                            foodItem.id,
                            "unit",
                            value
                          )
                        }
                      >
                        <SelectTrigger id={`food-unit-${foodItem.id}`}>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {UNIT_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor={`food-calories-${foodItem.id}`}
                        className="text-sm"
                      >
                        Calories (Optional)
                      </Label>
                      <Input
                        id={`food-calories-${foodItem.id}`}
                        placeholder="e.g., 350"
                        value={foodItem.calories}
                        onChange={(e) =>
                          updateFoodItem(
                            meal.id,
                            foodItem.id,
                            "calories",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`meal-notes-${meal.id}`}>Notes (Optional)</Label>
                <Textarea
                  id={`meal-notes-${meal.id}`}
                  placeholder="Additional notes about this meal"
                  value={meal.notes}
                  onChange={(e) => updateMeal(meal.id, "notes", e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/nutrition")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
              Saving...
            </>
          ) : existingPlan ? (
            "Update Meal Plan"
          ) : (
            "Create Meal Plan"
          )}
        </Button>
      </div>
    </form>
  );
}
