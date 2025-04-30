import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { CourseCard } from "@/components/dashboard/course-card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpenIcon, SearchIcon, FilterIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Learning() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch user courses data
  const userCoursesQuery = useQuery({
    queryKey: ["/api/user-courses/1"],
    staleTime: 60000
  });

  // Fetch all courses
  const coursesQuery = useQuery({
    queryKey: ["/api/courses"],
    staleTime: 60000
  });

  const isLoading = userCoursesQuery.isLoading || coursesQuery.isLoading;

  // Filter courses based on search and active tab
  const filterCourses = (courses: any[]) => {
    if (!courses) return [];
    
    let filtered = courses;
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        course => course.title.toLowerCase().includes(query) || 
                 course.description.toLowerCase().includes(query) ||
                 course.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(course => course.category.toLowerCase() === activeTab);
    }
    
    return filtered;
  };

  // Get all available categories from courses
  const getCategories = () => {
    if (!coursesQuery.data) return [];
    const categories = new Set(coursesQuery.data.map((course: any) => course.category.toLowerCase()));
    return Array.from(categories);
  };
  
  const enrolledCourses = userCoursesQuery.data || [];
  const allCourses = coursesQuery.data || [];
  const filteredCourses = filterCourses(allCourses);
  const categories = getCategories();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <BookOpenIcon className="mr-2 h-6 w-6 text-primary" />
              Learning Center
            </h1>
            <p className="text-gray-500">Explore courses and continue your learning journey</p>
          </div>
          
          {/* Search and filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-1">
                <FilterIcon className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
          </div>
          
          {/* Course tabs */}
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger value="all" className="px-4">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="px-4 capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {/* My Courses Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">My Courses</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-4" />
                      <Skeleton className="h-2 w-full mb-2" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-1/4" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrolledCourses.map((userCourse: any) => (
                  <CourseCard
                    key={userCourse.id}
                    id={userCourse.courseId}
                    title={userCourse.course.title}
                    description={userCourse.course.description}
                    category={userCourse.course.category}
                    thumbnail={userCourse.course.thumbnail}
                    totalModules={userCourse.course.totalModules}
                    completedModules={userCourse.completedModules}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <BookOpenIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No enrolled courses yet</h3>
                <p className="text-gray-500 mb-4">Explore our catalog and start learning new skills today</p>
                <Button>Browse Courses</Button>
              </div>
            )}
          </div>
          
          {/* All/Filtered Courses Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              {activeTab === 'all' ? 'All Courses' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Courses`}
              {searchQuery && ` - Search results for "${searchQuery}"`}
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course: any) => {
                  // Find if user is enrolled in this course
                  const userCourse = enrolledCourses.find((uc: any) => uc.courseId === course.id);
                  
                  return (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      category={course.category}
                      thumbnail={course.thumbnail}
                      totalModules={course.totalModules}
                      completedModules={userCourse ? userCourse.completedModules : 0}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4">Try changing your search criteria or browse all courses</p>
                <Button onClick={() => { setSearchQuery(""); setActiveTab("all"); }}>Clear filters</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
