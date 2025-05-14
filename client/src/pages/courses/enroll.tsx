import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  BookOpenIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  CheckIcon,
  ArrowRightIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ArrowLeftIcon
} from "lucide-react";

export default function CourseEnroll() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const courseId = parseInt(params.id);
  const { toast } = useToast();
  const [enrollProgress, setEnrollProgress] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Fetch course details
  const courseQuery = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    staleTime: 60000,
    enabled: !isNaN(courseId)
  });

  const course = courseQuery.data;
  const isLoading = courseQuery.isLoading;

  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: (data: any) => {
      // Simulate enrollment process with delay
      return new Promise<void>((resolve) => {
        setIsEnrolling(true);
        // Progress animation
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setEnrollProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            resolve();
          }
        }, 300);
      }).then(() => {
        // Then make the actual API call
        return apiRequest("POST", "/api/user-courses", data);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-courses/1"] });
      toast({
        title: "Success!",
        description: "You've successfully enrolled in this course",
        variant: "default",
      });
      // Navigate to the learning page
      setTimeout(() => {
        setLocation(`/courses/${courseId}/learn`);
      }, 1000);
    }
  });

  // Handle enrollment
  const handleEnroll = () => {
    if (!courseId) return;
    
    enrollMutation.mutate({
      userId: 1, // Using mock user ID for now
      courseId,
      completedModules: 0
    });
  };

  // Handle back button
  const handleBack = () => {
    setLocation(`/courses/${courseId}`);
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
                  { label: "Enroll", href: `/courses/${courseId}/enroll` },
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
                { label: "Enroll", href: `/courses/${courseId}/enroll` },
              ]}
            />

            <div className="mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="mb-4"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Course
              </Button>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    Enroll in Course
                  </CardTitle>
                  <CardDescription>
                    You're about to enroll in the following course:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img
                        src={course?.thumbnail}
                        alt={course?.title}
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-xl font-semibold mb-2">{course?.title}</h2>
                      <p className="text-muted-foreground mb-4">{course?.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center">
                          <BookOpenIcon className="h-5 w-5 mr-2 text-primary" />
                          <span>{course?.totalModules} Modules</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-5 w-5 mr-2 text-primary" />
                          <span>{course?.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <UsersIcon className="h-5 w-5 mr-2 text-primary" />
                          <span>{course?.enrolledStudents} Students</span>
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="h-5 w-5 mr-2 text-primary" />
                          <span>{course?.rating} Rating</span>
                        </div>
                      </div>

                      <div className="flex items-center mb-4">
                        <Badge variant="outline" className="mr-2">{course?.level}</Badge>
                        <Badge variant="outline" className="mr-2">{course?.category}</Badge>
                      </div>

                      {course?.isPremium ? (
                        <div className="bg-muted p-4 rounded-lg mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">Course Price:</span>
                            <div>
                              <span className="text-lg font-bold">${course?.price}</span>
                              {course?.originalPrice && (
                                <span className="text-muted-foreground line-through ml-2">
                                  ${course?.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          {course?.discount && (
                            <Badge variant="secondary" className="mb-2">
                              {course?.discount}% OFF
                            </Badge>
                          )}
                          <div className="text-sm text-muted-foreground">
                            <ShieldCheckIcon className="h-4 w-4 inline mr-1" />
                            30-day money-back guarantee
                          </div>
                        </div>
                      ) : (
                        <div className="bg-muted p-4 rounded-lg mb-4">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Course Price:</span>
                            <Badge variant="secondary" className="text-lg">
                              Free
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  {isEnrolling ? (
                    <div className="w-full">
                      <div className="flex justify-between mb-2">
                        <span>Enrolling...</span>
                        <span>{enrollProgress}%</span>
                      </div>
                      <Progress value={enrollProgress} className="w-full" />
                    </div>
                  ) : (
                    <div className="flex flex-col w-full space-y-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        By enrolling, you agree to our Terms of Service and Privacy Policy.
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          onClick={handleBack}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleEnroll}
                          className="flex-1"
                        >
                          {course?.isPremium ? (
                            <>
                              <CreditCardIcon className="mr-2 h-4 w-4" />
                              Proceed to Payment
                            </>
                          ) : (
                            <>
                              <CheckIcon className="mr-2 h-4 w-4" />
                              Enroll Now
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}