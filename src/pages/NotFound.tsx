import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center flex-1 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary/80 underline">
          Return to Home
        </a>
      </div>
      <div className="text-center py-8 border-t border-border w-full">
        <p className="text-muted-foreground text-sm mb-1">Made with ❤️ by the Scan2Verse Team</p>
        <p className="text-muted-foreground text-xs">© 2024 Scan2Verse. All rights reserved.</p>
      </div>
    </div>
  );
};

export default NotFound;
