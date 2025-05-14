import { useState, useEffect, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { NotificationContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Github,
  Star,
  GitFork,
  Code,
  RefreshCw,
  ExternalLink,
  AlertCircle
} from "lucide-react";

interface GitHubProfileProps {
  username?: string;
}

// Mock GitHub data for demo
const mockRepos = [
  {
    id: 1,
    name: "react-portfolio",
    html_url: "https://github.com/username/react-portfolio",
    description: "My personal portfolio built with React and Tailwind CSS",
    fork: false,
    stargazers_count: 12,
    forks_count: 3,
    language: "TypeScript",
    topics: ["react", "tailwindcss", "portfolio"]
  },
  {
    id: 2,
    name: "blog-platform",
    html_url: "https://github.com/username/blog-platform",
    description: "A full-stack blog platform with Next.js and MongoDB",
    fork: false,
    stargazers_count: 43,
    forks_count: 8,
    language: "TypeScript",
    topics: ["nextjs", "mongodb", "blog"]
  },
  {
    id: 3,
    name: "algorithm-challenges",
    html_url: "https://github.com/username/algorithm-challenges",
    description: "Solutions to various algorithm and data structure problems",
    fork: false,
    stargazers_count: 6,
    forks_count: 2,
    language: "JavaScript",
    topics: ["algorithms", "data-structures", "leetcode"]
  }
];

const mockProfile = {
  login: "github_user",
  name: "GitHub User",
  avatar_url: "https://avatars.githubusercontent.com/u/12345678",
  html_url: "https://github.com/github_user",
  bio: "Software developer passionate about web technologies and open source",
  public_repos: 15,
  followers: 45,
  following: 32,
  created_at: "2020-01-15T00:00:00Z",
  updated_at: "2023-04-12T00:00:00Z"
};

export default function GitHubProfile({ username = "github_user" }: GitHubProfileProps) {
  const { toast } = useToast();
  const { addNotification } = useContext(NotificationContext);
  const [profile, setProfile] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  
  // Simulate fetching GitHub data
  useEffect(() => {
    if (connected) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, we would fetch from GitHub API:
          // const profileResponse = await fetch(`https://api.github.com/users/${username}`);
          // const profileData = await profileResponse.json();
          // 
          // const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`);
          // const reposData = await reposResponse.json();
          
          // For demo, use mock data
          setProfile(mockProfile);
          setRepos(mockRepos);
        } catch (err) {
          setError("Failed to fetch GitHub data. Please try again later.");
          console.error("Error fetching GitHub data:", err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [username, connected]);
  
  // Simulate connecting GitHub account
  const handleConnect = async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would redirect to GitHub OAuth flow
      setConnected(true);
      
      toast({
        title: "GitHub Connected",
        description: "Your GitHub account has been successfully connected!",
      });
      
      addNotification({
        title: "GitHub Integration",
        message: "Your GitHub account is now connected to your SHRUNYA profile.",
        type: "success"
      });
    } catch (error) {
      setError("Failed to connect GitHub account. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle disconnect
  const handleDisconnect = async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnected(false);
      setProfile(null);
      setRepos([]);
      
      toast({
        title: "GitHub Disconnected",
        description: "Your GitHub account has been disconnected.",
      });
    } catch (error) {
      setError("Failed to disconnect GitHub account. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    if (!connected) return;
    
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would re-fetch from GitHub API
      // For demo, just simulate a refresh
      setProfile({ ...mockProfile });
      setRepos([...mockRepos]);
      
      toast({
        title: "GitHub Data Refreshed",
        description: "Your GitHub data has been updated.",
      });
    } catch (error) {
      setError("Failed to refresh GitHub data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  
  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Github className="mr-2 h-5 w-5" />
            GitHub Integration
          </CardTitle>
          <CardDescription>
            Connect your GitHub account to showcase your repositories and contributions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Github className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Showcase Your Code</h3>
          <p className="text-center text-muted-foreground mb-6 max-w-md">
            Connect your GitHub account to display your repositories, contributions, and coding activity directly in your profile.
          </p>
          <Button 
            onClick={handleConnect} 
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Github className="h-4 w-4" />
                Connect GitHub Account
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Github className="mr-2 h-5 w-5" />
              GitHub Profile
            </CardTitle>
            <CardDescription>
              Your connected GitHub account and repositories
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {/* Profile Section */}
        <div className="flex items-start gap-4">
          {loading ? (
            <>
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
                <Skeleton className="h-3 w-24" />
              </div>
            </>
          ) : profile ? (
            <>
              <img 
                src={profile.avatar_url} 
                alt={profile.name} 
                className="h-16 w-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <a 
                  href={profile.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  @{profile.login}
                  <ExternalLink className="h-3 w-3" />
                </a>
                <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>
                <div className="flex gap-4 mt-2">
                  <div className="text-xs">
                    <span className="font-medium">{profile.public_repos}</span> repositories
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">{profile.followers}</span> followers
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">{profile.following}</span> following
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
        
        <Separator />
        
        {/* Repositories Section */}
        <div>
          <h3 className="text-sm font-medium mb-3">Recent Repositories</h3>
          <div className="space-y-4">
            {loading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="border rounded-md p-4 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))
            ) : repos.length > 0 ? (
              repos.map(repo => (
                <div key={repo.id} className="border rounded-md p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium hover:underline flex items-center gap-1"
                    >
                      {repo.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 mr-1" />
                        {repo.stargazers_count}
                      </div>
                      <div className="flex items-center">
                        <GitFork className="h-3.5 w-3.5 mr-1" />
                        {repo.forks_count}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground my-2">{repo.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {repo.language && (
                      <div className="flex items-center text-xs">
                        <Code className="h-3.5 w-3.5 mr-1 text-primary" />
                        {repo.language}
                      </div>
                    )}
                    {repo.topics?.map(topic => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No repositories found.</p>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {profile ? `Joined GitHub on ${formatDate(profile.created_at)}` : ''}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDisconnect}
          disabled={loading}
        >
          Disconnect GitHub
        </Button>
      </CardFooter>
    </Card>
  );
}