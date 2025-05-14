import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  BriefcaseIcon,
  SearchIcon,
  FilterIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  EyeIcon,
} from "lucide-react";

export default function Applications() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch applications data
  const applicationsQuery = useQuery({
    queryKey: ["/api/user/applications"],
    staleTime: 60000
  });

  const isLoading = applicationsQuery.isLoading;
  const applications = applicationsQuery.data || [];

  // Filter applications based on active tab
  const filterApplications = (applications: any[]) => {
    if (!applications) return [];
    
    let filtered = applications;
    
    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter(app => app.status.toLowerCase() === activeTab);
    }
    
    return filtered;
  };

  const filteredApplications = filterApplications(applications);

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { bgColor: string, textColor: string, icon: JSX.Element }> = {
      pending: { 
        bgColor: "bg-yellow-100", 
        textColor: "text-yellow-800",
        icon: <AlertCircleIcon className="h-3 w-3 mr-1" />
      },
      reviewing: { 
        bgColor: "bg-blue-100", 
        textColor: "text-blue-800",
        icon: <ClockIcon className="h-3 w-3 mr-1" />
      },
      accepted: { 
        bgColor: "bg-green-100", 
        textColor: "text-green-800",
        icon: <CheckCircleIcon className="h-3 w-3 mr-1" />
      },
      rejected: { 
        bgColor: "bg-red-100", 
        textColor: "text-red-800",
        icon: <XCircleIcon className="h-3 w-3 mr-1" />
      },
    };
    
    return statusStyles[status.toLowerCase()] || { 
      bgColor: "bg-gray-100", 
      textColor: "text-gray-800",
      icon: <AlertCircleIcon className="h-3 w-3 mr-1" />
    };
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Profile", href: "/user/profile" },
          { label: "Applications", href: "/user/applications", isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold flex items-center">
                <BriefcaseIcon className="mr-2 h-6 w-6 text-primary" />
                Job Applications
              </h1>
              <p className="text-gray-500">Track and manage your job applications</p>
            </div>
            
            {/* Application status tabs */}
            <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger value="all" className="px-4">All Applications</TabsTrigger>
                <TabsTrigger value="pending" className="px-4">Pending</TabsTrigger>
                <TabsTrigger value="reviewing" className="px-4">Reviewing</TabsTrigger>
                <TabsTrigger value="accepted" className="px-4">Accepted</TabsTrigger>
                <TabsTrigger value="rejected" className="px-4">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Applications list */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-5 bg-gray-200 rounded w-1/5"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredApplications.length > 0 ? (
              <div className="space-y-4">
                {filteredApplications.map((application: any) => {
                  const statusBadge = getStatusBadge(application.status);
                  
                  return (
                    <Card key={application.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{application.jobTitle}</h3>
                            <p className="text-gray-600">{application.company}</p>
                          </div>
                          <Badge 
                            className={`${statusBadge.bgColor} ${statusBadge.textColor} flex items-center mt-2 md:mt-0`}
                          >
                            {statusBadge.icon}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            Applied on {formatDate(application.appliedAt)}
                          </div>
                          {application.responseDate && (
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              Response on {formatDate(application.responseDate)}
                            </div>
                          )}
                          <div>
                            Application ID: {application.id}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => navigate(`/jobs/${application.jobId}`)}
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            View Job
                          </Button>
                          
                          {application.status === "accepted" && (
                            <Button 
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <CheckCircleIcon className="h-3.5 w-3.5" />
                              Schedule Interview
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BriefcaseIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No applications found</h3>
                  <p className="text-gray-500 mb-6">You haven't applied to any jobs yet</p>
                  <Button onClick={() => navigate("/jobs")}>Browse Jobs</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}