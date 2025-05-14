import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DiscussionCard } from "@/components/dashboard/discussion-card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquareIcon, SearchIcon, FilterIcon, TrendingUpIcon, UsersIcon, ZapIcon, ClockIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { navigate } from "wouter/use-browser-location";

export default function Community() {
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch discussions data
  const discussionsQuery = useQuery({
    queryKey: ["/api/discussions"],
    staleTime: 60000
  });

  const isLoading = discussionsQuery.isLoading;
  const discussions = discussionsQuery.data || [];

  // Filter discussions based on search and active tab
  const filterDiscussions = (discussions: any[]) => {
    if (!discussions) return [];
    
    let filtered = discussions;
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        discussion => discussion.title.toLowerCase().includes(query) || 
                     discussion.content.toLowerCase().includes(query) ||
                     discussion.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort based on active tab
    if (activeTab === "trending") {
      filtered = [...filtered].sort((a, b) => b.views - a.views);
    } else if (activeTab === "recent") {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeTab === "top") {
      filtered = [...filtered].sort((a, b) => b.upvotes - a.upvotes);
    }
    
    return filtered;
  };

  const filteredDiscussions = filterDiscussions(discussions);

  // Popular tags extracted from all discussions
  const getPopularTags = () => {
    if (!discussions) return [];
    
    const tagCounts: Record<string, number> = {};
    discussions.forEach((discussion: any) => {
      discussion.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
      .slice(0, 10)
      .map(([tag]) => tag);
  };

  const popularTags = getPopularTags();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Community", href: "/community", isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <MessageSquareIcon className="mr-2 h-6 w-6 text-primary" />
              Community Forum
            </h1>
            <p className="text-gray-500">Discuss, learn, and share with fellow developers</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* Create post button and search */}
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <Button 
                  className="bg-primary"
                  onClick={() => navigate("/community/create-post")}
                >
                  <MessageSquareIcon className="mr-2 h-4 w-4" />
                  Create New Post
                </Button>
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search discussions..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Discussion tabs */}
              <Tabs defaultValue="trending" className="mb-6" onValueChange={setActiveTab}>
                <TabsList className="bg-gray-100 p-1">
                  <TabsTrigger value="trending" className="px-4 flex items-center gap-1">
                    <TrendingUpIcon className="h-4 w-4" />
                    <span>Trending</span>
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="px-4 flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>Recent</span>
                  </TabsTrigger>
                  <TabsTrigger value="top" className="px-4 flex items-center gap-1">
                    <ZapIcon className="h-4 w-4" />
                    <span>Top</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* Discussions list */}
              {isLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm mb-4 p-4">
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <Skeleton className="h-6 w-6 mb-1" />
                          <Skeleton className="h-4 w-4 mb-1" />
                          <Skeleton className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Skeleton className="h-6 w-6 rounded-full mr-2" />
                            <Skeleton className="h-4 w-28" />
                          </div>
                          <Skeleton className="h-6 w-full mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-5/6 mb-3" />
                          <div className="flex flex-wrap gap-2 mb-3">
                            {[1, 2, 3, 4].map((j) => (
                              <Skeleton key={j} className="h-6 w-16" />
                            ))}
                          </div>
                          <div className="flex">
                            <Skeleton className="h-4 w-24 mr-4" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : filteredDiscussions.length > 0 ? (
                <>
                  {filteredDiscussions.map((discussion: any) => (
                    <DiscussionCard
                      key={discussion.id}
                      title={discussion.title}
                      content={discussion.content}
                      author={discussion.user}
                      createdAt={new Date(discussion.createdAt)}
                      upvotes={discussion.upvotes}
                      comments={discussion.comments}
                      views={discussion.views}
                      tags={discussion.tags}
                    />
                  ))}
                </>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <MessageSquareIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No discussions found</h3>
                  <p className="text-gray-500 mb-4">Try changing your search or be the first to start a discussion</p>
                  <Button onClick={() => navigate("/community/create-post")}>Create New Post</Button>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Community stats */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <UsersIcon className="mr-2 h-5 w-5 text-primary" />
                    Community Stats
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Active Members</p>
                      <p className="font-semibold text-lg">2,547</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Topics</p>
                      <p className="font-semibold text-lg">1,283</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Posts</p>
                      <p className="font-semibold text-lg">8,942</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Popular tags */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                        onClick={() => setSearchQuery(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
