import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  BriefcaseIcon,
  BuildingIcon,
  MapPinIcon,
  ClockIcon,
  DollarSignIcon,
  GlobeIcon,
  CheckCircleIcon,
  UsersIcon,
  CalendarIcon,
  ArrowLeftIcon,
} from "lucide-react";

export default function JobDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const jobId = parseInt(params.id);

  // Fetch job details
  const jobQuery = useQuery({
    queryKey: [`/api/jobs/${jobId}`],
    staleTime: 60000,
    enabled: !isNaN(jobId)
  });

  const isLoading = jobQuery.isLoading;
  const job = jobQuery.data;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Handle apply button click
  const handleApply = () => {
    navigate(`/jobs/${jobId}/apply`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Jobs", href: "/jobs" },
          { label: job?.title || "Job Details", href: `/jobs/${jobId}`, isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/jobs")}
            className="mb-6 flex items-center"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>

          {isLoading ? (
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-48 mb-6" />
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-7 w-80 mb-2" />
                      <Skeleton className="h-5 w-64 mb-4" />
                      <div className="flex gap-4">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </div>
                  </div>
                  
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  
                  <Skeleton className="h-10 w-full max-w-xs" />
                </CardContent>
              </Card>
            </div>
          ) : job ? (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <p className="text-gray-500 flex items-center">
                  <BuildingIcon className="h-4 w-4 mr-1" />
                  {job.company} • 
                  <MapPinIcon className="h-4 w-4 mx-1" />
                  {job.location}
                </p>
              </div>
              
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                    {job.logoUrl && (
                      <img 
                        src={job.logoUrl} 
                        alt={`${job.company} logo`} 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center text-gray-700">
                          <ClockIcon className="mr-1 h-5 w-5 text-gray-500" />
                          <span>Posted {formatDate(job.postedAt)}</span>
                        </div>
                        
                        {job.salary && (
                          <div className="flex items-center text-gray-700">
                            <DollarSignIcon className="mr-1 h-5 w-5 text-gray-500" />
                            <span>{job.salary}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-gray-700">
                          <GlobeIcon className="mr-1 h-5 w-5 text-gray-500" />
                          <span>{job.location.toLowerCase().includes("remote") ? "Remote" : "On-site"}</span>
                        </div>
                      </div>
                      
                      <Button 
                        size="lg" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleApply}
                      >
                        Apply for this position
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                      <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {job.requirements?.map((req: string, index: number) => (
                          <li key={index}>{req}</li>
                        )) || (
                          <>
                            <li>3+ years of experience with modern JavaScript frameworks</li>
                            <li>Strong understanding of React and its core principles</li>
                            <li>Experience with RESTful APIs and GraphQL</li>
                            <li>Knowledge of modern authorization mechanisms</li>
                            <li>Familiarity with code versioning tools like Git</li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag: string, index: number) => (
                          <Badge key={index} className="text-sm py-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold mb-3">About {job.company}</h2>
                      <p className="text-gray-700">
                        {job.companyDescription || `${job.company} is a leading technology company focused on building innovative solutions for businesses and consumers alike. We're passionate about creating products that make a difference in people's lives.`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-center mb-8">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 px-8"
                  onClick={handleApply}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto text-center py-12">
              <BriefcaseIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Job not found</h2>
              <p className="text-gray-500 mb-6">The job you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate("/jobs")}>Browse All Jobs</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}