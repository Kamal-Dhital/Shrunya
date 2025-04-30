import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  HomeIcon,
  BookOpenIcon,
  CodeIcon,
  TrophyIcon,
  MessagesSquareIcon,
  BriefcaseIcon,
  UserIcon,
  SettingsIcon,
  SearchIcon,
  MenuIcon,
  XIcon
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const mainNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    label: "Learning",
    href: "/learning",
    icon: <BookOpenIcon className="w-5 h-5" />,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: <CodeIcon className="w-5 h-5" />,
  },
  {
    label: "Challenges",
    href: "/challenges",
    icon: <TrophyIcon className="w-5 h-5" />,
  },
  {
    label: "Community",
    href: "/community",
    icon: <MessagesSquareIcon className="w-5 h-5" />,
  },
  {
    label: "Jobs",
    href: "/jobs",
    icon: <BriefcaseIcon className="w-5 h-5" />,
  },
];

const accountNav: NavItem[] = [
  {
    label: "Profile",
    href: "/profile",
    icon: <UserIcon className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <SettingsIcon className="w-5 h-5" />,
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 z-30 md:hidden bg-primary text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 bg-white border-r border-gray-200 flex flex-col h-screen",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 flex items-center space-x-2">
          <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd"></path>
          </svg>
          <h1 className="font-bold text-xl text-primary">SHRUNYA</h1>
        </div>

        {/* Search */}
        <div className="px-4 py-4">
          <div className="relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 bg-gray-100 border-gray-200"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-grow overflow-y-auto custom-scrollbar py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main
          </div>

          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
            >
              <a
                className={cn(
                  "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors",
                  location === item.href && "text-primary bg-blue-50 hover:bg-blue-100"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </Link>
          ))}

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </div>

          {accountNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
            >
              <a
                className={cn(
                  "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors",
                  location === item.href && "text-primary bg-blue-50 hover:bg-blue-100"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face" />
              <AvatarFallback>SW</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">Sarah Williams</p>
              <p className="text-xs text-gray-500">Full Stack Developer</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
