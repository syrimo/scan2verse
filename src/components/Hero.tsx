import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, UtensilsCrossed, Activity, ArrowRight, Sparkles } from "lucide-react";

const apps = [
  {
    name: "scan2mind",
    desc: "Mental health screening",
    icon: Brain,
    gradient: "from-cyan-400 to-blue-500",
    href: "https://mind.scan2verse.com",
    status: "live",
  },
  {
    name: "scan2eat",
    desc: "Food & nutrition tracking",
    icon: UtensilsCrossed,
    gradient: "from-amber-400 to-orange-500",
    href: "https://eat.scan2verse.com",
    status: "live",
  },
  {
    name: "scan2fit",
    desc: "Fitness & wellness",
    icon: Activity,
    gradient: "from-emerald-400 to-green-500",
    href: "#",
    status: "soon",
  },
];

const Hero = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleAccessDashboard = () => {
    navigate(user ? "/dashboard" : "/login");
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* BG ambient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-primary/[0.06] rounded-full blur-[160px]" />
        <div className="absolute top-[40%] right-[-15%] w-[40%] h-[40%] bg-accent/[0.04] rounded-full blur-[140px]" />
      </div>

      {/* Nav */}
      <header className="flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            scan<span className="text-primary">2</span>verse
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAccessDashboard}
          disabled={loading}
          className="border-border/50 hover:bg-card hover:border-primary/30"
        >
          {user ? "Dashboard" : "Sign In"}
        </Button>
      </header>

      {/* Hero content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/[0.08] mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs font-semibold text-primary tracking-wide">Ecosystem Dashboard</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight mb-6 max-w-[820px]">
          All your scans,{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text">one universe.</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-[540px] mb-10 leading-relaxed">
          Connect scan2mind, scan2eat, and more in a unified dashboard.
          Track your health, nutrition, and wellness — all in one place.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-16">
          <Button
            onClick={handleAccessDashboard}
            disabled={loading}
            className="h-12 px-8 bg-primary text-primary-foreground font-bold rounded-xl text-base glow-cyan hover:bg-primary/90 transition-all"
          >
            {loading ? "Loading..." : user ? "Open Dashboard" : "Get Started"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* App cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
          {apps.map((app) => (
            <a
              key={app.name}
              href={app.status === "live" ? app.href : undefined}
              target={app.status === "live" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`group flex flex-col items-center gap-3 p-6 rounded-2xl border border-border/50 bg-card/50 transition-all duration-300 ${
                app.status === "live"
                  ? "hover:border-primary/30 hover:bg-card cursor-pointer"
                  : "opacity-50 cursor-default"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                <app.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground">{app.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{app.desc}</p>
              </div>
              {app.status === "soon" && (
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Coming Soon</span>
              )}
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} Sutera Hijau Academy.</p>
            <a href="https://mind.scan2verse.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">scan2mind</a>
            <a href="https://eat.scan2verse.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">scan2eat</a>
          </div>
          <p>Part of the scan2verse ecosystem</p>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
