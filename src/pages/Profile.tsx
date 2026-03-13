import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  User, 
  LogOut, 
  Target, 
  Activity, 
  Scale, 
  Ruler, 
  Calendar, 
  Heart,
  Smartphone,
  Edit,
  ChartBar,
  Camera
} from "lucide-react";

const Profile = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");

  // Fetch user's profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfileData(profile);
        
        // Calculate BMI if height and weight are available
        if (profile?.height && profile?.weight) {
          const heightInM = profile.height / 100;
          const calculatedBMI = profile.weight / (heightInM * heightInM);
          setBmi(calculatedBMI);
          
          // Determine BMI category
          if (calculatedBMI < 18.5) setBmiCategory("Underweight");
          else if (calculatedBMI < 25) setBmiCategory("Normal");
          else if (calculatedBMI < 30) setBmiCategory("Overweight");
          else setBmiCategory("Obese");
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const getUserName = () => {
    if (profileData?.full_name) return profileData.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  };

  const getUserAvatar = () => {
    if (profileData?.avatar_url) return profileData.avatar_url;
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    if (user?.user_metadata?.picture) return user.user_metadata.picture;
    return null;
  };

  const getActivityLevelText = (level: string | undefined) => {
    switch (level) {
      case 'sedentary': return 'Sedentary';
      case 'light': return 'Lightly Active';
      case 'moderate': return 'Moderately Active';
      case 'active': return 'Very Active';
      case 'very_active': return 'Extremely Active';
      default: return 'Not Set';
    }
  };

  const getGoalText = (goal: string | undefined) => {
    switch (goal) {
      case 'lose': return 'Lose Weight';
      case 'maintain': return 'Maintain Weight';
      case 'gain': return 'Gain Muscle';
      default: return 'Not Set';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="bg-card backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-[hsl(263,70%,50%)] flex items-center justify-center">
                <span className="text-xs font-bold text-white">S</span>
              </div>
              <span className="font-bold tracking-tight">scan<span className="text-primary">2</span>verse</span>
            </Link>
            <h1 className="text-xl font-bold text-primary">Profile</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ChartBar className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              {getUserAvatar() ? (
                <img
                  src={getUserAvatar()!}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <User className={`w-12 h-12 text-primary ${getUserAvatar() ? 'hidden' : ''}`} />
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-foreground mb-2">{getUserName()}</h2>
              <p className="text-muted-foreground text-lg mb-4">{user.email}</p>
              
              {/* Quick Stats */}
              {(profileData?.age || profileData?.height || profileData?.weight) && (
                <div className="flex gap-8">
                  {profileData?.age && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{profileData.age}</p>
                      <p className="text-sm text-muted-foreground">Age</p>
                    </div>
                  )}
                  {profileData?.height && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{profileData.height}</p>
                      <p className="text-sm text-muted-foreground">cm</p>
                    </div>
                  )}
                  {profileData?.weight && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{profileData.weight}</p>
                      <p className="text-sm text-muted-foreground">kg</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Update Prompt */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Update Your Profile</h3>
                <p className="text-muted-foreground">
                  To edit your profile information, nutrition goals, and personal details, please use the Scan2eat mobile app on your device.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            
            <div className="space-y-4">
              {profileData?.gender && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium text-foreground">
                      {profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1)}
                    </p>
                  </div>
                </div>
              )}
              
              {profileData?.age && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">{profileData.age} years</p>
                  </div>
                </div>
              )}
              
              {profileData?.height && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Ruler className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="font-medium text-foreground">{profileData.height} cm</p>
                  </div>
                </div>
              )}
              
              {profileData?.weight && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Scale className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium text-foreground">{profileData.weight} kg</p>
                  </div>
                </div>
              )}
              
              {profileData?.activity_level && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Activity className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Activity Level</p>
                    <p className="font-medium text-foreground">
                      {getActivityLevelText(profileData.activity_level)}
                    </p>
                  </div>
                </div>
              )}
              
              {profileData?.goal && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Goal</p>
                    <p className="font-medium text-foreground">
                      {getGoalText(profileData.goal)}
                    </p>
                  </div>
                </div>
              )}

              {bmi && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Heart className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">BMI</p>
                    <p className="font-medium text-foreground">
                      {bmi.toFixed(1)} - {bmiCategory}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nutrition Goals */}
          <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Nutrition Goals
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {profileData?.calorie_goal || '-'}
                </p>
                <p className="text-sm text-muted-foreground">Calories</p>
              </div>

              <div className="bg-green-500/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {profileData?.protein_goal || '-'}
                </p>
                <p className="text-sm text-muted-foreground">Protein (g)</p>
              </div>

              <div className="bg-blue-500/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {profileData?.carbs_goal || '-'}
                </p>
                <p className="text-sm text-muted-foreground">Carbs (g)</p>
              </div>

              <div className="bg-orange-500/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {profileData?.fat_goal || '-'}
                </p>
                <p className="text-sm text-muted-foreground">Fat (g)</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Edit className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Want to update your goals?</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Use the Scan2eat mobile app to adjust your nutrition goals and track your progress.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-border mt-8">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Sutera Hijau Academy · Part of the scan2verse ecosystem
          </p>
        </div>
      </main>
    </div>
  );
};

export default Profile;
