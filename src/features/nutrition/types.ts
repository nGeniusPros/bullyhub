// Nutrition Feature - Types

/**
 * Meal Plan
 */
export interface MealPlan {
  id: string;
  dog_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  daily_calories?: number;
  meals: Meal[];
  created_at: string;
  updated_at: string;
}

/**
 * Meal
 */
export interface Meal {
  id: string;
  meal_plan_id: string;
  name: string;
  time_of_day: string;
  food_items: FoodItem[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Food Item
 */
export interface FoodItem {
  id: string;
  meal_id: string;
  name: string;
  amount: number;
  unit: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Meal Plan with Dog Information
 */
export interface MealPlanWithDog extends MealPlan {
  dog?: {
    id: string;
    name: string;
    breed: string;
    weight?: number;
  };
}

/**
 * Meal Plan Form Data
 */
export interface MealPlanFormData {
  dog_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  daily_calories?: number;
  meals: {
    name: string;
    time_of_day: string;
    food_items: {
      name: string;
      amount: number;
      unit: string;
      calories?: number;
      protein?: number;
      fat?: number;
      carbs?: number;
      notes?: string;
    }[];
    notes?: string;
  }[];
}

/**
 * Time of Day Options
 */
export const TIME_OF_DAY_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'noon', label: 'Noon' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' }
];

/**
 * Unit Options
 */
export const UNIT_OPTIONS = [
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'cup', label: 'Cups' },
  { value: 'tbsp', label: 'Tablespoons' },
  { value: 'tsp', label: 'Teaspoons' },
  { value: 'ml', label: 'Milliliters (ml)' },
  { value: 'l', label: 'Liters (l)' },
  { value: 'piece', label: 'Pieces' }
];
