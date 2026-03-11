import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface UserDataStatus {
  hasData: boolean;
  loading: boolean;
  dataCount: {
    foodEntries: number;
    mentalHealthEntries: number;
    fitnessEntries: number;
    totalEntries: number;
  };
}

export const useUserData = (): UserDataStatus => {
  const { user } = useAuth();
  const [dataStatus, setDataStatus] = useState<UserDataStatus>({
    hasData: false,
    loading: true,
    dataCount: {
      foodEntries: 0,
      mentalHealthEntries: 0,
      fitnessEntries: 0,
      totalEntries: 0,
    },
  });

  useEffect(() => {
    const checkUserData = async () => {
      if (!user) {
        setDataStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        // Check for food entries
        const { count: foodCount } = await supabase
          .from('food_entries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Check for mental health assessments
        const { count: mindCount } = await supabase
          .from('mind_assessments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Check for complete profile (indicates existing Scan2Eat user)
        const { data: profile } = await supabase
          .from('profiles')
          .select('age, weight, height, calorie_goal, activity_level, goal')
          .eq('id', user.id)
          .single();

        // Check for training data (from mobile apps)
        const { count: trainingCount } = await supabase
          .from('training_data')
          .select('*', { count: 'exact', head: true });

        const hasCompleteProfile = profile && (
          profile.age ||
          profile.weight ||
          profile.height ||
          profile.calorie_goal ||
          profile.activity_level ||
          profile.goal
        );

        const totalEntries = (foodCount || 0) + (trainingCount || 0) + (mindCount || 0);
        const hasData = totalEntries > 0 || hasCompleteProfile;

        setDataStatus({
          hasData,
          loading: false,
          dataCount: {
            foodEntries: foodCount || 0,
            mentalHealthEntries: mindCount || 0,
            fitnessEntries: 0, // Will be implemented later
            totalEntries,
          },
        });
      } catch (error) {
        console.error('Error checking user data:', error);
        setDataStatus(prev => ({ ...prev, loading: false }));
      }
    };

    checkUserData();
  }, [user]);

  return dataStatus;
};
