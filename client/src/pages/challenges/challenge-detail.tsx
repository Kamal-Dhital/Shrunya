import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrophyIcon, UsersIcon, ClockIcon, ArrowRightIcon, BarChartIcon } from "lucide-react";

export default function ChallengeDetail() {
  const [match, params] = useRoute("/challenges/:id");
  const [, navigate] = useLocation();
  const challengeId = params?.id;
  
  // Fetch challenge data
  const { data: challenge, isLoading } = useQuery({
    queryKey: [`/api/challenges/${challengeId}`],
    enabled: !!challengeId,
    staleTime: 60000
  });

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, { bgColor: string, textColor: string }> = {
      Easy: { bgColor: "bg-green-100", textColor: "text-green-600" },
      Medium: { bgColor: "bg-yellow-100", textColor: "text-yellow-600" },
      Hard: { bgColor: "bg-orange-100", textColor: "text-orange-600" },
    };
    
    return colors[difficulty] || { bgColor: "bg-gray-100", textColor: "text-gray-600" };
  };

  const handleStartChallenge = () => {
    navigate(`/challenges/${challengeId}/editor`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto md:ml-64">
          <Header />
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Challenges", href: "/challenges" },
            { label: "Challenge Details", href: `/challenges/${challengeId}`, isCurrent: true }
          ]} />
          
          <main className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-8" />
              
              <div className="space-y-6">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              
              <div className="mt-8">
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto md:ml-64">
          <Header />
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Challenges", href: "/challenges" },
            { label: "Challenge Not Found", href: `/challenges/${challengeId}`, isCurrent: true }
          ]} />
          
          <main className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Challenge Not Found</h1>
              <p className="text-gray-500 mb-6">The challenge you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate("/challenges")}>Back to Challenges</Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const difficultyStyle = getDifficultyColor(challenge.difficulty);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Challenges", href: "/challenges" },
          { label: challenge.title, href: `/challenges/${challengeId}`, isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Challenge Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${difficultyStyle.bgColor} ${difficultyStyle.textColor}`}
                >
                  {challenge.difficulty}
                </span>
                <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200">
                  {challenge.category}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <TrophyIcon className="h-7 w-7 text-yellow-500" />
                {challenge.title}
              </h1>
              <p className="text-gray-500">{challenge.description}</p>
            </div>
            
            {/* Challenge Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <UsersIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium">{challenge.participants}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Time Limit</p>
                    <p className="font-medium">2 hours</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <BarChartIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="font-medium">68%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Challenge Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Challenge Details</h2>
              <div className="prose max-w-none">
                <p>
                  In this challenge, you will need to implement a solution to the problem described below. 
                  Your code will be evaluated based on correctness, efficiency, and code quality.
                </p>
                
                <h3 className="text-lg font-medium mt-4 mb-2">Problem Statement</h3>
                <p>
                  {challenge.description}
                </p>
                
                <h3 className="text-lg font-medium mt-4 mb-2">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your solution must handle all edge cases</li>
                  <li>Optimize for both time and space complexity</li>
                  <li>Include comments explaining your approach</li>
                  <li>All test cases must pass</li>
                </ul>
                
                <h3 className="text-lg font-medium mt-4 mb-2">Example</h3>
                <pre className="bg-gray-100 p-3 rounded">
                  <code>
                    Input: [1, 2, 3, 4, 5]<br />
                    Output: 15
                  </code>
                </pre>
              </div>
            </div>
            
            {/* Start Challenge Button */}
            <div className="mb-8 flex justify-between items-center">
              <Button 
                size="lg" 
                className="gap-2" 
                onClick={handleStartChallenge}
              >
                Start Challenge <ArrowRightIcon className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate(`/challenges/${challengeId}/leaderboard`)}
              >
                View Leaderboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}