// Nutrition Feature - Supabase Queries
import { createClient } from "@/lib/supabase-server";
import { createClient as createBrowserClient } from "@/lib/supabase-browser";
import { MealPlan, MealPlanWithDog, MealPlanFormData } from "../types";

/**
 * Server-side queries (for use in Netlify functions and server components)
 */
export const nutritionQueries = {
  /**
   * Get all meal plans for a dog
   * @param dogId - The ID of the dog
   * @returns Array of meal plans
   */
  getDogMealPlans: async (dogId: string): Promise<MealPlan[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("meal_plans")
      .select(`
        *,
        meals:meals(
          *,
          food_items:food_items(*)
        )
      `)
      .eq("dog_id", dogId)
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Error fetching meal plans:", error);
      throw new Error(`Failed to fetch meal plans: ${error.message}`);
    }

    return data as MealPlan[];
  },

  /**
   * Get a meal plan by ID
   * @param planId - The ID of the meal plan
   * @returns Meal plan with dog information
   */
  getMealPlanById: async (planId: string): Promise<MealPlanWithDog | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("meal_plans")
      .select(`
        *,
        dog:dogs(id, name, breed, weight),
        meals:meals(
          *,
          food_items:food_items(*)
        )
      `)
      .eq("id", planId)
      .single();

    if (error) {
      console.error("Error fetching meal plan:", error);
      throw new Error(`Failed to fetch meal plan: ${error.message}`);
    }

    if (!data) return null;

    return data as MealPlanWithDog;
  },

  /**
   * Create a new meal plan
   * @param mealPlanData - The meal plan data to create
   * @returns The created meal plan
   */
  createMealPlan: async (mealPlanData: MealPlanFormData): Promise<MealPlan> => {
    const supabase = createClient();
    
    // Start a transaction
    const { data: mealPlan, error: mealPlanError } = await supabase
      .from("meal_plans")
      .insert({
        dog_id: mealPlanData.dog_id,
        name: mealPlanData.name,
        description: mealPlanData.description,
        start_date: mealPlanData.start_date,
        end_date: mealPlanData.end_date,
        daily_calories: mealPlanData.daily_calories
      })
      .select()
      .single();
    
    if (mealPlanError) {
      console.error("Error creating meal plan:", mealPlanError);
      throw new Error(`Failed to create meal plan: ${mealPlanError.message}`);
    }
    
    // Create meals
    for (const mealData of mealPlanData.meals) {
      const { data: meal, error: mealError } = await supabase
        .from("meals")
        .insert({
          meal_plan_id: mealPlan.id,
          name: mealData.name,
          time_of_day: mealData.time_of_day,
          notes: mealData.notes
        })
        .select()
        .single();
      
      if (mealError) {
        console.error("Error creating meal:", mealError);
        throw new Error(`Failed to create meal: ${mealError.message}`);
      }
      
      // Create food items
      for (const foodItemData of mealData.food_items) {
        const { error: foodItemError } = await supabase
          .from("food_items")
          .insert({
            meal_id: meal.id,
            name: foodItemData.name,
            amount: foodItemData.amount,
            unit: foodItemData.unit,
            calories: foodItemData.calories,
            protein: foodItemData.protein,
            fat: foodItemData.fat,
            carbs: foodItemData.carbs,
            notes: foodItemData.notes
          });
        
        if (foodItemError) {
          console.error("Error creating food item:", foodItemError);
          throw new Error(`Failed to create food item: ${foodItemError.message}`);
        }
      }
    }
    
    // Get the complete meal plan with all related data
    return await nutritionQueries.getMealPlanById(mealPlan.id) as MealPlan;
  },

  /**
   * Update a meal plan
   * @param planId - The ID of the meal plan to update
   * @param mealPlanData - The meal plan data to update
   * @returns The updated meal plan
   */
  updateMealPlan: async (planId: string, mealPlanData: Partial<MealPlanFormData>): Promise<MealPlan> => {
    const supabase = createClient();
    
    // Update the meal plan
    const { error: mealPlanError } = await supabase
      .from("meal_plans")
      .update({
        name: mealPlanData.name,
        description: mealPlanData.description,
        start_date: mealPlanData.start_date,
        end_date: mealPlanData.end_date,
        daily_calories: mealPlanData.daily_calories
      })
      .eq("id", planId);
    
    if (mealPlanError) {
      console.error("Error updating meal plan:", mealPlanError);
      throw new Error(`Failed to update meal plan: ${mealPlanError.message}`);
    }
    
    // If meals are provided, update them
    if (mealPlanData.meals) {
      // Get existing meals
      const { data: existingMeals, error: mealsError } = await supabase
        .from("meals")
        .select("id")
        .eq("meal_plan_id", planId);
      
      if (mealsError) {
        console.error("Error fetching existing meals:", mealsError);
        throw new Error(`Failed to fetch existing meals: ${mealsError.message}`);
      }
      
      // Delete existing meals (cascade will delete food items)
      if (existingMeals.length > 0) {
        const { error: deleteError } = await supabase
          .from("meals")
          .delete()
          .eq("meal_plan_id", planId);
        
        if (deleteError) {
          console.error("Error deleting existing meals:", deleteError);
          throw new Error(`Failed to delete existing meals: ${deleteError.message}`);
        }
      }
      
      // Create new meals
      for (const mealData of mealPlanData.meals) {
        const { data: meal, error: mealError } = await supabase
          .from("meals")
          .insert({
            meal_plan_id: planId,
            name: mealData.name,
            time_of_day: mealData.time_of_day,
            notes: mealData.notes
          })
          .select()
          .single();
        
        if (mealError) {
          console.error("Error creating meal:", mealError);
          throw new Error(`Failed to create meal: ${mealError.message}`);
        }
        
        // Create food items
        for (const foodItemData of mealData.food_items) {
          const { error: foodItemError } = await supabase
            .from("food_items")
            .insert({
              meal_id: meal.id,
              name: foodItemData.name,
              amount: foodItemData.amount,
              unit: foodItemData.unit,
              calories: foodItemData.calories,
              protein: foodItemData.protein,
              fat: foodItemData.fat,
              carbs: foodItemData.carbs,
              notes: foodItemData.notes
            });
          
          if (foodItemError) {
            console.error("Error creating food item:", foodItemError);
            throw new Error(`Failed to create food item: ${foodItemError.message}`);
          }
        }
      }
    }
    
    // Get the complete meal plan with all related data
    return await nutritionQueries.getMealPlanById(planId) as MealPlan;
  },

  /**
   * Delete a meal plan
   * @param planId - The ID of the meal plan to delete
   */
  deleteMealPlan: async (planId: string): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("meal_plans")
      .delete()
      .eq("id", planId);

    if (error) {
      console.error("Error deleting meal plan:", error);
      throw new Error(`Failed to delete meal plan: ${error.message}`);
    }
  }
};

/**
 * Client-side hooks (for use in React components)
 */
export const useNutritionQueries = () => {
  const supabase = createBrowserClient();
  
  return {
    /**
     * Get all meal plans for a dog
     * @param dogId - The ID of the dog
     * @returns Array of meal plans
     */
    getDogMealPlans: async (dogId: string): Promise<MealPlan[]> => {
      const { data, error } = await supabase
        .from("meal_plans")
        .select(`
          *,
          meals:meals(
            *,
            food_items:food_items(*)
          )
        `)
        .eq("dog_id", dogId)
        .order("start_date", { ascending: false });
      
      if (error) {
        console.error("Error fetching meal plans:", error);
        throw new Error(`Failed to fetch meal plans: ${error.message}`);
      }
      
      return data as MealPlan[];
    },
    
    /**
     * Get a meal plan by ID
     * @param planId - The ID of the meal plan
     * @returns Meal plan with dog information
     */
    getMealPlanById: async (planId: string): Promise<MealPlanWithDog | null> => {
      const { data, error } = await supabase
        .from("meal_plans")
        .select(`
          *,
          dog:dogs(id, name, breed, weight),
          meals:meals(
            *,
            food_items:food_items(*)
          )
        `)
        .eq("id", planId)
        .single();
      
      if (error) {
        console.error("Error fetching meal plan:", error);
        throw new Error(`Failed to fetch meal plan: ${error.message}`);
      }
      
      if (!data) return null;
      
      return data as MealPlanWithDog;
    },
    
    /**
     * Create a new meal plan
     * @param mealPlanData - The meal plan data to create
     * @returns The created meal plan
     */
    createMealPlan: async (mealPlanData: MealPlanFormData): Promise<MealPlan> => {
      // Create the meal plan
      const { data: mealPlan, error: mealPlanError } = await supabase
        .from("meal_plans")
        .insert({
          dog_id: mealPlanData.dog_id,
          name: mealPlanData.name,
          description: mealPlanData.description,
          start_date: mealPlanData.start_date,
          end_date: mealPlanData.end_date,
          daily_calories: mealPlanData.daily_calories
        })
        .select()
        .single();
      
      if (mealPlanError) {
        console.error("Error creating meal plan:", mealPlanError);
        throw new Error(`Failed to create meal plan: ${mealPlanError.message}`);
      }
      
      // Create meals
      for (const mealData of mealPlanData.meals) {
        const { data: meal, error: mealError } = await supabase
          .from("meals")
          .insert({
            meal_plan_id: mealPlan.id,
            name: mealData.name,
            time_of_day: mealData.time_of_day,
            notes: mealData.notes
          })
          .select()
          .single();
        
        if (mealError) {
          console.error("Error creating meal:", mealError);
          throw new Error(`Failed to create meal: ${mealError.message}`);
        }
        
        // Create food items
        for (const foodItemData of mealData.food_items) {
          const { error: foodItemError } = await supabase
            .from("food_items")
            .insert({
              meal_id: meal.id,
              name: foodItemData.name,
              amount: foodItemData.amount,
              unit: foodItemData.unit,
              calories: foodItemData.calories,
              protein: foodItemData.protein,
              fat: foodItemData.fat,
              carbs: foodItemData.carbs,
              notes: foodItemData.notes
            });
          
          if (foodItemError) {
            console.error("Error creating food item:", foodItemError);
            throw new Error(`Failed to create food item: ${foodItemError.message}`);
          }
        }
      }
      
      // Get the complete meal plan with all related data
      const { data: completeMealPlan, error: fetchError } = await supabase
        .from("meal_plans")
        .select(`
          *,
          meals:meals(
            *,
            food_items:food_items(*)
          )
        `)
        .eq("id", mealPlan.id)
        .single();
      
      if (fetchError) {
        console.error("Error fetching complete meal plan:", fetchError);
        throw new Error(`Failed to fetch complete meal plan: ${fetchError.message}`);
      }
      
      return completeMealPlan as MealPlan;
    },
    
    /**
     * Update a meal plan
     * @param planId - The ID of the meal plan to update
     * @param mealPlanData - The meal plan data to update
     * @returns The updated meal plan
     */
    updateMealPlan: async (planId: string, mealPlanData: Partial<MealPlanFormData>): Promise<MealPlan> => {
      // Update the meal plan
      const { error: mealPlanError } = await supabase
        .from("meal_plans")
        .update({
          name: mealPlanData.name,
          description: mealPlanData.description,
          start_date: mealPlanData.start_date,
          end_date: mealPlanData.end_date,
          daily_calories: mealPlanData.daily_calories
        })
        .eq("id", planId);
      
      if (mealPlanError) {
        console.error("Error updating meal plan:", mealPlanError);
        throw new Error(`Failed to update meal plan: ${mealPlanError.message}`);
      }
      
      // If meals are provided, update them
      if (mealPlanData.meals) {
        // Get existing meals
        const { data: existingMeals, error: mealsError } = await supabase
          .from("meals")
          .select("id")
          .eq("meal_plan_id", planId);
        
        if (mealsError) {
          console.error("Error fetching existing meals:", mealsError);
          throw new Error(`Failed to fetch existing meals: ${mealsError.message}`);
        }
        
        // Delete existing meals (cascade will delete food items)
        if (existingMeals.length > 0) {
          const { error: deleteError } = await supabase
            .from("meals")
            .delete()
            .eq("meal_plan_id", planId);
          
          if (deleteError) {
            console.error("Error deleting existing meals:", deleteError);
            throw new Error(`Failed to delete existing meals: ${deleteError.message}`);
          }
        }
        
        // Create new meals
        for (const mealData of mealPlanData.meals) {
          const { data: meal, error: mealError } = await supabase
            .from("meals")
            .insert({
              meal_plan_id: planId,
              name: mealData.name,
              time_of_day: mealData.time_of_day,
              notes: mealData.notes
            })
            .select()
            .single();
          
          if (mealError) {
            console.error("Error creating meal:", mealError);
            throw new Error(`Failed to create meal: ${mealError.message}`);
          }
          
          // Create food items
          for (const foodItemData of mealData.food_items) {
            const { error: foodItemError } = await supabase
              .from("food_items")
              .insert({
                meal_id: meal.id,
                name: foodItemData.name,
                amount: foodItemData.amount,
                unit: foodItemData.unit,
                calories: foodItemData.calories,
                protein: foodItemData.protein,
                fat: foodItemData.fat,
                carbs: foodItemData.carbs,
                notes: foodItemData.notes
              });
            
            if (foodItemError) {
              console.error("Error creating food item:", foodItemError);
              throw new Error(`Failed to create food item: ${foodItemError.message}`);
            }
          }
        }
      }
      
      // Get the complete meal plan with all related data
      const { data: completeMealPlan, error: fetchError } = await supabase
        .from("meal_plans")
        .select(`
          *,
          meals:meals(
            *,
            food_items:food_items(*)
          )
        `)
        .eq("id", planId)
        .single();
      
      if (fetchError) {
        console.error("Error fetching complete meal plan:", fetchError);
        throw new Error(`Failed to fetch complete meal plan: ${fetchError.message}`);
      }
      
      return completeMealPlan as MealPlan;
    },
    
    /**
     * Delete a meal plan
     * @param planId - The ID of the meal plan to delete
     */
    deleteMealPlan: async (planId: string): Promise<void> => {
      const { error } = await supabase
        .from("meal_plans")
        .delete()
        .eq("id", planId);
      
      if (error) {
        console.error("Error deleting meal plan:", error);
        throw new Error(`Failed to delete meal plan: ${error.message}`);
      }
    }
  };
};
