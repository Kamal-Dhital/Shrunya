import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircleIcon,
  ClipboardListIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  ClockIcon,
} from "lucide-react";

export default function JobSuccess() {
  const params = useParams();
  const [, navigate] = useLocation();
  const jobId = parseInt(params.id);
  const [applicationId] = useState("APP-" + Math.floor(Math.random() * 10000));
  
  // Fetch job details
  const jobQuery = useQuery({
    queryKey: [`/api/jobs/${jobId}`],
    staleTime: 60000,
    enabled: !isNaN(jobId)
  });

  const job = jobQuery.data;
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Calculate estimated response date (7 business days from now)
  const getEstimatedResponseDate = () => {
    const date = new Date();
    let businessDays = 7;
    while (businessDays > 0) {
      date.setDate(date.getDate() + 1);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        businessDays--;
      }
    }
    return formatDate(date);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Jobs", href: "/jobs" },
          { label: job?.title || "Job", href: `/jobs/${jobId}` },
          { label: "Application Status", href: `/jobs/${jobId}/success`, isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <Card className="border-green-100">
              <CardContent className="pt-10 pb-8 px-8 text-center">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircleIcon className="h-10 w-10 text-green-500" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h1>
                  <p className="text-gray-600 max-w-md">
                    Thank you for applying to {job?.title} at {job?.company}. Your application has been received.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                  <h2 className="text-lg font-semibold mb-4">Application Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Application ID:</span>
                      <span className="font-medium">{applicationId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Position:</span>
                      <span className="font-medium">{job?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Company:</span>
                      <span className="font-medium">{job?.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date Applied:</span>
                      <span className="font-medium">{formatDate(new Date())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium text-amber-600">Under Review</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estimated Response:</span>
                      <span className="font-medium">{getEstimatedResponseDate()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">What's Next?</h2>
                  <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => navigate("/user/applications")}
                    >
                      <ClipboardListIcon className="h-4 w-4" />
                      View All Applications
                    </Button>
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => navigate("/jobs")}
                    >
                      <BriefcaseIcon className="h-4 w-4" />
                      Browse More Jobs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
              <ClockIcon className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Application Timeline</h3>
                <p className="text-amber-700 text-sm">
                  The hiring team will review your application and get back to you within 7 business days. You can check your application status in your profile.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}