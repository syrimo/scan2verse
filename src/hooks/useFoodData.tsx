import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string;
  category?: string;
  image_url?: string;
  is_packaged?: boolean;
  barcode?: string;
  ingredients?: string;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  created_at: string;
}

interface FoodEntry {
  id: string;
  food_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number;
  notes?: string;
  created_at: string;
  food?: Food;
}

interface FoodDataStatus {
  foods: Food[];
  foodEntries: FoodEntry[];
  loading: boolean;
  error: string | null;
  totalEntries: number;
  totalFoods: number;
  refreshData: () => void;
}

export const useFoodData = (): FoodDataStatus => {
  const { user } = useAuth();
  const [dataStatus, setDataStatus] = useState<FoodDataStatus>({
    foods: [],
    foodEntries: [],
    loading: true,
    error: null,
    totalEntries: 0,
    totalFoods: 0,
    refreshData: () => {},
  });

  const fetchFoodData = async () => {
    if (!user) {
      setDataStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setDataStatus(prev => ({ ...prev, loading: true, error: null }));

      // Fetch user's foods
      const { data: foods, error: foodsError } = await supabase
        .from('foods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (foodsError) {
        throw new Error(`Failed to fetch foods: ${foodsError.message}`);
      }

      // Fetch user's food entries with food details
      const { data: foodEntries, error: entriesError } = await supabase
        .from('food_entries')
        .select(`
          *,
          food:foods(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (entriesError) {
        throw new Error(`Failed to fetch food entries: ${entriesError.message}`);
      }

      // Transform the data to match our interface
      const transformedFoods: Food[] = (foods || []).map(food => ({
        id: food.id,
        name: food.name,
        calories: food.calories || 0,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0,
        serving_size: food.serving_size || '1 serving',
        category: food.category,
        image_url: food.image_url,
        is_packaged: food.is_packaged || false,
        barcode: food.barcode,
        ingredients: food.ingredients,
        fiber: food.fiber,
        sugar: food.sugar,
        sodium: food.sodium,
        cholesterol: food.cholesterol,
        created_at: food.created_at,
      }));

      const transformedEntries: FoodEntry[] = (foodEntries || []).map(entry => ({
        id: entry.id,
        food_id: entry.food_id,
        date: entry.date,
        meal_type: entry.meal_type,
        quantity: entry.quantity || 1,
        notes: entry.notes,
        created_at: entry.created_at,
        food: entry.food ? {
          id: entry.food.id,
          name: entry.food.name,
          calories: entry.food.calories || 0,
          protein: entry.food.protein || 0,
          carbs: entry.food.carbs || 0,
          fat: entry.food.fat || 0,
          serving_size: entry.food.serving_size || '1 serving',
          category: entry.food.category,
          image_url: entry.food.image_url,
          is_packaged: entry.food.is_packaged || false,
          barcode: entry.food.barcode,
          ingredients: entry.food.ingredients,
          fiber: entry.food.fiber,
          sugar: entry.food.sugar,
          sodium: entry.food.sodium,
          cholesterol: entry.food.cholesterol,
          created_at: entry.food.created_at,
        } : undefined,
      }));

      setDataStatus(prev => ({
        ...prev,
        foods: transformedFoods,
        foodEntries: transformedEntries,
        totalFoods: transformedFoods.length,
        totalEntries: transformedEntries.length,
        loading: false,
        error: null,
      }));

    } catch (error: any) {
      console.error('Error fetching food data:', error);
      setDataStatus(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch food data',
      }));
    }
  };

  useEffect(() => {
    fetchFoodData();
  }, [user]);

  // Add refreshData function to the returned object
  const refreshData = () => {
    fetchFoodData();
  };

  return {
    ...dataStatus,
    refreshData,
  };
};

// Helper functions for analytics
export const getFoodsByDateRange = (
  foodEntries: FoodEntry[],
  startDate: string,
  endDate: string
): FoodEntry[] => {
  return foodEntries.filter(entry => {
    const entryDate = entry.date;
    return entryDate >= startDate && entryDate <= endDate;
  });
};

export const getTopFoods = (
  foodEntries: FoodEntry[],
  limit: number = 10
): { food: Food; count: number; totalCalories: number }[] => {
  const foodCounts = new Map<string, { food: Food; count: number; totalCalories: number }>();

  foodEntries.forEach(entry => {
    if (entry.food) {
      const existing = foodCounts.get(entry.food.id);
      const calories = entry.food.calories * entry.quantity;
      
      if (existing) {
        existing.count += 1;
        existing.totalCalories += calories;
      } else {
        foodCounts.set(entry.food.id, {
          food: entry.food,
          count: 1,
          totalCalories: calories,
        });
      }
    }
  });

  return Array.from(foodCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getNutritionTotals = (foodEntries: FoodEntry[]) => {
  return foodEntries.reduce(
    (totals, entry) => {
      if (entry.food) {
        totals.calories += entry.food.calories * entry.quantity;
        totals.protein += entry.food.protein * entry.quantity;
        totals.carbs += entry.food.carbs * entry.quantity;
        totals.fat += entry.food.fat * entry.quantity;
      }
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};
