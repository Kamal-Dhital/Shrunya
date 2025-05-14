import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FloatingAccessibilityButton } from "@/components/accessibility/floating-button";
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

// Auth pages
import LandingPage from "@/pages/auth/landing";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import ForgotPasswordPage from "@/pages/auth/forgot-password";

// Create context for accessibility settings
import { createContext, useState, useEffect } from "react";

// Auth context
export interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

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

// Notification context
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {},
  clearAll: () => {},
});

function Router() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
      <Switch>
        {/* Landing page as entry point */}
        <Route path="/" component={LandingPage} />
      
      {/* Auth routes */}
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/signup" component={SignupPage} />
      <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
      
      {/* Main app routes */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/learning" component={Learning} />
      <Route path="/projects" component={Projects} />
      <Route path="/challenges" component={Challenges} />
      <Route path="/community" component={Community} />
      <Route path="/jobs" component={Jobs} />
      
      {/* Project routes */}
      <Route path="/projects/:id" component={lazy(() => import("@/pages/projects/project-detail"))} />
      <Route path="/projects/:id/editor" component={lazy(() => import("@/pages/projects/project-editor"))} />
      
      {/* Challenge routes */}
      <Route path="/challenges/:id" component={lazy(() => import("@/pages/challenges/challenge-detail"))} />
      <Route path="/challenges/:id/editor" component={lazy(() => import("@/pages/challenges/challenge-editor"))} />
      <Route path="/challenges/:id/results" component={lazy(() => import("@/pages/challenges/challenge-results"))} />
      <Route path="/challenges/:id/leaderboard" component={lazy(() => import("@/pages/challenges/challenge-leaderboard"))} />
      
      {/* Job application flow */}
      <Route path="/jobs/:id" component={lazy(() => import("@/pages/jobs/job-detail"))} />
      <Route path="/jobs/:id/apply" component={lazy(() => import("@/pages/jobs/job-apply"))} />
      <Route path="/jobs/:id/success" component={lazy(() => import("@/pages/jobs/job-success"))} />
      <Route path="/user/applications" component={lazy(() => import("@/pages/user/applications"))} />
      
      {/* Course routes */}
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/courses/:id/enroll" component={lazy(() => import("@/pages/courses/enroll"))} />
      <Route path="/courses/:id/checkout" component={CourseCheckout} />
      <Route path="/courses/:id/learn" component={CourseLearn} />
      <Route path="/courses/:id/certificate" component={lazy(() => import("@/pages/courses/certificate"))} />
      
      {/* User routes */}
      <Route path="/user/profile" component={UserProfile} />
      
      {/* Community routes */}
      <Route path="/community/create-post" component={lazy(() => import("@/pages/community/create-post"))} />
      <Route path="/community/post/:id" component={lazy(() => import("@/pages/community/post-detail"))} />
      <Route path="/community/post-success" component={lazy(() => import("@/pages/community/post-success"))} />
      
      {/* Settings routes */}
      <Route path="/settings/accessibility" component={AccessibilitySettings} />
      
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For demo purposes, users start authenticated
  const [user, setUser] = useState({
    id: 1,
    username: "sarah_williams",
    fullName: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "user"
  });
  
  // Login and logout functions
  const login = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    // In a real app, we would also store a token in localStorage or cookies
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // In a real app, we would also remove the token from localStorage or cookies
  };
  
  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Welcome to SHRUNYA",
      message: "We're glad to have you here. Explore the platform to get started.",
      type: "info",
      read: false,
      createdAt: new Date()
    },
    {
      id: "2",
      title: "Course Recommendation",
      message: "Based on your interests, we recommend 'Advanced JavaScript Patterns'.",
      type: "success",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60)
    }
  ]);
  
  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Notification functions
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const clearAll = () => {
    setNotifications([]);
  };
  
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
      <AuthContext.Provider value={{
        isAuthenticated,
        user,
        login,
        logout
      }}>
        <NotificationContext.Provider value={{
          notifications,
          unreadCount,
          addNotification,
          markAsRead,
          markAllAsRead,
          removeNotification,
          clearAll
        }}>
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
              <FloatingAccessibilityButton />
              <Router />
            </TooltipProvider>
          </AccessibilityContext.Provider>
        </NotificationContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
