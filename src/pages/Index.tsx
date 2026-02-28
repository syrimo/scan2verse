
import Hero from "@/components/Hero";
import LandingFooter from "@/components/LandingFooter";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted to-background text-foreground font-sans">
      <Hero />
      <LandingFooter />
    </div>
  );
};

export default Index;
