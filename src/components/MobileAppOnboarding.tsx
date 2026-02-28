import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Download, QrCode, ArrowRight } from "lucide-react";

const MobileAppOnboarding = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-foreground">Welcome to Scan2verse!</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          To get started with your AI-powered health journey, download the Scan2eat mobile app where you'll complete your profile and begin tracking your nutrition data.
        </p>
      </div>

      <div className="flex flex-col items-center mb-12 max-w-md mx-auto">
        {/* Scan2Eat Logo */}
        <div className="mb-8">
          <img 
            src="/images/scan2eat_textlogo.png" 
            alt="Scan2Eat Logo" 
            className="h-24 w-auto object-contain"
          />
        </div>
        
        {/* Download Section */}
        <div className="w-full space-y-6">
          <p className="text-muted-foreground text-center">
            Scan food, track nutrition, and build healthy eating habits with AI-powered insights.
          </p>
          
          <div className="text-center">
            <p className="text-foreground font-medium mb-4">
              Download Scan2eat from your preferred app store:
            </p>
            <div className="flex items-center justify-center gap-4">
              <img 
                src="/images/appstore_icon.png" 
                alt="Download on App Store" 
                className="h-12 w-auto object-contain"
              />
              <img 
                src="/images/playstore_icon.webp" 
                alt="Get it on Google Play" 
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 backdrop-blur-xl border border-primary/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-primary text-center">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-lg">1</span>
            </div>
            <h4 className="font-semibold text-foreground mb-2">Download & Onboard</h4>
            <p className="text-muted-foreground text-sm">Download the mobile app and complete your profile setup</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-lg">2</span>
            </div>
            <h4 className="font-semibold text-foreground mb-2">Track & Sync</h4>
            <p className="text-muted-foreground text-sm">Use the app as a guest, then sign in to sync your data to the cloud</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-lg">3</span>
            </div>
            <h4 className="font-semibold text-foreground mb-2">Dashboard Access</h4>
            <p className="text-muted-foreground text-sm">Return here to view your unified dashboard and AI insights</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground text-sm mb-1">Made with ❤️ by the Scan2Verse Team</p>
        <p className="text-muted-foreground text-xs">© 2024 Scan2Verse. All rights reserved.</p>
      </div>
    </div>
  );
};

export default MobileAppOnboarding;
