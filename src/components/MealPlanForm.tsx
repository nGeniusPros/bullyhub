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

interface Dog {
  id: string;
  name: string;
}

interface MealPlanFormProps {
  dogId?: string;
  onSuccess?: () => void;
  existingPlan?: any;
}

export function MealPlanForm({ dogId, onSuccess, existingPlan }: MealPlanFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDogId, setSelectedDogId] = useState<string>(dogId || "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    existingPlan ? new Date(existingPlan.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    existingPlan?.endDate ? new Date(existingPlan.endDate) : undefined
  );
  const [name, setName] = useState<string>(existingPlan?.name || "");
  const [description, setDescription] = useState<string>(existingPlan?.description || "");
  const [isActive, setIsActive] = useState<boolean>(existingPlan?.isActive !== false);
  const [meals, setMeals] = useState<any[]>(existingPlan?.meals || [
    {
      id: `meal-${Date.now()}-1`,
      name: "Breakfast",
      time: "08:00",
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
    },
  ]);
  const [supplements, setSupplements] = useState<any[]>(existingPlan?.supplements || [
    {
      id: `supp-${Date.now()}-1`,
      name: "",
      dosage: "",
      frequency: "",
      purpose: "",
      notes: "",
    },
  ]);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await fetch("/api/dogs");
        if (!response.ok) {
          throw new Error("Failed to fetch dogs");
        }
        const data = await response.json();
        setDogs(data);
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
        time: "",
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

  const addSupplement = () => {
    setSupplements([
      ...supplements,
      {
        id: `supp-${Date.now()}`,
        name: "",
        dosage: "",
        frequency: "",
        purpose: "",
        notes: "",
      },
    ]);
  };

  const removeSupplement = (supplementId: string) => {
    setSupplements(supplements.filter((supplement) => supplement.id !== supplementId));
  };

  const updateSupplement = (supplementId: string, field: string, value: string) => {
    setSupplements(
      supplements.map((supplement) => {
        if (supplement.id === supplementId) {
          return { ...supplement, [field]: value };
        }
        return supplement;
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
      if (!meal.name || !meal.time) {
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

    // Validate supplements
    for (const supplement of supplements) {
      if (!supplement.name || !supplement.dosage || !supplement.frequency) {
        toast.error("Please complete all supplement information");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const mealPlanData = {
        dogId: selectedDogId,
        name,
        description,
        meals,
        supplements,
        startDate: startDate.toISOString(),
        endDate: endDate ? endDate.toISOString() : undefined,
        isActive,
      };

      const url = existingPlan
        ? `/api/nutrition/meal-plans/${existingPlan.id}`
        : "/api/nutrition/meal-plans";

      const method = existingPlan ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealPlanData),
      });

      if (!response.ok) {
        throw new Error("Failed to save meal plan");
      }

      toast.success(`Meal plan ${existingPlan ? "updated" : "created"} successfully`);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/nutrition");
      }
    } catch (error) {
      console.error("Error saving meal plan:", error);
      toast.error("Failed to save meal plan");
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
              disabled={!!dogId}
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

      <Tabs defaultValue="meals" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meals">Meals</TabsTrigger>
          <TabsTrigger value="supplements">Supplements</TabsTrigger>
        </TabsList>

        <TabsContent value="meals" className="space-y-4 pt-4">
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
                    <Label htmlFor={`meal-time-${meal.id}`}>Time</Label>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={`meal-time-${meal.id}`}
                        type="time"
                        value={meal.time}
                        onChange={(e) =>
                          updateMeal(meal.id, "time", e.target.value)
                        }
                      />
                    </div>
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
                            <SelectItem value="cups">Cups</SelectItem>
                            <SelectItem value="grams">Grams</SelectItem>
                            <SelectItem value="ounces">Ounces</SelectItem>
                            <SelectItem value="tablespoons">
                              Tablespoons
                            </SelectItem>
                            <SelectItem value="teaspoons">Teaspoons</SelectItem>
                            <SelectItem value="pieces">Pieces</SelectItem>
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
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={addMeal} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Another Meal
          </Button>
        </TabsContent>

        <TabsContent value="supplements" className="space-y-4 pt-4">
          {supplements.map((supplement, index) => (
            <Card key={supplement.id}>
              <CardHeader className="bg-muted/50 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Supplement {index + 1}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSupplement(supplement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`supp-name-${supplement.id}`}>Name</Label>
                    <Input
                      id={`supp-name-${supplement.id}`}
                      placeholder="e.g., Joint Supplement"
                      value={supplement.name}
                      onChange={(e) =>
                        updateSupplement(
                          supplement.id,
                          "name",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`supp-dosage-${supplement.id}`}>
                      Dosage
                    </Label>
                    <Input
                      id={`supp-dosage-${supplement.id}`}
                      placeholder="e.g., 1 tablet"
                      value={supplement.dosage}
                      onChange={(e) =>
                        updateSupplement(
                          supplement.id,
                          "dosage",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`supp-frequency-${supplement.id}`}>
                      Frequency
                    </Label>
                    <Input
                      id={`supp-frequency-${supplement.id}`}
                      placeholder="e.g., daily"
                      value={supplement.frequency}
                      onChange={(e) =>
                        updateSupplement(
                          supplement.id,
                          "frequency",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`supp-purpose-${supplement.id}`}>
                      Purpose
                    </Label>
                    <Input
                      id={`supp-purpose-${supplement.id}`}
                      placeholder="e.g., Support joint health"
                      value={supplement.purpose}
                      onChange={(e) =>
                        updateSupplement(
                          supplement.id,
                          "purpose",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`supp-notes-${supplement.id}`}>
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id={`supp-notes-${supplement.id}`}
                    placeholder="Additional information about this supplement"
                    value={supplement.notes}
                    onChange={(e) =>
                      updateSupplement(
                        supplement.id,
                        "notes",
                        e.target.value
                      )
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addSupplement}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Another Supplement
          </Button>
        </TabsContent>
      </Tabs>

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
