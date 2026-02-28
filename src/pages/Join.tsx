
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Join = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <img
              src="/images/scan2verse_textlogo.png"
              alt="Scan2Verse Logo"
              className="w-48 h-24 mx-auto object-contain"
            />
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-br from-primary via-blue-600 to-foreground bg-clip-text text-transparent">
            Connect Your Data
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Seamlessly sync all your AI-powered apps in one central hub
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="glass-morphism bg-card border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Available Apps</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-primary font-semibold">Scan2Eat</span>
                <span className="text-muted-foreground">- Food & Nutrition Tracker</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-fuchsia-500 rounded-full"></div>
                <span className="text-fuchsia-600 font-semibold">Scan2Mind</span>
                <span className="text-muted-foreground">- Mental Health Assistant</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-semibold">Fitness Pro</span>
                <span className="text-muted-foreground">- Workout & Activity Tracker</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-600 font-semibold">JobSync</span>
                <span className="text-muted-foreground">- Career & Skills Tracker</span>
              </div>
            </div>
          </div>

          <div className="glass-morphism bg-card border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-white">1</div>
                <div>
                  <p className="font-semibold text-foreground">Download Mobile Apps</p>
                  <p className="text-muted-foreground text-sm">Get our AI-powered mobile apps from app stores</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">2</div>
                <div>
                  <p className="font-semibold text-foreground">Create Account</p>
                  <p className="text-muted-foreground text-sm">Sign up with the same email across all apps</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">3</div>
                <div>
                  <p className="font-semibold text-foreground">Auto-Sync</p>
                  <p className="text-muted-foreground text-sm">Your data automatically syncs to this dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="glass-morphism bg-card border-border rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Connect?</h2>
            <p className="text-muted-foreground mb-6">
              Start by creating your account and accessing your unified dashboard. 
              Your mobile app data will sync automatically once you install and sign in to each app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-primary-foreground font-semibold rounded-xl">
                  Create Account
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold rounded-xl">
                  View Demo Dashboard
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-muted-foreground text-sm mb-1">Made with ❤️ by the Scan2Verse Team</p>
            <p className="text-muted-foreground text-xs">© 2024 Scan2Verse. All rights reserved.</p>
          </div>
          <Link to="/" className="text-muted-foreground hover:text-foreground text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Join;
