import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircleIcon, TrophyIcon, BarChart2Icon, ClockIcon, UsersIcon, ArrowRightIcon } from "lucide-react";

export default function ChallengeResults() {
  const [match, params] = useRoute("/challenges/:id/results");
  const [, navigate] = useLocation();
  const challengeId = params?.id;
  
  // Fetch challenge data
  const { data: challenge, isLoading } = useQuery({
    queryKey: [`/api/challenges/${challengeId}`],
    enabled: !!challengeId,
    staleTime: 60000
  });

  // Mock submission results
  const submissionResults = {
    score: 92,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    executionTime: "45ms",
    testsPassed: 4,
    testsTotal: 4,
    rank: 23,
    totalParticipants: challenge?.participants || 0,
    submittedAt: new Date().toISOString()
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
            { label: "Challenge", href: `/challenges/${challengeId}` },
            { label: "Results", href: `/challenges/${challengeId}/results`, isCurrent: true }
          ]} />
          
          <main className="p-4 md:p-6">
            <Skeleton className="h-8 w-1/2 mb-6" />
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-40 w-full" />
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
          { label: "Results", href: `/challenges/${challengeId}/results`, isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Success Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-1">Solution Submitted Successfully!</h2>
                <p className="text-green-700">
                  Your solution to <span className="font-medium">{challenge?.title}</span> has been submitted and evaluated.
                </p>
              </div>
            </div>
            
            {/* Results Card */}
            <Card className="mb-8">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-xl">Submission Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Score */}
                  <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <TrophyIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Your Score</p>
                      <p className="text-3xl font-bold text-blue-800">{submissionResults.score}/100</p>
                    </div>
                  </div>
                  
                  {/* Rank */}
                  <div className="bg-purple-50 rounded-lg p-4 flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <BarChart2Icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-700">Your Rank</p>
                      <p className="text-3xl font-bold text-purple-800">
                        {submissionResults.rank}/{submissionResults.totalParticipants}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Detailed Results */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Time Complexity</p>
                    <p className="font-medium">{submissionResults.timeComplexity}</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Space Complexity</p>
                    <p className="font-medium">{submissionResults.spaceComplexity}</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Execution Time</p>
                    <p className="font-medium">{submissionResults.executionTime}</p>
                  </div>
                </div>
                
                <div className="mt-4 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Test Results</p>
                  <p className="font-medium">
                    {submissionResults.testsPassed}/{submissionResults.testsTotal} tests passed
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${(submissionResults.testsPassed / submissionResults.testsTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-6 text-sm text-gray-500 text-right">
                  Submitted on {new Date(submissionResults.submittedAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/challenges/${challengeId}/editor`)}
              >
                Edit Solution
              </Button>
              
              <Button 
                onClick={() => navigate(`/challenges/${challengeId}/leaderboard`)}
                className="gap-2"
              >
                View Leaderboard <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}