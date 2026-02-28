
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LoginSection = () => (
  <section className="max-w-6xl mx-auto px-6 py-16">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Login CTA */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-cyan-300">Access Your Dashboard</h2>
        <p className="text-white/70 mb-8">
          Sign in to view all your synchronized data from every Scan2Verse app
        </p>
        
        <div className="space-y-6">
          <Link to="/login">
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-xl">
              Sign In to Dashboard
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              View Demo Dashboard
            </Button>
          </Link>
          <div className="text-center">
            <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm">
              Don't have an account? Sign up
            </a>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white mb-6">Why Connect Your Data?</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-3 h-3 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-white">Cross-App Insights</h4>
              <p className="text-white/70">See how your nutrition affects your mood, fitness impacts your productivity</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-3 h-3 bg-fuchsia-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-white">Never Lose Progress</h4>
              <p className="text-white/70">Switch devices, reinstall apps - your data is always safe and synced</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-white">AI-Powered Recommendations</h4>
              <p className="text-white/70">Get personalized suggestions based on your complete lifestyle data</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-white">Investment Opportunity</h4>
              <p className="text-white/70">First-of-its-kind unified AI ecosystem with multiple revenue streams</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default LoginSection;
