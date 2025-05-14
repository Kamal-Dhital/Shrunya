import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  GitPullRequestIcon,
  GitCommitIcon,
  GitForkIcon,
  StarIcon,
  CodeIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  RefreshCwIcon
} from "lucide-react";

import { GithubIcon } from "lucide-react";

interface GitHubStats {
  totalContributions: number;
  pullRequests: number;
  commits: number;
  repositories: number;
  stars: number;
  forks: number;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
  url: string;
}

interface Contribution {
  date: string;
  count: number;
}

interface PullRequest {
  id: number;
  title: string;
  repository: string;
  status: "open" | "closed" | "merged";
  createdAt: string;
  url: string;
}

interface Commit {
  id: string;
  message: string;
  repository: string;
  date: string;
  url: string;
}

export function GitHubIntegration({ username }: { username?: string }) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);

  // Mock GitHub connection
  const handleConnectGitHub = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      
      // Load mock data
      loadMockData();
      
      toast({
        title: "GitHub Connected",
        description: "Your GitHub account has been successfully connected.",
        variant: "default",
      });
    }, 1500);
  };

  // Mock data loading
  const loadMockData = () => {
    // Mock GitHub stats
    setGithubStats({
      totalContributions: 827,
      pullRequests: 42,
      commits: 364,
      repositories: 15,
      stars: 128,
      forks: 37
    });

    // Mock repositories
    setRepositories([
      {
        id: 1,
        name: "react-dashboard",
        description: "A responsive dashboard template built with React and Tailwind CSS",
        stars: 48,
        forks: 12,
        language: "TypeScript",
        updatedAt: "2023-10-15",
        url: "https://github.com/username/react-dashboard"
      },
      {
        id: 2,
        name: "node-api-starter",
        description: "A starter template for Node.js APIs with Express and MongoDB",
        stars: 32,
        forks: 8,
        language: "JavaScript",
        updatedAt: "2023-09-22",
        url: "https://github.com/username/node-api-starter"
      },
      {
        id: 3,
        name: "vue-component-library",
        description: "A collection of reusable Vue.js components",
        stars: 27,
        forks: 5,
        language: "Vue",
        updatedAt: "2023-11-03",
        url: "https://github.com/username/vue-component-library"
      },
      {
        id: 4,
        name: "python-data-analysis",
        description: "Data analysis tools and examples using Python and pandas",
        stars: 21,
        forks: 7,
        language: "Python",
        updatedAt: "2023-08-17",
        url: "https://github.com/username/python-data-analysis"
      }
    ]);

    // Mock contributions (last 10 days)
    const today = new Date();
    const contributions = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      contributions.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 8) // 0-7 contributions per day
      });
    }
    setContributions(contributions);

    // Mock pull requests
    setPullRequests([
      {
        id: 1,
        title: "Add dark mode support",
        repository: "react-dashboard",
        status: "merged",
        createdAt: "2023-10-12",
        url: "https://github.com/username/react-dashboard/pull/42"
      },
      {
        id: 2,
        title: "Fix authentication middleware bug",
        repository: "node-api-starter",
        status: "closed",
        createdAt: "2023-09-18",
        url: "https://github.com/username/node-api-starter/pull/27"
      },
      {
        id: 3,
        title: "Implement responsive table component",
        repository: "vue-component-library",
        status: "open",
        createdAt: "2023-11-01",
        url: "https://github.com/username/vue-component-library/pull/15"
      }
    ]);

    // Mock commits
    setCommits([
      {
        id: "abc123",
        message: "Fix responsive layout issues on mobile devices",
        repository: "react-dashboard",
        date: "2023-10-14",
        url: "https://github.com/username/react-dashboard/commit/abc123"
      },
      {
        id: "def456",
        message: "Add unit tests for authentication service",
        repository: "node-api-starter",
        date: "2023-09-20",
        url: "https://github.com/username/node-api-starter/commit/def456"
      },
      {
        id: "ghi789",
        message: "Update documentation for component props",
        repository: "vue-component-library",
        date: "2023-11-02",
        url: "https://github.com/username/vue-component-library/commit/ghi789"
      },
      {
        id: "jkl012",
        message: "Optimize data processing functions",
        repository: "python-data-analysis",
        date: "2023-08-15",
        url: "https://github.com/username/python-data-analysis/commit/jkl012"
      }
    ]);
  };

  // Refresh GitHub data
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      loadMockData();
      setIsLoading(false);
      
      toast({
        title: "Data Refreshed",
        description: "Your GitHub data has been refreshed.",
        variant: "default",
      });
    }, 1000);
  };

  // Render contribution graph
  const renderContributionGraph = () => {
    if (!contributions.length) return null;
    
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Contribution Activity (Last 30 Days)</h3>
        <div className="flex flex-wrap gap-1">
          {contributions.map((day, index) => (
            <div 
              key={index}
              className={`w-4 h-4 rounded-sm ${getContributionColor(day.count)}`}
              title={`${day.date}: ${day.count} contributions`}
            />
          ))}
        </div>
        <div className="flex items-center justify-end mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 mr-3">
            <div className="w-3 h-3 rounded-sm bg-green-100" />
            <span>Less</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <span>More</span>
          </div>
        </div>
      </div>
    );
  };

  // Get contribution color based on count
  const getContributionColor = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count < 3) return "bg-green-100";
    if (count < 5) return "bg-green-300";
    return "bg-green-500";
  };

  // Get status badge for pull requests
  const getStatusBadge = (status: "open" | "closed" | "merged") => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Open</Badge>;
      case "closed":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Closed</Badge>;
      case "merged":
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Merged</Badge>;
      default:
        return null;
    }
  };

  // Get language badge
  const getLanguageBadge = (language: string) => {
    const colors: Record<string, string> = {
      TypeScript: "bg-blue-50 text-blue-600 border-blue-200",
      JavaScript: "bg-yellow-50 text-yellow-600 border-yellow-200",
      Python: "bg-green-50 text-green-600 border-green-200",
      Vue: "bg-emerald-50 text-emerald-600 border-emerald-200",
      React: "bg-cyan-50 text-cyan-600 border-cyan-200",
      HTML: "bg-orange-50 text-orange-600 border-orange-200",
      CSS: "bg-purple-50 text-purple-600 border-purple-200"
    };
    
    return (
      <Badge 
        variant="outline" 
        className={colors[language] || "bg-gray-50 text-gray-600 border-gray-200"}
      >
        {language}
      </Badge>
    );
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <GithubIcon className="mr-2 h-5 w-5" />
            GitHub Integration
          </CardTitle>
          <CardDescription>
            Connect your GitHub account to showcase your contributions and projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <GithubIcon className="h-16 w-16 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Connect Your GitHub Account</h3>
            <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
              Showcase your open source contributions, repositories, pull requests, and commit history.
            </p>
            <Button onClick={handleConnectGitHub} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Connecting...
                </>
              ) : (
                <>
                  <GithubIcon className="mr-2 h-4 w-4" />
                  Connect GitHub
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold flex items-center">
            <GithubIcon className="mr-2 h-5 w-5" />
            GitHub Activity
          </CardTitle>
          <CardDescription>
            Your open source contributions and projects.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <>
              <RefreshCwIcon className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            {/* GitHub Stats */}
            {githubStats && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{githubStats.totalContributions}</div>
                  <div className="text-sm text-muted-foreground">Contributions</div>
                </div>
                <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{githubStats.repositories}</div>
                  <div className="text-sm text-muted-foreground">Repositories</div>
                </div>
                <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{githubStats.pullRequests}</div>
                  <div className="text-sm text-muted-foreground">Pull Requests</div>
                </div>
                <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{githubStats.commits}</div>
                  <div className="text-sm text-muted-foreground">Commits</div>
                </div>
                <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{githubStats.stars}</div>
                  <div className="text-sm text-muted-foreground">Stars Received</div>
                </div>
                <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{githubStats.forks}</div>
                  <div className="text-sm text-muted-foreground">Forks</div>
                </div>
              </div>
            )}

            {/* Contribution Graph */}
            {renderContributionGraph()}

            {/* Tabs for different GitHub data */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="repositories">Repositories</TabsTrigger>
                <TabsTrigger value="pullRequests">Pull Requests</TabsTrigger>
                <TabsTrigger value="commits">Commits</TabsTrigger>
              </TabsList>
              
              {/* Repositories Tab */}
              <TabsContent value="repositories" className="space-y-4 mt-4">
                {repositories.map(repo => (
                  <div key={repo.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-primary">
                        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {repo.name}
                        </a>
                      </h3>
                      {getLanguageBadge(repo.language)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{repo.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className="flex items-center mr-4">
                        <StarIcon className="h-3.5 w-3.5 mr-1" />
                        <span>{repo.stars}</span>
                      </div>
                      <div className="flex items-center mr-4">
                        <GitForkIcon className="h-3.5 w-3.5 mr-1" />
                        <span>{repo.forks}</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                        <span>Updated on {new Date(repo.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              {/* Pull Requests Tab */}
              <TabsContent value="pullRequests" className="space-y-4 mt-4">
                {pullRequests.map(pr => (
                  <div key={pr.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold flex items-center">
                        <GitPullRequestIcon className="h-4 w-4 mr-2" />
                        <a href={pr.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                          {pr.title}
                        </a>
                      </h3>
                      {getStatusBadge(pr.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      in <span className="font-medium">{pr.repository}</span>
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <CalendarIcon className="h-3.5 w-3.5 inline mr-1" />
                      Created on {new Date(pr.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              {/* Commits Tab */}
              <TabsContent value="commits" className="space-y-4 mt-4">
                {commits.map(commit => (
                  <div key={commit.id} className="p-4 border rounded-lg">
                    <div className="flex items-start mb-2">
                      <GitCommitIcon className="h-4 w-4 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">
                          <a href={commit.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                            {commit.message}
                          </a>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          in <span className="font-medium">{commit.repository}</span>
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <CalendarIcon className="h-3.5 w-3.5 inline mr-1" />
                          Committed on {new Date(commit.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}