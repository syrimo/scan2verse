import { supabase } from './supabase';

export interface SyncDataEntry {
  user_id: string;
  app_source: 'scan3eat' | 'scan2mind' | 'fitness' | 'jobs';
  data_type: 'food_entry' | 'mental_health' | 'fitness' | 'training_data';
  data: any;
  created_at?: string;
}

export class DataSyncService {
  /**
   * Sync food entry data from Scan3Eat mobile app
   */
  static async syncFoodEntry(userId: string, foodData: any) {
    try {
      const { data, error } = await supabase
        .from('food_entries')
        .insert({
          user_id: userId,
          food_id: foodData.food_id,
          quantity: foodData.quantity,
          date: foodData.date,
          meal_type: foodData.meal_type,
          notes: foodData.notes,
          location: foodData.location,
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error syncing food entry:', error);
      return { success: false, error };
    }
  }

  /**
   * Sync training data from mobile apps (for AI training)
   */
  static async syncTrainingData(userId: string, trainingData: any) {
    try {
      const { data, error } = await supabase
        .from('training_data')
        .insert({
          image_hash: trainingData.image_hash,
          ai_result: trainingData.ai_result,
          user_corrections: trainingData.user_corrections,
          country: trainingData.country,
          age_range: trainingData.age_range,
          app_version: trainingData.app_version,
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error syncing training data:', error);
      return { success: false, error };
    }
  }

  /**
   * Get user's data summary for dashboard
   */
  static async getUserDataSummary(userId: string) {
    try {
      // Get food entries count
      const { count: foodCount } = await supabase
        .from('food_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get recent food entries
      const { data: recentFoodEntries } = await supabase
        .from('food_entries')
        .select(`
          *,
          foods (
            name,
            calories,
            protein,
            carbs,
            fat
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get training data count (user's contribution to AI)
      const { count: trainingCount } = await supabase
        .from('training_data')
        .select('*', { count: 'exact', head: true });

      return {
        success: true,
        data: {
          foodEntries: {
            count: foodCount || 0,
            recent: recentFoodEntries || [],
          },
          trainingData: {
            count: trainingCount || 0,
          },
          totalEntries: (foodCount || 0) + (trainingCount || 0),
        },
      };
    } catch (error) {
      console.error('Error getting user data summary:', error);
      return { success: false, error };
    }
  }

  /**
   * Real-time subscription to user's data changes
   */
  static subscribeToUserData(userId: string, callback: (payload: any) => void) {
    const subscription = supabase
      .channel('user-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'food_entries',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    return subscription;
  }

  /**
   * Check if user has any mobile app data
   */
  static async hasUserData(userId: string): Promise<boolean> {
    try {
      const { count: foodCount } = await supabase
        .from('food_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      return (foodCount || 0) > 0;
    } catch (error) {
      console.error('Error checking user data:', error);
      return false;
    }
  }
}

// Export for use in mobile apps or API endpoints
export default DataSyncService;
