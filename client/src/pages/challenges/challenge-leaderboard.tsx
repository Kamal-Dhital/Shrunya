import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrophyIcon, MedalIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function ChallengeLeaderboard() {
  const [match, params] = useRoute("/challenges/:id/leaderboard");
  const [, navigate] = useLocation();
  const challengeId = params?.id;
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch challenge data
  const { data: challenge, isLoading } = useQuery({
    queryKey: [`/api/challenges/${challengeId}`],
    enabled: !!challengeId,
    staleTime: 60000
  });

  // Mock leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      user: {
        id: 1,
        name: "Sarah Williams",
        username: "sarah_williams",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face"
      },
      score: 100,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      executionTime: "32ms",
      submittedAt: "2023-06-15T14:23:45Z"
    },
    {
      rank: 2,
      user: {
        id: 2,
        name: "Michael Chen",
        username: "michael_chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face"
      },
      score: 98,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      executionTime: "38ms",
      submittedAt: "2023-06-15T12:45:22Z"
    },
    {
      rank: 3,
      user: {
        id: 3,
        name: "Sophia Rodriguez",
        username: "sophia_rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face"
      },
      score: 95,
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      executionTime: "41ms",
      submittedAt: "2023-06-15T10:12:33Z"
    },
    {
      rank: 4,
      user: {
        id: 4,
        name: "David Kumar",
        username: "david_kumar",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=face"
      },
      score: 92,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      executionTime: "45ms",
      submittedAt: "2023-06-15T09:34:18Z"
    },
    {
      rank: 5,
      user: {
        id: 5,
        name: "Emma Johnson",
        username: "emma_j",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face"
      },
      score: 90,
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      executionTime: "52ms",
      submittedAt: "2023-06-15T08:22:05Z"
    },
    {
      rank: 6,
      user: {
        id: 6,
        name: "James Wilson",
        username: "jwilson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face"
      },
      score: 88,
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      executionTime: "58ms",
      submittedAt: "2023-06-15T07:15:42Z"
    },
    {
      rank: 7,
      user: {
        id: 7,
        name: "Olivia Martinez",
        username: "olivia_m",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&crop=face"
      },
      score: 85,
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      executionTime: "63ms",
      submittedAt: "2023-06-15T06:08:19Z"
    },
    {
      rank: 8,
      user: {
        id: 8,
        name: "Noah Thompson",
        username: "noah_t",
        avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=128&h=128&fit=crop&crop=face"
      },
      score: 82,
      timeComplexity: "O(n^2)",
      spaceComplexity: "O(1)",
      executionTime: "78ms",
      submittedAt: "2023-06-15T05:45:33Z"
    }
  ];

  // Filter leaderboard based on search
  const filteredLeaderboard = searchQuery.trim() === "" 
    ? leaderboardData 
    : leaderboardData.filter(entry => 
        entry.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Find current user's rank (for demo, we'll use rank 4)
  const currentUserRank = leaderboardData.find(entry => entry.rank === 4);

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto md:ml-64">
          <Header />
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Challenges", href: "/challenges" },
            { label: "Challenge", href: `/challenges/${challengeId}` },
            { label: "Leaderboard", href: `/challenges/${challengeId}/leaderboard`, isCurrent: true }
          ]} />
          
          <main className="p-4 md:p-6">
            <Skeleton className="h-8 w-1/2 mb-6" />
            <Skeleton className="h-12 w-full mb-6" />
            <Skeleton className="h-64 w-full" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Challenges", href: "/challenges" },
          { label: challenge?.title || "Challenge", href: `/challenges/${challengeId}` },
          { label: "Leaderboard", href: `/challenges/${challengeId}/leaderboard`, isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            {/* Leaderboard Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <TrophyIcon className="h-6 w-6 text-yellow-500" />
                {challenge?.title} Leaderboard
              </h1>
              <p className="text-gray-500">
                See how you rank against {challenge?.participants || 'other'} participants in this challenge.
              </p>
            </div>
            
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search participants..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Your Rank */}
            {currentUserRank && (
              <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-blue-800">Your Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 rounded-full p-2 w-10 h-10 flex items-center justify-center text-blue-800 font-bold">
                        {currentUserRank.rank}
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={currentUserRank.user.avatar} alt={currentUserRank.user.name} />
                          <AvatarFallback>{currentUserRank.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{currentUserRank.user.name}</p>
                          <p className="text-sm text-gray-500">@{currentUserRank.user.username}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-800">{currentUserRank.score}</p>
                      <p className="text-sm text-blue-700">points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Leaderboard */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Rank</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Time</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Complexity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeaderboard.map((entry) => (
                        <tr 
                          key={entry.rank} 
                          className={`border-b border-gray-100 hover:bg-gray-50 ${entry.rank === 4 ? 'bg-blue-50' : ''}`}
                        >
                          <td className="py-3 px-4">
                            {entry.rank <= 3 ? (
                              <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center
                                ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                                  entry.rank === 2 ? 'bg-gray-100 text-gray-700' : 
                                  'bg-orange-100 text-orange-700'}
                              `}>
                                <MedalIcon className="h-4 w-4" />
                              </div>
                            ) : (
                              <span className="font-medium">{entry.rank}</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                                <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{entry.user.name}</p>
                                <p className="text-sm text-gray-500">@{entry.user.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold">{entry.score}</span>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">{entry.executionTime}</td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <div>
                              <p>Time: {entry.timeComplexity}</p>
                              <p className="text-sm text-gray-500">Space: {entry.spaceComplexity}</p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredLeaderboard.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No results found for "{searchQuery}"</p>
                    <Button 
                      variant="link" 
                      onClick={() => setSearchQuery("")}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Actions */}
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/challenges/${challengeId}/results`)}
              >
                Back to Results
              </Button>
              
              <Button 
                onClick={() => navigate(`/challenges`)}
              >
                Browse More Challenges
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}