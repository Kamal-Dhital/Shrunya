import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  BriefcaseIcon,
  ArrowLeftIcon,
  FileTextIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  LinkIcon,
  CheckIcon,
  Loader2Icon,
} from "lucide-react";

export default function JobApply() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const jobId = parseInt(params.id);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    portfolio: "",
    coverLetter: "",
    resume: null as File | null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  // Fetch job details
  const jobQuery = useQuery({
    queryKey: [`/api/jobs/${jobId}`],
    staleTime: 60000,
    enabled: !isNaN(jobId)
  });

  const isLoading = jobQuery.isLoading;
  const job = jobQuery.data;

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        resume: e.target.files![0]
      }));
    }
  };

  // Application submission mutation
  const submitMutation = useMutation({
    mutationFn: (data: any) => {
      // Simulate submission process with delay
      return new Promise<void>((resolve) => {
        setIsSubmitting(true);
        // Progress animation
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setSubmitProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            resolve();
          }
        }, 300);
      }).then(() => {
        // Then make the actual API call (mocked for now)
        return apiRequest("POST", "/api/job-applications", data);
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Your job application has been successfully submitted.",
        variant: "default",
      });
      // Navigate to success page
      navigate(`/jobs/${jobId}/success`);
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.coverLetter) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Submit application
    submitMutation.mutate({
      jobId,
      ...formData,
      appliedAt: new Date().toISOString(),
      status: "pending"
    });
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
          { label: "Apply", href: `/jobs/${jobId}/apply`, isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/jobs/${jobId}`)}
            className="mb-6 flex items-center"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Job Details
          </Button>

          {isLoading ? (
            <div className="max-w-3xl mx-auto">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-48 mb-6" />
              
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-32" />
                </CardFooter>
              </Card>
            </div>
          ) : job ? (
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Apply for {job.title}</h1>
                <p className="text-gray-500">{job.company} • {job.location}</p>
              </div>
              
              {isSubmitting ? (
                <Card>
                  <CardContent className="pt-10 pb-8 px-8 text-center">
                    <div className="flex flex-col items-center mb-6">
                      {submitProgress < 100 ? (
                        <div className="w-16 h-16 mb-4 flex items-center justify-center">
                          <Loader2Icon className="h-10 w-10 text-primary animate-spin" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                          <CheckIcon className="h-8 w-8 text-green-500" />
                        </div>
                      )}
                      <h2 className="text-xl font-semibold mb-2">
                        {submitProgress < 100 ? "Submitting your application..." : "Application submitted!"}
                      </h2>
                      <p className="text-gray-600 max-w-sm">
                        {submitProgress < 100 
                          ? "Please wait while we process your application." 
                          : "Your application has been successfully submitted."}
                      </p>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mb-6">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300" 
                        style={{ width: `${submitProgress}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Form</CardTitle>
                      <CardDescription>
                        Complete the form below to apply for this position. Fields marked with * are required.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Personal Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <div className="relative">
                              <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input
                                id="fullName"
                                name="fullName"
                                placeholder="Your full name"
                                className="pl-10"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <div className="relative">
                              <MailIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Your email address"
                                className="pl-10"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                              <PhoneIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input
                                id="phone"
                                name="phone"
                                placeholder="Your phone number"
                                className="pl-10"
                                value={formData.phone}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="portfolio">Portfolio/Website</Label>
                            <div className="relative">
                              <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input
                                id="portfolio"
                                name="portfolio"
                                placeholder="https://your-portfolio.com"
                                className="pl-10"
                                value={formData.portfolio}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Application Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Application Details</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="resume">Resume/CV</Label>
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('resume')?.click()}
                              className="flex items-center gap-2"
                            >
                              <FileTextIcon className="h-4 w-4" />
                              {formData.resume ? 'Change File' : 'Upload File'}
                            </Button>
                            <input
                              id="resume"
                              name="resume"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            {formData.resume && (
                              <span className="text-sm text-gray-500">
                                {formData.resume.name}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Accepted formats: PDF, DOC, DOCX. Max size: 5MB
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="coverLetter">Cover Letter *</Label>
                          <Textarea
                            id="coverLetter"
                            name="coverLetter"
                            placeholder="Tell us why you're interested in this position and what makes you a good fit..."
                            rows={6}
                            value={formData.coverLetter}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate(`/jobs/${jobId}`)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        Submit Application
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto text-center py-12">
              <BriefcaseIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Job not found</h2>
              <p className="text-gray-500 mb-6">The job you're trying to apply for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate("/jobs")}>Browse All Jobs</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}