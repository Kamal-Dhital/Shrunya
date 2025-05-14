import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CodeIcon, ClockIcon, UsersIcon, CheckCircleIcon, ArrowRightIcon } from "lucide-react";

export default function ProjectDetail() {
  const [match, params] = useRoute("/projects/:id");
  const [, navigate] = useLocation();
  const projectId = params?.id;
  
  // Fetch project data
  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
    staleTime: 60000
  });

  // Set badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800"
    };
    
    return colors[difficulty?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const handleStartProject = () => {
    navigate(`/projects/${projectId}/editor`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto md:ml-64">
          <Header />
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: "Project Details", href: `/projects/${projectId}`, isCurrent: true }
          ]} />
          
          <main className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-8" />
              
              <Skeleton className="h-64 w-full mb-8 rounded-lg" />
              
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

  if (!project) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto md:ml-64">
          <Header />
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: "Project Not Found", href: `/projects/${projectId}`, isCurrent: true }
          ]} />
          
          <main className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
              <p className="text-gray-500 mb-6">The project you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
            </div>
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
          { label: "Projects", href: "/projects" },
          { label: project.title, href: `/projects/${projectId}`, isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Project Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getDifficultyColor(project.difficulty)}>
                  {project.difficulty}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200">
                  {project.category}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <p className="text-gray-500">{project.description}</p>
            </div>
            
            {/* Project Image */}
            {project.thumbnail && (
              <div className="mb-8 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={project.thumbnail}
                  alt={`${project.title} project thumbnail`}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            
            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Estimated Time</p>
                    <p className="font-medium">2-4 weeks</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <UsersIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Developers</p>
                    <p className="font-medium">327 completed</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <CodeIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Tech Stack</p>
                    <p className="font-medium">HTML, CSS, JavaScript</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Project Requirements */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Project Requirements</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Create a responsive design that works on mobile and desktop</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Implement all core features described in the project brief</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Write clean, well-documented code with proper organization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Include a README file with setup instructions</span>
                </li>
              </ul>
            </div>
            
            {/* Start Project Button */}
            <div className="mb-8">
              <Button 
                size="lg" 
                className="gap-2" 
                onClick={handleStartProject}
              >
                Start Project <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}