import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { Search, FileIcon, BookIcon, UserIcon, CodeIcon, GraduationCapIcon } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "course" | "project" | "user" | "document" | "challenge";
  url: string;
}

// Mock search results for demo
const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Advanced JavaScript Patterns",
    description: "Learn advanced design patterns in JavaScript",
    type: "course",
    url: "/courses/1"
  },
  {
    id: "2",
    title: "React Performance Optimization",
    description: "Techniques to optimize React applications",
    type: "course",
    url: "/courses/2"
  },
  {
    id: "3",
    title: "Portfolio Generator",
    description: "A project to create developer portfolios",
    type: "project",
    url: "/projects/3"
  },
  {
    id: "4",
    title: "Sarah Williams",
    description: "Frontend Developer",
    type: "user",
    url: "/user/profile"
  },
  {
    id: "5",
    title: "API Documentation",
    description: "Documentation for the platform API",
    type: "document",
    url: "/docs/api"
  },
  {
    id: "6",
    title: "Algorithm Challenge: Binary Search",
    description: "Implement a binary search algorithm",
    type: "challenge",
    url: "/challenges/6"
  }
];

export function GlobalSearch() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // In a real app, this would be an API call
    // For demo, filter mock results
    const filtered = mockResults.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setResults(filtered);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setQuery(value);
    performSearch(value);
  };

  // Handle result selection
  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    navigate(result.url);
    toast({
      title: "Navigating",
      description: `Going to ${result.title}`,
    });
  };

  // Get icon based on result type
  const getIcon = (type: string) => {
    switch (type) {
      case "course":
        return <GraduationCapIcon className="h-4 w-4 mr-2" />;
      case "project":
        return <CodeIcon className="h-4 w-4 mr-2" />;
      case "user":
        return <UserIcon className="h-4 w-4 mr-2" />;
      case "document":
        return <FileIcon className="h-4 w-4 mr-2" />;
      case "challenge":
        return <BookIcon className="h-4 w-4 mr-2" />;
      default:
        return <Search className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground w-full max-w-md border-primary/20 hover:border-primary/50 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4 text-primary/70" />
        <span className="hidden md:inline">Search everything in the system...</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 gap-0 max-w-2xl">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              ref={inputRef}
              placeholder="Search everything in the system..."
              value={query}
              onValueChange={handleSearchChange}
              className="border-none focus:ring-0"
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Results">
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center cursor-pointer p-2"
                  >
                    {getIcon(result.type)}
                    <div>
                      <p className="font-medium">{result.title}</p>
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}