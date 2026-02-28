import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

const AuthCallback = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (loading) return;

      if (!user) {
        // No user, redirect to login
        navigate('/login');
        return;
      }

      try {
        // Check if user has a profile in the database
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          // Error other than "not found"
          console.error('Error checking profile:', error);
          navigate('/login');
          return;
        }

        if (profile) {
          // User has profile data from mobile app - go to dashboard
          navigate('/dashboard');
        } else {
          // User signed in via web but no profile data - go to mobile onboarding
          navigate('/mobile-onboarding');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [user, loading, navigate]);

  return <LoadingSpinner />;
};

export default AuthCallback;
