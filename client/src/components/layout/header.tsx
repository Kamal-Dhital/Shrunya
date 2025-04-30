import { BellIcon, HelpCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn("bg-white shadow-sm z-10 sticky top-0", className)}>
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex-1 flex items-center justify-end space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-1">
            <span className="hidden sm:inline-block">Help</span>
            <HelpCircleIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
