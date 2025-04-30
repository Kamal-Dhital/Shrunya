import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { StatCard } from "@/components/dashboard/stat-card";
import { CourseCard } from "@/components/dashboard/course-card";
import { ChallengeCard } from "@/components/dashboard/challenge-card";
import { DiscussionCard } from "@/components/dashboard/discussion-card";
import { JobCard } from "@/components/dashboard/job-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpenIcon,
  CodeIcon,
  MessageSquareIcon,
  CalendarCheckIcon,
  ArrowUpIcon,
  BadgeCheckIcon,
  ClockIcon
} from "lucide-react";

export default function Dashboard() {
  // Fetch user courses data
  const userCoursesQuery = useQuery({
    queryKey: ["/api/user-courses/1"],
    staleTime: 60000
  });

  // Fetch challenges data
  const challengesQuery = useQuery({
    queryKey: ["/api/challenges"],
    staleTime: 60000
  });

  // Fetch discussions data
  const discussionsQuery = useQuery({
    queryKey: ["/api/discussions"],
    staleTime: 60000
  });

  // Fetch jobs data
  const jobsQuery = useQuery({
    queryKey: ["/api/jobs"],
    staleTime: 60000
  });

  const isLoading = userCoursesQuery.isLoading || challengesQuery.isLoading || 
                    discussionsQuery.isLoading || jobsQuery.isLoading;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Welcome back, Sarah!</h1>
            <p className="text-gray-500">Continue your learning journey</p>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Courses completed"
              value="7"
              icon={<BookOpenIcon className="text-primary h-5 w-5" />}
              iconBgColor="bg-blue-100"
              changeText="12% from last month"
              changeIcon={<ArrowUpIcon className="h-3 w-3 mr-1" />}
              changeColor="text-green-600"
            />
            
            <StatCard
              title="Projects built"
              value="4"
              icon={<CodeIcon className="text-accent h-5 w-5" />}
              iconBgColor="bg-green-100"
              changeText="2 new this month"
              changeIcon={<ArrowUpIcon className="h-3 w-3 mr-1" />}
              changeColor="text-green-600"
            />
            
            <StatCard
              title="Forum contributions"
              value="23"
              icon={<MessageSquareIcon className="text-purple-600 h-5 w-5" />}
              iconBgColor="bg-purple-100"
              changeText='Earned "Helper" badge'
              changeIcon={<BadgeCheckIcon className="h-3 w-3 mr-1" />}
              changeColor="text-purple-600"
            />
            
            <StatCard
              title="Current streak"
              value="16 days"
              icon={<CalendarCheckIcon className="text-orange-500 h-5 w-5" />}
              iconBgColor="bg-orange-100"
              changeText="Keep it going!"
              changeIcon={<ClockIcon className="h-3 w-3 mr-1" />}
              changeColor="text-orange-600"
            />
          </div>
          
          {/* Continue learning section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Continue Learning</h2>
              <a href="/learning" className="text-primary text-sm font-medium">View all courses</a>
            </div>
            
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userCoursesQuery.data?.slice(0, 3).map((userCourse: any) => (
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
            )}
          </div>
          
          {/* Weekly challenges section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Weekly Challenges</h2>
              <a href="/challenges" className="text-primary text-sm font-medium">View all challenges</a>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between mb-3">
                      <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-6 w-60" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challengesQuery.data?.slice(0, 2).map((challenge: any) => (
                  <ChallengeCard
                    key={challenge.id}
                    title={challenge.title}
                    description={challenge.description}
                    category={challenge.category}
                    difficulty={challenge.difficulty}
                    participants={challenge.participants}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Discussion and Jobs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hot discussions */}
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Hot Discussions</h2>
                <a href="/community" className="text-primary text-sm font-medium">View all</a>
              </div>
              
              {isLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm mb-4 p-4">
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <Skeleton className="h-6 w-6 mb-1" />
                          <Skeleton className="h-4 w-4 mb-1" />
                          <Skeleton className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Skeleton className="h-6 w-6 rounded-full mr-2" />
                            <Skeleton className="h-4 w-28" />
                          </div>
                          <Skeleton className="h-6 w-full mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-5/6 mb-3" />
                          <div className="flex flex-wrap gap-2 mb-3">
                            {[1, 2, 3, 4].map((j) => (
                              <Skeleton key={j} className="h-6 w-16" />
                            ))}
                          </div>
                          <div className="flex">
                            <Skeleton className="h-4 w-24 mr-4" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {discussionsQuery.data?.slice(0, 3).map((discussion: any) => (
                    <DiscussionCard
                      key={discussion.id}
                      title={discussion.title}
                      content={discussion.content}
                      author={discussion.user}
                      createdAt={new Date(discussion.createdAt)}
                      upvotes={discussion.upvotes}
                      comments={discussion.comments}
                      views={discussion.views}
                      tags={discussion.tags}
                    />
                  ))}
                </>
              )}
            </div>
            
            {/* Job opportunities */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Job Opportunities</h2>
                <a href="/jobs" className="text-primary text-sm font-medium">View all</a>
              </div>
              
              {isLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm mb-4 p-4">
                      <div className="flex items-start mb-3">
                        <Skeleton className="w-12 h-12 rounded-lg mr-3" />
                        <div>
                          <Skeleton className="h-5 w-40 mb-1" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-3" />
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[1, 2, 3, 4].map((j) => (
                          <Skeleton key={j} className="h-6 w-16" />
                        ))}
                      </div>
                      <div className="flex justify-between mb-3">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {jobsQuery.data?.slice(0, 3).map((job: any) => (
                    <JobCard
                      key={job.id}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      description={job.description}
                      salary={job.salary}
                      logoUrl={job.logoUrl}
                      postedAt={new Date(job.postedAt)}
                      tags={job.tags}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
