import { ChartBar, Brain, LogOut, User, Camera, BarChart3, Images, Activity } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { useFoodData } from "@/hooks/useFoodData";
import { useMentalHealthData, getRiskColor, getRiskLabel } from "@/hooks/useMentalHealthData";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import FoodGallery from "@/components/FoodGallery";
import NutritionAnalytics from "@/components/NutritionAnalytics";
import MentalHealthAnalytics from "@/components/MentalHealthAnalytics";

const isProUser = (profile: any): boolean => {
  if (!profile) return false;
  const status = profile.subscription_status;
  const expiry = profile.subscription_expires_at ? new Date(profile.subscription_expires_at) : null;
  const now = new Date();
  if (status === 'active') return !expiry || now <= expiry;
  if (status === 'cancelled') return !!expiry && now <= expiry;
  return false;
};

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  return <DashboardContent user={user} signOut={signOut} navigate={navigate} />;
};

const DashboardContent = ({ user, signOut, navigate }: any) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeApp = searchParams.get('tab') || 'scan2eat';

  const { hasData, loading: userDataLoading } = useUserData();
  const { foods, foodEntries, loading: foodLoading, refreshData } = useFoodData();
  const { assessments, loading: mindLoading } = useMentalHealthData();
  const [profileData, setProfileData] = useState<any>(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfileData(profile);
      } catch (error) {
        console.error('Error fetching profile data:', error);
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

  const getFirstName = () => getUserName().split(' ')[0];

  const getUserAvatar = () => {
    if (profileData?.avatar_url) return profileData.avatar_url;
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    if (user?.user_metadata?.picture) return user.user_metadata.picture;
    return null;
  };

  useEffect(() => { setAvatarError(false); }, [user, profileData]);

  const AvatarDisplay = ({ className = "w-8 h-8" }: { className?: string }) => {
    const avatarUrl = getUserAvatar();
    if (!avatarUrl || avatarError) {
      return <User className={`${className.replace('w-8 h-8', 'w-5 h-5')} text-muted-foreground`} />;
    }
    return (
      <img src={avatarUrl} alt="Profile" className={`${className} rounded-full object-cover`} onError={() => setAvatarError(true)} />
    );
  };

  const isPro = isProUser(profileData);
  const isStillLoading = userDataLoading && !hasData;

  useEffect(() => {
    if (isStillLoading) {
      const timeout = setTimeout(() => {
        console.log("Loading timeout reached, showing dashboard anyway");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isStillLoading]);

  if (isStillLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
          <p className="text-muted-foreground/70 text-sm mt-2">This should only take a moment</p>
        </div>
      </div>
    );
  }

  // Latest risk for overview card
  const latestAssessment = assessments[0];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="bg-card backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img src="/images/scan2verse_textlogo.png" alt="Scan2Verse Logo" className="w-32 h-8 object-contain" />
            </Link>
            <h1 className="text-xl font-bold text-primary">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 hover:bg-muted/50 rounded-lg px-3 py-2 transition-colors">
              <AvatarDisplay />
              <span className="text-muted-foreground">{getUserName()}</span>
            </Link>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-foreground">Welcome back, {getFirstName()}!</h2>
          <p className="text-muted-foreground text-lg">Here's your unified data from all connected apps</p>
        </div>

        {/* Stats Overview — Multi-App Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Scan2Eat Overview */}
          <button
            onClick={() => setSearchParams({ tab: 'scan2eat' })}
            className={`bg-card backdrop-blur-xl border rounded-2xl p-6 hover:bg-muted/50 transition-all duration-300 text-left ${
              activeApp === 'scan2eat' ? 'border-primary ring-1 ring-primary/30' : 'border-border'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <ChartBar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Scan2eat</h3>
                <p className="text-muted-foreground text-sm">Nutrition Tracker</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Food Entries</span>
                <span className="text-primary font-semibold">{foodEntries.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unique Foods</span>
                <span className="text-green-600 font-semibold">{foods.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Goal</span>
                <span className="text-foreground">{profileData?.calorie_goal || '2,000'} cal</span>
              </div>
            </div>
          </button>

          {/* scan2mind Overview */}
          <button
            onClick={() => setSearchParams({ tab: 'scan2mind' })}
            className={`bg-card backdrop-blur-xl border rounded-2xl p-6 hover:bg-muted/50 transition-all duration-300 text-left ${
              activeApp === 'scan2mind' ? 'border-fuchsia-500 ring-1 ring-fuchsia-500/30' : 'border-border'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">scan2mind</h3>
                <p className="text-muted-foreground text-sm">Mental Health</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saringan</span>
                <span className="text-purple-500 font-semibold">{assessments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risiko Terkini</span>
                {latestAssessment ? (
                  <span className="font-semibold" style={{ color: getRiskColor(latestAssessment.overall_risk) }}>
                    {getRiskLabel(latestAssessment.overall_risk)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PHQ-9</span>
                <span className="text-foreground">
                  {latestAssessment?.phq9_total ?? '-'}
                  {latestAssessment?.phq9_total != null && <span className="text-muted-foreground">/27</span>}
                </span>
              </div>
            </div>
          </button>

          {/* Coming Soon — Fitness */}
          <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 opacity-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Fitness</h3>
                <p className="text-muted-foreground text-sm">Coming Soon</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">AI fitness tracking & guidance — coming soon.</p>
          </div>
        </div>

        {/* App-Specific Dashboard */}
        {activeApp === 'scan2eat' && (
          <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground">Scan2eat Dashboard</h3>
                <p className="text-muted-foreground">Your nutrition journey visualized</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Camera className="w-4 h-4" />
                <span>{foodEntries.filter(e => e.food?.image_url).length} photos</span>
                <span>•</span>
                <span>{foodEntries.length} entries</span>
                <span>•</span>
                <span>{foods.length} foods</span>
              </div>
            </div>

            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
                <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">
                  <Images className="w-4 h-4 mr-2" />
                  Food Gallery
                </TabsTrigger>
              </TabsList>
              <TabsContent value="analytics" className="mt-6">
                <NutritionAnalytics foodEntries={foodEntries} userProfile={profileData} />
              </TabsContent>
              <TabsContent value="gallery" className="mt-6">
                <FoodGallery foodEntries={foodEntries} loading={foodLoading} />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeApp === 'scan2mind' && (
          <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground">scan2mind Dashboard</h3>
                <p className="text-muted-foreground">Saringan & analitik kesihatan mental anda</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="w-4 h-4" />
                <span>{assessments.length} saringan</span>
                {latestAssessment && (
                  <>
                    <span>•</span>
                    <span style={{ color: getRiskColor(latestAssessment.overall_risk) }}>
                      {getRiskLabel(latestAssessment.overall_risk)}
                    </span>
                  </>
                )}
              </div>
            </div>
            <MentalHealthAnalytics assessments={assessments} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 border-t border-border mt-8">
          <p className="text-muted-foreground text-sm mb-2">
            Made with ❤️ by the Scan2Verse Team
          </p>
          <p className="text-muted-foreground text-xs">
            © 2024 Scan2Verse. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
