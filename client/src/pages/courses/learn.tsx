import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  BookOpenIcon,
  PlayIcon,
  CheckIcon,
  LockIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
  MessageSquareIcon,
  UsersIcon,
} from "lucide-react";

export default function CourseLearn() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const courseId = parseInt(params.id);
  const { toast } = useToast();
  
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [activeTab, setActiveTab] = useState("video");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  // Fetch course details
  const courseQuery = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    staleTime: 60000,
    enabled: !isNaN(courseId)
  });

  // Fetch user course progress
  const userCoursesQuery = useQuery({
    queryKey: ["/api/user-courses/1"],
    staleTime: 60000
  });

  // Update course progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: (data: any) => apiRequest(
      "PATCH", 
      `/api/user-courses/${data.userCourseId}`, 
      { completedModules: data.completedModules }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-courses/1"] });
    }
  });

  const course = courseQuery.data;
  const isLoading = courseQuery.isLoading || userCoursesQuery.isLoading;

  // Setup course modules and lessons
  const modules = course?.modules || [
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
      duration: "3h 15min"
    }
  ];

  // Calculate current user course progress
  useEffect(() => {
    if (userCoursesQuery.data && courseId) {
      const userCourse = userCoursesQuery.data.find(
        (uc: any) => uc.courseId === courseId
      );
      
      if (userCourse) {
        // Set initial completed lessons based on user progress
        const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
        const completedPercentage = userCourse.completedModules / (course?.totalModules || totalLessons);
        
        // Approximate which lessons are completed based on percentage
        const lessonsCompleted = [];
        let lessonCount = 0;
        
        for (let i = 0; i < modules.length; i++) {
          for (let j = 0; j < modules[i].lessons.length; j++) {
            if (lessonCount / totalLessons <= completedPercentage) {
              lessonsCompleted.push(lessonCount);
            }
            lessonCount++;
          }
        }
        
        setCompletedLessons(lessonsCompleted);
      }
    }
  }, [userCoursesQuery.data, courseId, modules, course?.totalModules]);

  // Mark current lesson as completed
  const markLessonComplete = () => {
    if (!userCoursesQuery.data || !courseId) return;
    
    const userCourse = userCoursesQuery.data.find(
      (uc: any) => uc.courseId === courseId
    );
    
    if (!userCourse) return;
    
    // Calculate current lesson index
    let currentLessonIndex = 0;
    for (let i = 0; i < currentModule; i++) {
      currentLessonIndex += modules[i].lessons.length;
    }
    currentLessonIndex += currentLesson;
    
    // Add to completed lessons if not already completed
    if (!completedLessons.includes(currentLessonIndex)) {
      const newCompletedLessons = [...completedLessons, currentLessonIndex];
      setCompletedLessons(newCompletedLessons);
      
      // Calculate completed percentage for the course
      const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
      const completedModules = Math.round((newCompletedLessons.length / totalLessons) * (course?.totalModules || totalLessons));
      
      // Update progress in the database
      updateProgressMutation.mutate({
        userCourseId: userCourse.id,
        completedModules: completedModules
      });
      
      toast({
        title: "Progress Saved",
        description: "This lesson has been marked as completed",
        variant: "default",
      });
    }
  };

  // Navigate to next lesson
  const goToNextLesson = () => {
    markLessonComplete();
    
    if (currentLesson < modules[currentModule].lessons.length - 1) {
      // Go to next lesson in current module
      setCurrentLesson(currentLesson + 1);
    } else if (currentModule < modules.length - 1) {
      // Go to first lesson in next module
      setCurrentModule(currentModule + 1);
      setCurrentLesson(0);
    } else {
      // Course completed
      toast({
        title: "Congratulations!",
        description: "You've completed this course",
        variant: "default",
      });
    }
  };

  // Navigate to previous lesson
  const goToPrevLesson = () => {
    if (currentLesson > 0) {
      // Go to previous lesson in current module
      setCurrentLesson(currentLesson - 1);
    } else if (currentModule > 0) {
      // Go to last lesson in previous module
      setCurrentModule(currentModule - 1);
      setCurrentLesson(modules[currentModule - 1].lessons.length - 1);
    }
  };

  // Select a specific lesson
  const selectLesson = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
  };

  // Calculate if a specific lesson is completed
  const isLessonCompleted = (moduleIndex: number, lessonIndex: number) => {
    let lessonCount = 0;
    for (let i = 0; i < moduleIndex; i++) {
      lessonCount += modules[i].lessons.length;
    }
    lessonCount += lessonIndex;
    
    return completedLessons.includes(lessonCount);
  };

  // Calculate overall course progress
  const calculateProgress = () => {
    const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
    return Math.round((completedLessons.length / totalLessons) * 100);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden md:ml-64">
        <Header />
        
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
          {/* Course sidebar */}
          <div 
            className={`w-80 border-r bg-white overflow-y-auto transition-all duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } absolute md:relative z-20 h-full`}
          >
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/learning")}
                className="mb-4 w-full"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Courses
              </Button>
              
              {isLoading ? (
                <Skeleton className="h-4 w-full mb-2" />
              ) : (
                <>
                  <h2 className="font-semibold text-sm line-clamp-2 mb-1">{course?.title}</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <Progress value={calculateProgress()} className="h-1.5 mr-2 w-20" />
                    <span>{calculateProgress()}% complete</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-sm mb-2">Course Content</h3>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-6 w-full mb-2" />
                      <div className="space-y-2 pl-4">
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Accordion type="multiple" className="w-full" defaultValue={[String(currentModule)]}>
                  {modules.map((module, moduleIndex) => (
                    <AccordionItem key={moduleIndex} value={String(moduleIndex)}>
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="text-left">
                          <div className="font-medium text-sm">Module {moduleIndex + 1}: {module.title}</div>
                          <div className="text-xs text-gray-500 flex gap-2 mt-1">
                            <span>{module.lessons.length} lessons</span>
                            <span>•</span>
                            <span>{module.duration}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-1 space-y-1">
                          {module.lessons.map((lesson, lessonIndex) => {
                            const isCompleted = isLessonCompleted(moduleIndex, lessonIndex);
                            const isCurrent = moduleIndex === currentModule && lessonIndex === currentLesson;
                            
                            return (
                              <button 
                                key={lessonIndex}
                                onClick={() => selectLesson(moduleIndex, lessonIndex)}
                                className={`flex items-center w-full text-left p-2 rounded-md text-sm ${
                                  isCurrent 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'hover:bg-gray-100'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckIcon className="h-4 w-4 mr-2 text-accent" />
                                ) : (
                                  <PlayIcon className="h-4 w-4 mr-2 text-gray-400" />
                                )}
                                <span className="line-clamp-2">
                                  {lessonIndex + 1}. {lesson}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="md:hidden sticky top-0 z-10 bg-white border-b p-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <ArrowLeftIcon className="h-4 w-4" /> : <BookOpenIcon className="h-4 w-4" />}
                <span className="ml-2">{sidebarOpen ? 'Hide' : 'Show'} Content</span>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="p-4 md:p-6">
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-6" />
                <Skeleton className="h-96 w-full rounded-lg mb-6" />
              </div>
            ) : (
              <div className="p-4 md:p-6">
                <div className="mb-4">
                  <Badge className="mb-2">{`Module ${currentModule + 1}: ${modules[currentModule].title}`}</Badge>
                  <h1 className="text-2xl font-bold mb-1">
                    {currentLesson + 1}. {modules[currentModule].lessons[currentLesson]}
                  </h1>
                </div>
                
                <Tabs defaultValue="video" className="mb-6" onValueChange={setActiveTab}>
                  <TabsList className="bg-gray-100 p-1">
                    <TabsTrigger value="video" className="px-4">Video</TabsTrigger>
                    <TabsTrigger value="transcript" className="px-4">Transcript</TabsTrigger>
                    <TabsTrigger value="resources" className="px-4">Resources</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="video" className="pt-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                      <div className="text-center text-white p-4">
                        <div className="mb-4">
                          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                            <PlayIcon className="h-10 w-10" />
                          </div>
                        </div>
                        <p className="text-lg font-medium mb-2">Video Placeholder</p>
                        <p className="text-sm text-gray-400 max-w-md mx-auto">
                          This is a placeholder for the video content. In a real application, this would be an embedded video player.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                      <Button 
                        variant="outline" 
                        onClick={goToPrevLesson}
                        disabled={currentModule === 0 && currentLesson === 0}
                      >
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Previous Lesson
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={markLessonComplete}
                        >
                          <CheckIcon className="mr-2 h-4 w-4" />
                          Mark as Complete
                        </Button>
                        
                        <Button onClick={goToNextLesson}>
                          Next Lesson
                          <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="transcript" className="pt-4">
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Transcript</h3>
                      <p className="text-gray-600 mb-4">
                        Hello everyone and welcome to this lesson on {modules[currentModule].lessons[currentLesson]}. 
                        Today we'll be covering the key concepts and practical implementation details that you need to know.
                      </p>
                      
                      <p className="text-gray-600 mb-4">
                        Let's start by understanding the core principles. When working with {modules[currentModule].title}, 
                        it's important to consider the best practices and common patterns that have emerged in the industry. 
                        This ensures our code is both maintainable and efficient.
                      </p>
                      
                      <p className="text-gray-600 mb-4">
                        One of the key benefits of this approach is that it allows for greater flexibility and code reuse. 
                        By structuring our applications this way, we can more easily adapt to changing requirements and scale 
                        our codebase as needed.
                      </p>
                      
                      <p className="text-gray-600">
                        In the next lesson, we'll build on these concepts and explore more advanced techniques. But for now, 
                        let's focus on understanding these fundamentals as they form the foundation of everything else we'll cover.
                      </p>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="resources" className="pt-4">
                    <Card className="p-4">
                      <h3 className="font-medium mb-4">Lesson Resources</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                          <div className="flex items-center">
                            <DownloadIcon className="h-4 w-4 mr-2 text-primary" />
                            <span>Lesson_Slides.pdf</span>
                          </div>
                          <Badge>2.3 MB</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                          <div className="flex items-center">
                            <DownloadIcon className="h-4 w-4 mr-2 text-primary" />
                            <span>Code_Examples.zip</span>
                          </div>
                          <Badge>1.5 MB</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                          <div className="flex items-center">
                            <DownloadIcon className="h-4 w-4 mr-2 text-primary" />
                            <span>Exercise_Worksheet.pdf</span>
                          </div>
                          <Badge>1.1 MB</Badge>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="font-medium mb-4">Additional Reading</h3>
                      
                      <div className="space-y-3">
                        <a href="#" className="block p-2 hover:bg-gray-100 rounded-md text-primary hover:underline">
                          → Understanding JavaScript Design Patterns in Depth
                        </a>
                        <a href="#" className="block p-2 hover:bg-gray-100 rounded-md text-primary hover:underline">
                          → MDN Documentation: Advanced JavaScript Concepts
                        </a>
                        <a href="#" className="block p-2 hover:bg-gray-100 rounded-md text-primary hover:underline">
                          → Best Practices for Modern Web Development
                        </a>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                {/* Discussions */}
                <div className="mt-8 mb-12">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <MessageSquareIcon className="mr-2 h-5 w-5" />
                    Lesson Discussion
                  </h2>
                  
                  <Card className="mb-4 p-4">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <img 
                            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop"
                            alt="User avatar"
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <div className="font-medium">Alex Johnson</div>
                            <div className="text-xs text-gray-500">Posted 2 days ago</div>
                          </div>
                        </div>
                        <Badge variant="outline">Question</Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        Great lesson! I'm curious about the practical applications of the Observer pattern 
                        compared to using Redux for state management. Could someone explain the trade-offs?
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <button className="flex items-center mr-4 hover:text-primary">
                          <ArrowUpIcon className="h-4 w-4 mr-1" />
                          <span>12</span>
                        </button>
                        <span className="mr-4">•</span>
                        <div className="flex items-center">
                          <MessageSquareIcon className="h-4 w-4 mr-1" />
                          <span>3 replies</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pl-8 mt-4 pt-4 border-t">
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <img 
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop"
                            alt="User avatar"
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <div>
                            <span className="font-medium text-sm">Sarah Miller</span>
                            <span className="text-xs text-gray-500 ml-2">1 day ago</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          Great question! The Observer pattern is more of a fundamental concept while Redux is a specific implementation 
                          that uses similar principles. The main trade-off is simplicity vs. structure. Observer is simpler for small apps 
                          but Redux offers more organization for complex state management.
                        </p>
                      </div>
                    </div>
                    
                    <div className="pl-8 pt-3 border-t">
                      <Button variant="ghost" size="sm" className="text-primary">
                        <MessageSquareIcon className="h-4 w-4 mr-1" />
                        Reply to discussion
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="mb-4 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <UsersIcon className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">Join the discussion</span>
                      </div>
                      <span className="text-sm text-gray-500">42 students participating</span>
                    </div>
                    
                    <textarea 
                      className="w-full p-3 border rounded-md mb-3 bg-white" 
                      rows={3}
                      placeholder="Share your thoughts or ask a question about this lesson..."
                    ></textarea>
                    
                    <div className="flex justify-end">
                      <Button>Post Comment</Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}