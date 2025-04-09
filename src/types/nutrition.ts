// Nutrition types
export interface MealPlan {
  id: string;
  dogId: string;
  name: string;
  description: string;
  meals: Meal[];
  supplements: Supplement[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  mealPlanId: string;
  name: string;
  time: string;
  foodItems: FoodItem[];
  notes?: string;
}

export interface FoodItem {
  id: string;
  mealId: string;
  name: string;
  amount: string;
  unit: "cups" | "grams" | "ounces" | "tablespoons" | "teaspoons" | "pieces";
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  notes?: string;
}

export interface Supplement {
  id: string;
  mealPlanId: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  notes?: string;
}

export interface NutritionGuide {
  id: string;
  title: string;
  description: string;
  content: string;
  category: "general" | "puppy" | "adult" | "senior" | "special-needs";
  tags: string[];
  createdAt: string;
}

export interface DietaryRestriction {
  id: string;
  dogId: string;
  type: "allergy" | "intolerance" | "medical" | "preference";
  item: string;
  severity: "mild" | "moderate" | "severe";
  notes?: string;
  diagnosedDate?: string;
  createdAt: string;
}
