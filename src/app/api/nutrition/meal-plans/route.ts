import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { MealPlan } from "@/types";

// Mock data for meal plans
const mockMealPlans: MealPlan[] = [
  {
    id: "1",
    dogId: "1",
    name: "Adult Maintenance Diet",
    description: "Balanced diet for adult English Bulldog",
    meals: [
      {
        id: "m1",
        mealPlanId: "1",
        name: "Breakfast",
        time: "08:00",
        foodItems: [
          {
            id: "f1",
            mealId: "m1",
            name: "Premium Kibble",
            amount: "1",
            unit: "cups",
            calories: 350,
            protein: 25,
            fat: 15,
            carbs: 40,
          },
          {
            id: "f2",
            mealId: "m1",
            name: "Wet Food",
            amount: "1/4",
            unit: "cups",
            calories: 100,
            protein: 8,
            fat: 5,
            carbs: 10,
          },
        ],
      },
      {
        id: "m2",
        mealPlanId: "1",
        name: "Dinner",
        time: "18:00",
        foodItems: [
          {
            id: "f3",
            mealId: "m2",
            name: "Premium Kibble",
            amount: "1",
            unit: "cups",
            calories: 350,
            protein: 25,
            fat: 15,
            carbs: 40,
          },
          {
            id: "f4",
            mealId: "m2",
            name: "Cooked Chicken",
            amount: "2",
            unit: "ounces",
            calories: 120,
            protein: 22,
            fat: 3,
            carbs: 0,
          },
        ],
      },
    ],
    supplements: [
      {
        id: "s1",
        mealPlanId: "1",
        name: "Joint Supplement",
        dosage: "1 tablet",
        frequency: "daily",
        purpose: "Support joint health",
      },
      {
        id: "s2",
        mealPlanId: "1",
        name: "Omega-3 Oil",
        dosage: "1 teaspoon",
        frequency: "daily",
        purpose: "Skin and coat health",
      },
    ],
    startDate: "2023-10-01",
    isActive: true,
    createdAt: "2023-10-01T10:00:00Z",
    updatedAt: "2023-10-01T10:00:00Z",
  },
  {
    id: "2",
    dogId: "2",
    name: "Puppy Growth Diet",
    description: "Nutrient-rich diet for French Bulldog puppy",
    meals: [
      {
        id: "m3",
        mealPlanId: "2",
        name: "Morning",
        time: "07:00",
        foodItems: [
          {
            id: "f5",
            mealId: "m3",
            name: "Puppy Formula Kibble",
            amount: "1/2",
            unit: "cups",
            calories: 200,
            protein: 28,
            fat: 18,
            carbs: 35,
          },
        ],
      },
      {
        id: "m4",
        mealPlanId: "2",
        name: "Midday",
        time: "12:00",
        foodItems: [
          {
            id: "f6",
            mealId: "m4",
            name: "Puppy Formula Kibble",
            amount: "1/2",
            unit: "cups",
            calories: 200,
            protein: 28,
            fat: 18,
            carbs: 35,
          },
        ],
      },
      {
        id: "m5",
        mealPlanId: "2",
        name: "Evening",
        time: "17:00",
        foodItems: [
          {
            id: "f7",
            mealId: "m5",
            name: "Puppy Formula Kibble",
            amount: "1/2",
            unit: "cups",
            calories: 200,
            protein: 28,
            fat: 18,
            carbs: 35,
          },
          {
            id: "f8",
            mealId: "m5",
            name: "Puppy Wet Food",
            amount: "2",
            unit: "tablespoons",
            calories: 50,
            protein: 7,
            fat: 4,
            carbs: 5,
          },
        ],
      },
    ],
    supplements: [
      {
        id: "s3",
        mealPlanId: "2",
        name: "DHA Supplement",
        dosage: "1/2 teaspoon",
        frequency: "daily",
        purpose: "Brain development",
      },
      {
        id: "s4",
        mealPlanId: "2",
        name: "Calcium Supplement",
        dosage: "1/4 teaspoon",
        frequency: "daily",
        purpose: "Bone development",
      },
    ],
    startDate: "2023-11-15",
    isActive: true,
    createdAt: "2023-11-15T09:30:00Z",
    updatedAt: "2023-11-15T09:30:00Z",
  },
  {
    id: "3",
    dogId: "3",
    name: "Weight Management Diet",
    description: "Calorie-controlled diet for weight loss",
    meals: [
      {
        id: "m6",
        mealPlanId: "3",
        name: "Breakfast",
        time: "08:00",
        foodItems: [
          {
            id: "f9",
            mealId: "m6",
            name: "Weight Management Kibble",
            amount: "3/4",
            unit: "cups",
            calories: 250,
            protein: 30,
            fat: 10,
            carbs: 35,
          },
          {
            id: "f10",
            mealId: "m6",
            name: "Green Beans",
            amount: "1/4",
            unit: "cups",
            calories: 15,
            protein: 1,
            fat: 0,
            carbs: 3,
          },
        ],
      },
      {
        id: "m7",
        mealPlanId: "3",
        name: "Dinner",
        time: "18:00",
        foodItems: [
          {
            id: "f11",
            mealId: "m7",
            name: "Weight Management Kibble",
            amount: "3/4",
            unit: "cups",
            calories: 250,
            protein: 30,
            fat: 10,
            carbs: 35,
          },
          {
            id: "f12",
            mealId: "m7",
            name: "Carrots",
            amount: "1/4",
            unit: "cups",
            calories: 25,
            protein: 1,
            fat: 0,
            carbs: 6,
          },
        ],
      },
    ],
    supplements: [
      {
        id: "s5",
        mealPlanId: "3",
        name: "L-Carnitine",
        dosage: "1 tablet",
        frequency: "daily",
        purpose: "Support fat metabolism",
      },
    ],
    startDate: "2023-09-01",
    endDate: "2024-03-01",
    isActive: true,
    createdAt: "2023-09-01T14:00:00Z",
    updatedAt: "2023-09-01T14:00:00Z",
  },
];

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get URL parameters
    const url = new URL(request.url);
    const dogId = url.searchParams.get("dogId");

    // Filter meal plans by dog ID if provided
    let filteredMealPlans = mockMealPlans;
    if (dogId) {
      filteredMealPlans = mockMealPlans.filter((plan) => plan.dogId === dogId);
    }

    return NextResponse.json(filteredMealPlans);
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const mealPlanData = await request.json();

    // In a real implementation, we would save to the database
    // For now, just return a success response with the mock data
    return NextResponse.json({
      ...mealPlanData,
      id: `new-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating meal plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
