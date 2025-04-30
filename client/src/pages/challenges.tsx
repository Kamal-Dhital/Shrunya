import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { ChallengeCard } from "@/components/dashboard/challenge-card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrophyIcon, SearchIcon, FilterIcon, CalendarIcon, UsersIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Challenges() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch challenges data
  const challengesQuery = useQuery({
    queryKey: ["/api/challenges"],
    staleTime: 60000
  });

  const isLoading = challengesQuery.isLoading;

  // Filter challenges based on search and active tab
  const filterChallenges = (challenges: any[]) => {
    if (!challenges) return [];
    
    let filtered = challenges;
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        challenge => challenge.title.toLowerCase().includes(query) || 
                    challenge.description.toLowerCase().includes(query) ||
                    challenge.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(challenge => challenge.difficulty.toLowerCase() === activeTab.toLowerCase());
    }
    
    return filtered;
  };

  const challenges = challengesQuery.data || [];
  const filteredChallenges = filterChallenges(challenges);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <TrophyIcon className="mr-2 h-6 w-6 text-primary" />
              Weekly Challenges
            </h1>
            <p className="text-gray-500">Test your skills with coding challenges and compete with others</p>
          </div>
          
          {/* Active challenge highlight */}
          <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Badge className="bg-yellow-400 text-blue-900 hover:bg-yellow-500">
                  Featured Challenge
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Ends in 3 days</span>
                </div>
              </div>
              <CardTitle className="text-2xl mt-2">30 Days of Coding Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Join our 30-day coding challenge and build your coding habit. 
                Solve one problem every day and track your progress along with hundreds of other developers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5" />
                  <span>1,247 participants</span>
                </div>
                <Button className="bg-white text-blue-800 hover:bg-gray-100">
                  Join Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Search and filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search challenges..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-1">
                <FilterIcon className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
          </div>
          
          {/* Challenge tabs */}
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger value="all" className="px-4">All</TabsTrigger>
              <TabsTrigger value="easy" className="px-4">Easy</TabsTrigger>
              <TabsTrigger value="medium" className="px-4">Medium</TabsTrigger>
              <TabsTrigger value="hard" className="px-4">Hard</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Challenges list */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between mb-3">
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-60" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChallenges.map((challenge: any) => (
                <ChallengeCard
                  key={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  category={challenge.category}
                  difficulty={challenge.difficulty}
                  participants={challenge.participants}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No challenges found</h3>
              <p className="text-gray-500 mb-4">Try changing your search criteria or browse all challenges</p>
              <Button onClick={() => { setSearchQuery(""); setActiveTab("all"); }}>Clear filters</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
