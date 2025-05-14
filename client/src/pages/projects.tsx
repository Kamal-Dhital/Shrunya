import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CodeIcon, SearchIcon, FilterIcon, ClockIcon, UsersIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Projects() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    category: string[];
    duration: string[];
  }>({
    category: [],
    duration: []
  });
  
  // Fetch projects data
  const projectsQuery = useQuery({
    queryKey: ["/api/projects"],
    staleTime: 60000
  });

  const isLoading = projectsQuery.isLoading;

  // Filter projects based on search, active tab, and additional filters
  const filterProjects = (projects: any[]) => {
    if (!projects) return [];
    
    let filtered = projects;
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        project => project.title.toLowerCase().includes(query) || 
                  project.description.toLowerCase().includes(query) ||
                  project.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by tab (difficulty)
    if (activeTab !== "all") {
      filtered = filtered.filter(project => project.difficulty.toLowerCase() === activeTab);
    }
    
    // Apply additional filters
    if (selectedFilters.category.length > 0) {
      filtered = filtered.filter(project => 
        selectedFilters.category.includes(project.category)
      );
    }
    
    if (selectedFilters.duration.length > 0) {
      filtered = filtered.filter(project => {
        // Determine project duration based on some criteria
        const duration = project.id % 3 === 0 ? "Short" : 
                        project.id % 3 === 1 ? "Medium" : "Long";
        return selectedFilters.duration.includes(duration);
      });
    }
    
    return filtered;
  };

  const projects = projectsQuery.data || [];
  const filteredProjects = filterProjects(projects);

  // Set badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800"
    };
    
    return colors[difficulty.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects", isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <CodeIcon className="mr-2 h-6 w-6 text-primary" />
              Project Challenges
            </h1>
            <p className="text-gray-500">Build real-world projects to enhance your portfolio</p>
          </div>
          
          {/* Search and filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => setShowFilterDialog(true)}
              >
                <FilterIcon className="h-4 w-4" />
                <span>Filters</span>
                {(selectedFilters.category.length > 0 || selectedFilters.duration.length > 0) && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedFilters.category.length + selectedFilters.duration.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          {/* Project tabs */}
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger value="all" className="px-4">All Levels</TabsTrigger>
              <TabsTrigger value="beginner" className="px-4">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate" className="px-4">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced" className="px-4">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <div className="flex justify-between mb-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-5/6 mb-4" />
                    <div className="mt-4">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project: any) => (
                <Card key={project.id} className="overflow-hidden flex flex-col">
                  {project.thumbnail && (
                    <div className="relative h-48">
                      <img
                        src={project.thumbnail}
                        alt={`${project.title} project thumbnail`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3">
                        <Badge className={getDifficultyColor(project.difficulty)}>
                          {project.difficulty}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="p-4 flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200">
                        {project.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500 gap-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>2-4 weeks</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <p className="text-gray-500 text-sm">{project.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mt-4 gap-1">
                      <UsersIcon className="h-3 w-3" />
                      <span>327 developers completed this project</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      View Project
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-gray-500 mb-4">Try changing your search criteria or browse all projects</p>
              <Button onClick={() => { setSearchQuery(""); setActiveTab("all"); }}>Clear filters</Button>
            </div>
          )}
        </main>
        
        {/* Filter Dialog */}
        <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Projects</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              {/* Category Filters */}
              <div>
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  {["Web Development", "Mobile App", "Data Science", "Game Development"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={selectedFilters.category.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFilters(prev => ({
                              ...prev,
                              category: [...prev.category, category]
                            }));
                          } else {
                            setSelectedFilters(prev => ({
                              ...prev,
                              category: prev.category.filter(c => c !== category)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Duration Filters */}
              <div>
                <h3 className="font-medium mb-3">Project Duration</h3>
                <div className="space-y-2">
                  {["Short", "Medium", "Long"].map((duration) => (
                    <div key={duration} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`duration-${duration}`} 
                        checked={selectedFilters.duration.includes(duration)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFilters(prev => ({
                              ...prev,
                              duration: [...prev.duration, duration]
                            }));
                          } else {
                            setSelectedFilters(prev => ({
                              ...prev,
                              duration: prev.duration.filter(d => d !== duration)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`duration-${duration}`}>{duration}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedFilters({ category: [], duration: [] });
                }}
              >
                Reset
              </Button>
              <Button onClick={() => setShowFilterDialog(false)}>Apply Filters</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
