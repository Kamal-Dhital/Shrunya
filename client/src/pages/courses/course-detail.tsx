import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpenIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  LockIcon,
  PlayIcon,
  CheckIcon,
  ShieldIcon,
  ArrowRightIcon,
} from "lucide-react";

export default function CourseDetail() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const courseId = parseInt(params.id);
  const { toast } = useToast();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollProgress, setEnrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch course details
  const courseQuery = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    staleTime: 60000,
    enabled: !isNaN(courseId)
  });

  // Fetch user's enrolled courses to check if already enrolled
  const userCoursesQuery = useQuery({
    queryKey: ["/api/user-courses/1"],
    staleTime: 60000
  });

  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: (data: any) => {
      // Simulate enrollment process with delay
      return new Promise<void>((resolve) => {
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
      setIsEnrolled(true);
    }
  });

  // Check if the user is already enrolled
  useEffect(() => {
    if (userCoursesQuery.data && courseId) {
      const userCourse = userCoursesQuery.data.find(
        (uc: any) => uc.courseId === courseId
      );
      setIsEnrolled(!!userCourse);
    }
  }, [userCoursesQuery.data, courseId]);

  // Handle enrollment
  const handleEnroll = () => {
    if (!courseId) return;
    
    if (courseQuery.data?.isPremium) {
      // Navigate to payment page for premium courses
      setLocation(`/courses/${courseId}/checkout`);
    } else {
      // Directly enroll for free courses
      enrollMutation.mutate({
        userId: 1, // Using mock user ID for now
        courseId: courseId,
        completedModules: 0
      });
    }
  };

  // Handle continue learning 
  const handleContinueLearning = () => {
    if (!courseId) return;
    setLocation(`/courses/${courseId}/learn`);
  };

  const course = courseQuery.data;
  const isLoading = courseQuery.isLoading;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          {isLoading ? (
            <div>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-6" />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Skeleton className="h-64 w-full rounded-lg mb-6" />
                  <Skeleton className="h-8 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                </div>
                <div>
                  <Skeleton className="h-80 w-full rounded-lg" />
                </div>
              </div>
            </div>
          ) : course ? (
            <>
              {/* Course header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-100 text-primary">
                    {course.category}
                  </Badge>
                  {course.isPremium && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                      Premium
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-gray-500">{course.description}</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Course image */}
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={`${course.title} course thumbnail`} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  
                  {/* Course tabs */}
                  <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
                    <TabsList className="bg-gray-100 p-1">
                      <TabsTrigger value="overview" className="px-4">Overview</TabsTrigger>
                      <TabsTrigger value="curriculum" className="px-4">Curriculum</TabsTrigger>
                      <TabsTrigger value="reviews" className="px-4">Reviews</TabsTrigger>
                      <TabsTrigger value="instructor" className="px-4">Instructor</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="py-4">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">About This Course</h2>
                        <p>
                          {course.longDescription || 
                            "This comprehensive course will take you through all aspects of modern web development using JavaScript and related technologies. You'll learn how to build robust, scalable applications from the ground up."}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div className="flex items-center gap-2">
                            <ClockIcon className="h-5 w-5 text-gray-500" />
                            <span>Course length: {course.duration || "10 hours"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UsersIcon className="h-5 w-5 text-gray-500" />
                            <span>{course.students || "2,347"} students enrolled</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarIcon className="h-5 w-5 text-yellow-500" />
                            <span>Rating: {course.rating || "4.8"}/5 ({course.reviews || "342"} reviews)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpenIcon className="h-5 w-5 text-gray-500" />
                            <span>{course.totalModules} modules</span>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold mb-2">What You'll Learn</h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(course.learningPoints || [
                              "Build real-world projects using modern JavaScript",
                              "Understand advanced JavaScript patterns and concepts",
                              "Implement authentication and authorization",
                              "Work with RESTful and GraphQL APIs",
                              "Deploy applications to production environments",
                              "Optimize applications for performance"
                            ]).map((point, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckIcon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                          <ul className="space-y-2">
                            {(course.requirements || [
                              "Basic knowledge of HTML, CSS, and JavaScript",
                              "A modern web browser and code editor",
                              "No prior framework experience is required"
                            ]).map((req, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <ArrowRightIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="curriculum" className="py-4">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Course Curriculum</h2>
                        <p className="text-gray-500 mb-4">
                          {course.totalModules} modules • {course.lessons || "42"} lessons • 
                          Total length: {course.duration || "10 hours"}
                        </p>
                        
                        {(course.modules || [
                          {
                            title: "Introduction to Advanced JavaScript",
                            lessons: [
                              "Setting up your development environment",
                              "JavaScript language fundamentals recap",
                              "Modern JavaScript features (ES6+)"
                            ],
                            duration: "45 min"
                          },
                          {
                            title: "JavaScript Design Patterns",
                            lessons: [
                              "Singleton Pattern",
                              "Factory Pattern",
                              "Observer Pattern",
                              "Module Pattern"
                            ],
                            duration: "1h 20min"
                          },
                          {
                            title: "Asynchronous JavaScript",
                            lessons: [
                              "Callbacks and Callback Hell",
                              "Promises and Promise Chaining",
                              "Async/Await",
                              "Error Handling"
                            ],
                            duration: "1h 45min"
                          },
                          {
                            title: "Building a Project",
                            lessons: [
                              "Project setup and planning",
                              "Implementing core functionality",
                              "Adding advanced features",
                              "Testing and debugging",
                              "Performance optimization"
                            ],
                            duration: "3h 15min",
                            isPremium: true
                          }
                        ]).map((module, index) => (
                          <Card key={index} className="mb-4">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold">Module {index + 1}: {module.title}</h3>
                                <span className="text-sm text-gray-500">{module.duration}</span>
                              </div>
                              
                              <div className="space-y-2 pl-1">
                                {module.lessons.map((lesson, lIndex) => (
                                  <div 
                                    key={lIndex}
                                    className={`flex items-center justify-between p-2 hover:bg-gray-50 rounded-md ${module.isPremium && !isEnrolled ? 'opacity-70' : ''}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {module.isPremium && !isEnrolled ? (
                                        <LockIcon className="h-4 w-4 text-gray-400" />
                                      ) : (
                                        <PlayIcon className="h-4 w-4 text-primary" />
                                      )}
                                      <span className={module.isPremium && !isEnrolled ? 'text-gray-400' : ''}>
                                        {lesson}
                                      </span>
                                    </div>
                                    {module.isPremium && !isEnrolled && (
                                      <Badge variant="outline" className="text-xs">Premium</Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="reviews" className="py-4">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Student Reviews</h2>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon 
                                key={star}
                                className={`h-5 w-5 ${star <= (course.rating || 4.8) 
                                  ? 'text-yellow-500' 
                                  : 'text-gray-300'}`}
                                fill={star <= (course.rating || 4.8) ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{course.rating || "4.8"} out of 5</span>
                          <span className="text-gray-500">({course.reviews || "342"} reviews)</span>
                        </div>
                        
                        {/* Sample reviews */}
                        <div className="space-y-4">
                          {[
                            {
                              name: "Alex Johnson",
                              rating: 5,
                              date: "2 months ago",
                              content: "This course exceeded my expectations. The instructor explains complex concepts in an easy-to-understand way. I've already started applying what I've learned to my projects."
                            },
                            {
                              name: "Sarah Miller",
                              rating: 4,
                              date: "3 weeks ago",
                              content: "Great course with practical examples. The project section was particularly helpful. Would recommend to anyone wanting to improve their JavaScript skills."
                            },
                            {
                              name: "David Chen",
                              rating: 5,
                              date: "1 month ago",
                              content: "Comprehensive and well-structured. I appreciate how the instructor breaks down difficult topics into manageable chunks. The course project really helped solidify my understanding."
                            }
                          ].map((review, index) => (
                            <Card key={index} className="p-4">
                              <div className="flex justify-between mb-2">
                                <h4 className="font-medium">{review.name}</h4>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <div className="flex mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon 
                                    key={star}
                                    className={`h-4 w-4 ${star <= review.rating 
                                      ? 'text-yellow-500' 
                                      : 'text-gray-300'}`}
                                    fill={star <= review.rating ? 'currentColor' : 'none'}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-600">{review.content}</p>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="instructor" className="py-4">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Your Instructor</h2>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                          <img 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                            alt="Instructor profile"
                            className="rounded-full w-24 h-24 object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-medium">Daniel Rogers</h3>
                            <p className="text-gray-500 mb-2">Senior Software Engineer & Educator</p>
                            <p className="text-gray-600 mb-3">
                              Daniel has been teaching programming for over 8 years and has worked as a 
                              senior developer at several tech companies. He specializes in JavaScript 
                              and modern web development, with a passion for creating educational content 
                              that is both practical and engaging.
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <StarIcon className="h-4 w-4" />
                                <span>4.9 Instructor Rating</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <UsersIcon className="h-4 w-4" />
                                <span>15,000+ Students</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpenIcon className="h-4 w-4" />
                                <span>12 Courses</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Enrollment card */}
                <div>
                  <Card className="sticky top-6">
                    <CardContent className="p-6">
                      {course.isPremium ? (
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-primary mb-1">${course.price || "49.99"}</div>
                          {course.originalPrice && (
                            <div className="text-gray-500 line-through mb-1">${course.originalPrice}</div>
                          )}
                          {course.discount && (
                            <Badge className="bg-accent text-white">{course.discount}% off</Badge>
                          )}
                        </div>
                      ) : (
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-accent mb-1">Free</div>
                          <div className="text-gray-500">Start learning today</div>
                        </div>
                      )}
                      
                      <div className="space-y-4 mb-6">
                        {isEnrolled ? (
                          <Button 
                            onClick={handleContinueLearning}
                            className="w-full"
                          >
                            Continue Learning
                          </Button>
                        ) : (
                          <>
                            {enrollMutation.isPending ? (
                              <div className="space-y-2">
                                <Progress value={enrollProgress} className="h-2" />
                                <div className="text-center text-sm text-gray-500">Processing enrollment...</div>
                              </div>
                            ) : (
                              <Button 
                                onClick={handleEnroll}
                                className="w-full"
                              >
                                {course.isPremium ? "Enroll Now" : "Enroll For Free"}
                              </Button>
                            )}
                          </>
                        )}
                        
                        {!isEnrolled && course.isPremium && (
                          <div className="text-center text-sm text-gray-500">
                            30-Day Money-Back Guarantee
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">This course includes:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm">
                            <BookOpenIcon className="h-4 w-4 text-gray-500" />
                            <span>{course.duration || "10 hours"} of on-demand video</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <PlayIcon className="h-4 w-4 text-gray-500" />
                            <span>{course.lessons || "42"} lessons</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <CheckIcon className="h-4 w-4 text-gray-500" />
                            <span>{course.exercises || "15"} practical exercises</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <ShieldIcon className="h-4 w-4 text-gray-500" />
                            <span>Lifetime access</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <UsersIcon className="h-4 w-4 text-gray-500" />
                            <span>Community support</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4 border-t">
                      {!isEnrolled && (
                        <div className="w-full text-center text-sm">
                          <span className="text-gray-500">Share this course: </span>
                          <button className="text-primary hover:underline ml-1">
                            Copy Link
                          </button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-2">Course not found</h2>
              <p className="text-gray-500 mb-4">The course you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => setLocation("/learning")}>
                Back to Courses
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}