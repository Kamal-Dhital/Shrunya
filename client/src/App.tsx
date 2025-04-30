import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Learning from "@/pages/learning";
import Projects from "@/pages/projects";
import Challenges from "@/pages/challenges";
import Community from "@/pages/community";
import Jobs from "@/pages/jobs";

// Course pages
import CourseDetail from "@/pages/courses/course-detail";
import CourseCheckout from "@/pages/courses/checkout";
import CourseLearn from "@/pages/courses/learn";

// User pages
import UserProfile from "@/pages/user/profile";

// Settings pages
import AccessibilitySettings from "@/pages/settings/accessibility";

// Create context for accessibility settings
import { createContext, useState, useEffect } from "react";

export const AccessibilityContext = createContext({
  fontSize: 100,
  setFontSize: (size: number) => {},
  highContrast: false,
  setHighContrast: (enabled: boolean) => {},
  reducedMotion: false,
  setReducedMotion: (enabled: boolean) => {},
  dyslexicFont: false,
  setDyslexicFont: (enabled: boolean) => {},
  focusIndicators: false,
  setFocusIndicators: (enabled: boolean) => {},
  colorTheme: "system",
  setColorTheme: (theme: string) => {}
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/learning" component={Learning} />
      <Route path="/projects" component={Projects} />
      <Route path="/challenges" component={Challenges} />
      <Route path="/community" component={Community} />
      <Route path="/jobs" component={Jobs} />
      
      {/* Course routes */}
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/courses/:id/checkout" component={CourseCheckout} />
      <Route path="/courses/:id/learn" component={CourseLearn} />
      
      {/* User routes */}
      <Route path="/user/profile" component={UserProfile} />
      
      {/* Settings routes */}
      <Route path="/settings/accessibility" component={AccessibilitySettings} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Accessibility settings state
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [focusIndicators, setFocusIndicators] = useState(false);
  const [colorTheme, setColorTheme] = useState("system");
  
  // Apply font size scaling to the document
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    return () => {
      document.documentElement.style.fontSize = "100%";
    };
  }, [fontSize]);
  
  // Apply high contrast mode
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    return () => {
      document.documentElement.classList.remove("high-contrast");
    };
  }, [highContrast]);
  
  // Apply reduced motion
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
    return () => {
      document.documentElement.classList.remove("reduce-motion");
    };
  }, [reducedMotion]);
  
  // Apply dyslexic font
  useEffect(() => {
    if (dyslexicFont) {
      document.documentElement.classList.add("dyslexic-font");
    } else {
      document.documentElement.classList.remove("dyslexic-font");
    }
    return () => {
      document.documentElement.classList.remove("dyslexic-font");
    };
  }, [dyslexicFont]);
  
  // Apply focus indicators
  useEffect(() => {
    if (focusIndicators) {
      document.documentElement.classList.add("focus-visible");
    } else {
      document.documentElement.classList.remove("focus-visible");
    }
    return () => {
      document.documentElement.classList.remove("focus-visible");
    };
  }, [focusIndicators]);
  
  // Handle theme changes
  useEffect(() => {
    if (colorTheme === "system") {
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add("system");
    } else if (colorTheme === "dark") {
      document.documentElement.classList.remove("system", "light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("system", "dark");
      document.documentElement.classList.add("light");
    }
  }, [colorTheme]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityContext.Provider value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
        dyslexicFont,
        setDyslexicFont,
        focusIndicators,
        setFocusIndicators,
        colorTheme,
        setColorTheme
      }}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AccessibilityContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
