"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus,
  UtensilsCrossed,
  Search,
  Calendar,
  Clock,
  Pill,
  Apple,
  Beef,
  Fish,
  Egg,
  Carrot,
  Utensils,
  AlertCircle,
  FileText,
  BookOpen,
} from "lucide-react";
import { MealPlan, NutritionGuide } from "@/types";

interface DogWithNutritionData {
  id: string;
  name: string;
  breed: string;
  mealPlans: MealPlan[];
}

export default function NutritionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "meal-plans" | "guides" | "restrictions"
  >("meal-plans");
  const [dogs, setDogs] = useState<DogWithNutritionData[]>([]);
  const [nutritionGuides, setNutritionGuides] = useState<NutritionGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDog, setSelectedDog] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dogs
        const dogsResponse = await fetch("/api/dogs");
        if (!dogsResponse.ok) {
          throw new Error("Failed to fetch dogs");
        }
        const dogsData = (await dogsResponse.ok)
          ? await dogsResponse.json()
          : [];

        // For each dog, fetch meal plans
        const dogsWithNutrition = await Promise.all(
          dogsData.map(async (dog: any) => {
            const mealPlansResponse = await fetch(
              `/api/nutrition/meal-plans?dogId=${dog.id}`
            );
            const mealPlansData = mealPlansResponse.ok
              ? await mealPlansResponse.json()
              : [];

            return {
              ...dog,
              mealPlans: mealPlansData,
            };
          })
        );

        setDogs(dogsWithNutrition);
        if (dogsWithNutrition.length > 0) {
          setSelectedDog(dogsWithNutrition[0].id);
        }

        // Fetch nutrition guides
        const guidesResponse = await fetch("/api/nutrition/guides");
        if (guidesResponse.ok) {
          const guidesData = await guidesResponse.json();
          setNutritionGuides(guidesData);
        }
      } catch (error) {
        console.error("Error fetching nutrition data:", error);
        toast.error("Failed to load nutrition data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get the selected dog's data
  const selectedDogData = dogs.find((dog) => dog.id === selectedDog);

  // Filter meal plans based on search term
  const filteredMealPlans =
    selectedDogData?.mealPlans.filter(
      (plan) =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Filter nutrition guides based on search term and category
  const filteredGuides = nutritionGuides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || guide.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Upcoming
        </Badge>
      );
    }

    if (endDate && now > endDate) {
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200"
        >
          Completed
        </Badge>
      );
    }

    return (
      <Badge
        variant="default"
        className="bg-green-100 text-green-700 border-green-200"
      >
        Active
      </Badge>
    );
  };

  // Function to get guide category badge
  const getGuideCategoryBadge = (category: string) => {
    switch (category) {
      case "puppy":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Puppy
          </Badge>
        );
      case "adult":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Adult
          </Badge>
        );
      case "senior":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Senior
          </Badge>
        );
      case "special-needs":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            Special Needs
          </Badge>
        );
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nutrition</h1>
          <p className="text-muted-foreground">
            Manage your dogs' diet and meal plans
          </p>
        </div>
        <Link href="/dashboard/nutrition/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Meal Plan
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : dogs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Dogs Found</h3>
            <p className="text-muted-foreground mb-4">
              You need to add a dog before you can create meal plans.
            </p>
            <Link href="/dashboard/dogs/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Dog
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="w-full sm:w-auto">
              <Select value={selectedDog} onValueChange={setSelectedDog}>
                <SelectTrigger className="w-full sm:w-[200px]">
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

            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search nutrition plans..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            defaultValue="meal-plans"
            value={activeTab}
            onValueChange={setActiveTab as any}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
              <TabsTrigger value="guides">Nutrition Guides</TabsTrigger>
              <TabsTrigger value="restrictions">
                Dietary Restrictions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="meal-plans">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Meal Plans</h2>
                <Link
                  href={`/dashboard/nutrition/add${
                    selectedDog ? `?dogId=${selectedDog}` : ""
                  }`}
                >
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Meal Plan
                  </Button>
                </Link>
              </div>

              {filteredMealPlans.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Utensils className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Meal Plans</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm
                        ? "No meal plans match your search criteria."
                        : "Add your first meal plan to start tracking your dog's nutrition."}
                    </p>
                    {!searchTerm && (
                      <Link
                        href={`/dashboard/nutrition/add${
                          selectedDog ? `?dogId=${selectedDog}` : ""
                        }`}
                      >
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Meal Plan
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredMealPlans.map((mealPlan) => (
                    <Card
                      key={mealPlan.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{mealPlan.name}</CardTitle>
                            <CardDescription>
                              {mealPlan.description}
                            </CardDescription>
                          </div>
                          {getMealPlanStatusBadge(mealPlan)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                Started: {formatDate(mealPlan.startDate)}
                              </span>
                            </div>
                            {mealPlan.endDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  Ends: {formatDate(mealPlan.endDate)}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{mealPlan.meals.length} meals per day</span>
                            </div>
                            {mealPlan.supplements.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Pill className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {mealPlan.supplements.length} supplements
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {mealPlan.meals.map((meal) => (
                              <div
                                key={meal.id}
                                className="border rounded-md p-3"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">
                                    {meal.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {meal.time}
                                  </span>
                                </div>
                                <ul className="text-sm space-y-1">
                                  {meal.foodItems.map((item) => (
                                    <li
                                      key={item.id}
                                      className="flex items-center gap-1"
                                    >
                                      <span>
                                        {item.amount} {item.unit} {item.name}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex justify-end w-full gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/dashboard/nutrition/${mealPlan.id}`)
                            }
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/dashboard/nutrition/edit/${mealPlan.id}`
                              )
                            }
                          >
                            Edit
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="guides">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Nutrition Guides</h2>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="puppy">Puppy</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="special-needs">Special Needs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredGuides.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Guides Found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || selectedCategory !== "all"
                        ? "No guides match your search criteria."
                        : "Nutrition guides will be available soon."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGuides.map((guide) => (
                    <Card
                      key={guide.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {guide.title}
                          </CardTitle>
                          {getGuideCategoryBadge(guide.category)}
                        </div>
                        <CardDescription>{guide.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="line-clamp-3 text-sm text-muted-foreground">
                          {guide.content.substring(0, 150)}...
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            router.push(
                              `/dashboard/nutrition/guides/${guide.id}`
                            )
                          }
                        >
                          Read Guide
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="restrictions">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Dietary Restrictions</h2>
                <Button size="sm" disabled>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Restriction (Coming Soon)
                </Button>
              </div>

              <Card>
                <CardContent className="py-8 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    Dietary restrictions tracking will be available in a future
                    update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
