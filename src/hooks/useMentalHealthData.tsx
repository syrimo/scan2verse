import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export interface MindAssessment {
  id: string;
  user_id: string;
  scan_type: 'quick' | 'deep';
  phq9_total: number | null;
  phq9_severity: string | null;
  gad7_total: number | null;
  gad7_severity: string | null;
  dass21_depression: number | null;
  dass21_anxiety: number | null;
  dass21_stress: number | null;
  dass21_depression_severity: string | null;
  dass21_anxiety_severity: string | null;
  dass21_stress_severity: string | null;
  overall_risk: 'low' | 'moderate' | 'high' | 'crisis';
  duration_seconds: number | null;
  created_at: string;
}

interface MentalHealthData {
  assessments: MindAssessment[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

export const useMentalHealthData = (): MentalHealthData => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<MindAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('mind_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching mental health data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return { assessments, loading, refreshData: fetchData };
};

// Helper: get risk color
export const getRiskColor = (risk: string): string => {
  switch (risk) {
    case 'low': return '#10B981';
    case 'moderate': return '#F59E0B';
    case 'high': return '#EF4444';
    case 'crisis': return '#DC2626';
    default: return '#64748B';
  }
};

// Helper: get risk label (BM)
export const getRiskLabel = (risk: string): string => {
  switch (risk) {
    case 'low': return 'Rendah';
    case 'moderate': return 'Sederhana';
    case 'high': return 'Tinggi';
    case 'crisis': return 'Kritikal';
    default: return risk;
  }
};

// Helper: get severity label (BM)
export const getSeverityLabel = (severity: string | null): string => {
  if (!severity) return '-';
  const map: Record<string, string> = {
    minimal: 'Minimum',
    mild: 'Ringan',
    moderate: 'Sederhana',
    moderately_severe: 'Agak Teruk',
    severe: 'Teruk',
    normal: 'Normal',
    extremely_severe: 'Sangat Teruk',
  };
  return map[severity] || severity;
};
