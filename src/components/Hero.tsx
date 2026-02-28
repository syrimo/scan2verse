import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleAccessDashboard = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <img
        src="/images/scan2verse_textlogo.png"
        alt="Scan2Verse Logo"
        className="max-w-2xl w-full h-auto mb-8"
      />
      
      <p className="text-2xl md:text-3xl font-medium text-foreground mb-4">
        Your Central AI Universe Hub
      </p>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
        Connect all your data from Scan2eat, Scan2mind, Fitness, Jobs and more in one intelligent dashboard. 
        Never lose your progress again - sync across all devices with AI-powered insights.
      </p>
      
      <Button 
        onClick={handleAccessDashboard}
        disabled={loading}
        className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-primary-foreground font-semibold rounded-xl text-lg"
      >
        {loading ? "Loading..." : user ? "Access Dashboard" : "Sign In to Dashboard"}
      </Button>
    </section>
  );
};

export default Hero;
