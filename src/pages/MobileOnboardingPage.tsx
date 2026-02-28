import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import MobileAppOnboarding from "@/components/MobileAppOnboarding";
import { useState } from "react";

const MobileOnboardingPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = useState(false);

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
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };

  const getUserAvatar = () => {
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    if (user?.user_metadata?.picture) {
      return user.user_metadata.picture;
    }
    return null;
  };

  const AvatarDisplay = ({ className = "w-8 h-8" }: { className?: string }) => {
    const avatarUrl = getUserAvatar();
    
    if (!avatarUrl || avatarError) {
      return <User className={`${className.replace('w-8 h-8', 'w-5 h-5')} text-muted-foreground`} />;
    }
    
    return (
      <img
        src={avatarUrl}
        alt="Profile"
        className={`${className} rounded-full object-cover`}
        onError={() => setAvatarError(true)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background text-foreground font-sans">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/images/scan2verse_textlogo.png"
              alt="Scan2Verse Logo"
              className="w-32 h-8 object-contain"
            />
            <h1 className="text-xl font-bold text-primary">Mobile Onboarding</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <AvatarDisplay />
              <span className="text-muted-foreground">{getUserName()}</span>
            </div>
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

      {/* Mobile App Onboarding Content */}
      <MobileAppOnboarding />
    </div>
  );
};

export default MobileOnboardingPage;
