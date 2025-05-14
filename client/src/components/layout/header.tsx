import { useContext, useState } from "react";
import { useLocation } from "wouter";
import { AuthContext, NotificationContext } from "@/App";
import { NotificationsPopover } from "./notifications";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlobalSearch } from "@/components/search/global-search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Menu,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Github,
  AccessibilityIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  className?: string;
  toggleSidebar?: () => void;
}

export function Header({ className, toggleSidebar }: HeaderProps) {
  const [, navigate] = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  const { toast } = useToast();
  
  // Generate initials from the user name
  const getUserInitials = () => {
    if (!user || !user.fullName) return "U";
    return user.fullName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  // Handle GitHub connect
  const handleGithubConnect = () => {
    // In a real app, this would redirect to GitHub OAuth flow
    // For demo, we'll just show a notification
    addNotification({
      title: "GitHub Connected",
      message: "Your GitHub account has been successfully connected.",
      type: "success"
    });
  };
  
  return (
    <header className={`sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="hidden md:flex md:flex-1">
        <GlobalSearch />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => {
          // This will be handled by the GlobalSearch component
          // which listens for the keyboard shortcut
          const event = new KeyboardEvent('keydown', {
            key: 'k',
            metaKey: true,
            bubbles: true
          });
          document.dispatchEvent(event);
        }}
      >
        <Search className="h-5 w-5 text-primary/70" />
        <span className="sr-only">Search</span>
      </Button>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings/accessibility")}
          title="Accessibility Settings"
          aria-label="Accessibility Settings"
        >
          <AccessibilityIcon className="h-5 w-5" />
          <span className="sr-only">Accessibility Settings</span>
        </Button>
        {/* GitHub Connect Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden md:flex items-center gap-2"
          onClick={handleGithubConnect}
        >
          <Github className="h-4 w-4" />
          Connect GitHub
        </Button>
        
        {/* Notifications */}
        <NotificationsPopover />
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={user?.avatar || "https://github.com/shadcn.png"} 
                  alt={user?.fullName || "User"} 
                />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <p>{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">@{user?.username}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/user/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings/accessibility")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}