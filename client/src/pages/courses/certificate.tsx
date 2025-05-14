import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AwardIcon,
  DownloadIcon,
  ShareIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  PrinterIcon
} from "lucide-react";

export default function CourseCertificate() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const courseId = parseInt(params.id);
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [completionDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

  // Fetch course details
  const courseQuery = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    staleTime: 60000,
    enabled: !isNaN(courseId)
  });

  // Fetch user details
  const userQuery = useQuery({
    queryKey: ["/api/user/1"],
    staleTime: 60000
  });

  const course = courseQuery.data;
  const user = userQuery.data;
  const isLoading = courseQuery.isLoading || userQuery.isLoading;

  // Handle download certificate
  const handleDownload = () => {
    // In a real app, this would generate a PDF
    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been downloaded successfully.",
      variant: "default",
    });
  };

  // Handle share certificate
  const handleShare = () => {
    // In a real app, this would open a share dialog
    toast({
      title: "Certificate Shared",
      description: "Your certificate has been shared successfully.",
      variant: "default",
    });
  };

  // Handle print certificate
  const handlePrint = () => {
    window.print();
  };

  // Handle back to course
  const handleBackToCourse = () => {
    setLocation(`/courses/${courseId}/learn`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto py-6">
            <div className="container px-6 md:px-8">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Learning", href: "/learning" },
                  { label: "Course", href: `/courses/${courseId}` },
                  { label: "Certificate", href: `/courses/${courseId}/certificate` },
                ]}
              />
              <div className="mt-6 space-y-8">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto py-6">
          <div className="container px-6 md:px-8">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Learning", href: "/learning" },
                { label: "Course", href: `/courses/${courseId}` },
                { label: "Certificate", href: `/courses/${courseId}/certificate` },
              ]}
            />

            <div className="mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToCourse}
                className="mb-4"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Course
              </Button>

              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        Course Completion Certificate
                      </CardTitle>
                      <CardDescription>
                        Congratulations on completing the course!
                      </CardDescription>
                    </div>
                    <CheckCircleIcon className="h-10 w-10 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <div 
                      ref={certificateRef}
                      className="border-8 border-double border-primary/20 p-8 w-full max-w-3xl bg-white print:w-full"
                    >
                      <div className="text-center">
                        <div className="mb-6">
                          <AwardIcon className="h-16 w-16 mx-auto text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-primary mb-2">Certificate of Completion</h1>
                        <p className="text-lg mb-8">This certifies that</p>
                        <p className="text-2xl font-bold mb-8">{user?.fullName}</p>
                        <p className="text-lg mb-8">has successfully completed the course</p>
                        <p className="text-2xl font-bold mb-8">{course?.title}</p>
                        <p className="text-lg mb-2">Completed on</p>
                        <p className="text-xl mb-8">{completionDate}</p>
                        <div className="flex justify-center items-center mt-12">
                          <div className="border-t-2 border-gray-300 w-48 text-center pt-2">
                            <p>Course Instructor</p>
                            <p className="font-semibold">{course?.instructor}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button onClick={handleDownload} variant="outline">
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button onClick={handlePrint} variant="outline">
                    <PrinterIcon className="mr-2 h-4 w-4" />
                    Print Certificate
                  </Button>
                  <Button onClick={handleShare} variant="outline">
                    <ShareIcon className="mr-2 h-4 w-4" />
                    Share Certificate
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    What's Next?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Continue Learning</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Explore more courses to enhance your skills further.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLocation('/learning')}
                      >
                        Browse Courses
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Apply Your Skills</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Put your knowledge to practice with real-world projects.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLocation('/projects')}
                      >
                        Find Projects
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Share Your Achievement</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add this certificate to your LinkedIn profile or resume.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleShare}
                      >
                        Share Certificate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificateRef, #certificateRef * {
            visibility: visible;
          }
          #certificateRef {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}