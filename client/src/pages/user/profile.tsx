import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  UserIcon,
  BookOpenIcon,
  TrophyIcon,
  MessageSquareIcon,
  BriefcaseIcon,
  CreditCardIcon,
  BellIcon,
  ShieldIcon,
  CheckIcon,
  ClockIcon,
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  GlobeIcon,
  CalendarIcon
} from "lucide-react";

export default function UserProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    twitter: "",
    linkedin: ""
  });
  
  // Fetch user data
  const userQuery = useQuery({
    queryKey: ["/api/user/1"],
    staleTime: 60000
  });
  
  // Fetch user courses
  const userCoursesQuery = useQuery({
    queryKey: ["/api/user-courses/1"],
    staleTime: 60000
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", "/api/user/1", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/1"] });
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved",
        variant: "default",
      });
      setIsEditMode(false);
    }
  });
  
  const isLoading = userQuery.isLoading || userCoursesQuery.isLoading;
  const user = userQuery.data || {
    id: 1,
    username: "sarah_dev",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    bio: "Full-stack developer passionate about JavaScript and modern web technologies. Always learning something new.",
    location: "San Francisco, CA",
    website: "https://sarahjohnson.dev",
    github: "sarah_dev",
    twitter: "sarah_codes",
    linkedin: "sarahjohnson",
    joinedDate: "2022-04-15T00:00:00.000Z"
  };
  
  // Courses the user is enrolled in
  const userCourses = userCoursesQuery.data || [];
  
  // Stats
  const stats = {
    coursesCompleted: 7,
    certificatesEarned: 5,
    challengesCompleted: 12,
    forumPosts: 23
  };
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle input change in edit mode
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        github: user.github || "",
        twitter: user.twitter || "",
        linkedin: user.linkedin || ""
      });
      setIsEditMode(true);
    }
  };
  
  // Save profile changes
  const saveProfile = () => {
    updateUserMutation.mutate(formData);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          {/* Profile header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <UserIcon className="mr-2 h-6 w-6 text-primary" />
              My Profile
            </h1>
            <p className="text-gray-500">Manage your account and settings</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="pt-6">
                    <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto mb-4" />
                    <Skeleton className="h-10 w-full mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Profile sidebar */}
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <h2 className="font-semibold text-xl mb-1">{user.name}</h2>
                      <div className="text-gray-500">@{user.username}</div>
                      
                      <div className="mt-4">
                        <Button
                          variant={isEditMode ? "outline" : "default"}
                          onClick={toggleEditMode}
                          className="w-full"
                        >
                          {isEditMode ? "Cancel Editing" : "Edit Profile"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      {user.location && (
                        <div className="flex items-start">
                          <UserIcon className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                          <span>{user.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-start">
                        <CalendarIcon className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                        <span>Joined {formatDate(user.joinedDate)}</span>
                      </div>
                      
                      {user.website && (
                        <div className="flex items-start">
                          <GlobeIcon className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                          <a 
                            href={user.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            {user.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-center space-x-3 mt-6">
                      {user.github && (
                        <a 
                          href={`https://github.com/${user.github}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <GithubIcon className="h-5 w-5" />
                        </a>
                      )}
                      
                      {user.twitter && (
                        <a 
                          href={`https://twitter.com/${user.twitter}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-500"
                        >
                          <TwitterIcon className="h-5 w-5" />
                        </a>
                      )}
                      
                      {user.linkedin && (
                        <a 
                          href={`https://linkedin.com/in/${user.linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-700"
                        >
                          <LinkedinIcon className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm">Your Stats</h3>
                      
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-primary text-xl font-bold">{stats.coursesCompleted}</div>
                          <div className="text-xs text-gray-500">Courses</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-accent text-xl font-bold">{stats.certificatesEarned}</div>
                          <div className="text-xs text-gray-500">Certificates</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-orange-500 text-xl font-bold">{stats.challengesCompleted}</div>
                          <div className="text-xs text-gray-500">Challenges</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-purple-500 text-xl font-bold">{stats.forumPosts}</div>
                          <div className="text-xs text-gray-500">Posts</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main content */}
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your profile information and preferences
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="personal" onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-5 mb-6">
                        <TabsTrigger value="personal">Personal</TabsTrigger>
                        <TabsTrigger value="learning">Learning</TabsTrigger>
                        <TabsTrigger value="billing">Billing</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="personal">
                        {isEditMode ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input 
                                  id="name" 
                                  name="name" 
                                  value={formData.name} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input 
                                  id="username" 
                                  name="username" 
                                  value={formData.username} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input 
                                id="email" 
                                name="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={handleInputChange} 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea 
                                id="bio" 
                                name="bio" 
                                value={formData.bio} 
                                onChange={handleInputChange}
                                rows={4}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input 
                                id="location" 
                                name="location" 
                                value={formData.location} 
                                onChange={handleInputChange} 
                              />
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <h3 className="font-medium mb-3">Social Profiles</h3>
                            
                            <div className="space-y-4">
                              <div className="flex items-center space-x-3">
                                <GlobeIcon className="h-5 w-5 text-gray-500" />
                                <Input 
                                  id="website" 
                                  name="website" 
                                  placeholder="Website URL" 
                                  value={formData.website} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <GithubIcon className="h-5 w-5 text-gray-500" />
                                <Input 
                                  id="github" 
                                  name="github" 
                                  placeholder="GitHub username" 
                                  value={formData.github} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <TwitterIcon className="h-5 w-5 text-gray-500" />
                                <Input 
                                  id="twitter" 
                                  name="twitter" 
                                  placeholder="Twitter username" 
                                  value={formData.twitter} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <LinkedinIcon className="h-5 w-5 text-gray-500" />
                                <Input 
                                  id="linkedin" 
                                  name="linkedin" 
                                  placeholder="LinkedIn username" 
                                  value={formData.linkedin} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                              <Button 
                                variant="outline" 
                                onClick={() => setIsEditMode(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={saveProfile}
                                disabled={updateUserMutation.isPending}
                              >
                                {updateUserMutation.isPending ? (
                                  <span className="flex items-center">
                                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                                    Saving...
                                  </span>
                                ) : "Save Changes"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium mb-2">About</h3>
                              <p className="text-gray-600">{user.bio || "No bio provided yet."}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                                <p>{user.name}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Username</h4>
                                <p>@{user.username}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                                <p>{user.email}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                                <p>{user.location || "Not specified"}</p>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h3 className="text-lg font-medium mb-3">Social Profiles</h3>
                              <div className="grid grid-cols-2 gap-y-3">
                                {user.website && (
                                  <div className="flex items-center">
                                    <GlobeIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    <a 
                                      href={user.website} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline truncate"
                                    >
                                      {user.website.replace(/^https?:\/\//, '')}
                                    </a>
                                  </div>
                                )}
                                
                                {user.github && (
                                  <div className="flex items-center">
                                    <GithubIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    <a 
                                      href={`https://github.com/${user.github}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="hover:underline"
                                    >
                                      {user.github}
                                    </a>
                                  </div>
                                )}
                                
                                {user.twitter && (
                                  <div className="flex items-center">
                                    <TwitterIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    <a 
                                      href={`https://twitter.com/${user.twitter}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="hover:underline"
                                    >
                                      @{user.twitter}
                                    </a>
                                  </div>
                                )}
                                
                                {user.linkedin && (
                                  <div className="flex items-center">
                                    <LinkedinIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    <a 
                                      href={`https://linkedin.com/in/${user.linkedin}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="hover:underline"
                                    >
                                      {user.linkedin}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="learning">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-3">Learning Progress</h3>
                            
                            <div className="grid grid-cols-4 gap-4 mb-6">
                              <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="p-4 text-center">
                                  <BookOpenIcon className="h-6 w-6 mx-auto mb-2 text-primary" />
                                  <div className="text-2xl font-bold text-primary">{userCourses.length}</div>
                                  <div className="text-sm text-gray-500">Enrolled Courses</div>
                                </CardContent>
                              </Card>
                              
                              <Card className="bg-green-50 border-green-200">
                                <CardContent className="p-4 text-center">
                                  <CheckIcon className="h-6 w-6 mx-auto mb-2 text-green-600" />
                                  <div className="text-2xl font-bold text-green-600">{stats.coursesCompleted}</div>
                                  <div className="text-sm text-gray-500">Completed</div>
                                </CardContent>
                              </Card>
                              
                              <Card className="bg-yellow-50 border-yellow-200">
                                <CardContent className="p-4 text-center">
                                  <ClockIcon className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                                  <div className="text-2xl font-bold text-yellow-600">{userCourses.length - stats.coursesCompleted}</div>
                                  <div className="text-sm text-gray-500">In Progress</div>
                                </CardContent>
                              </Card>
                              
                              <Card className="bg-purple-50 border-purple-200">
                                <CardContent className="p-4 text-center">
                                  <TrophyIcon className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                                  <div className="text-2xl font-bold text-purple-600">{stats.certificatesEarned}</div>
                                  <div className="text-sm text-gray-500">Certificates</div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-3">My Courses</h3>
                            
                            {userCourses.length === 0 ? (
                              <Card className="bg-gray-50 p-8 text-center">
                                <BookOpenIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                                <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                                <Button onClick={() => setLocation("/learning")}>Browse Courses</Button>
                              </Card>
                            ) : (
                              <div className="space-y-4">
                                {userCourses.map((userCourse: any, index: number) => (
                                  <Card key={index} className="overflow-hidden">
                                    <div className="flex flex-col sm:flex-row p-4">
                                      <div className="sm:w-24 sm:h-24 h-40 mb-4 sm:mb-0 sm:mr-4">
                                        <img 
                                          src={userCourse.course.thumbnail} 
                                          alt={userCourse.course.title}
                                          className="w-full h-full object-cover rounded-md"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                          <div>
                                            <Badge className="mb-2">{userCourse.course.category}</Badge>
                                            <h4 className="font-semibold">{userCourse.course.title}</h4>
                                          </div>
                                          <Button 
                                            size="sm" 
                                            className="sm:self-start mt-2 sm:mt-0"
                                            onClick={() => setLocation(`/courses/${userCourse.courseId}/learn`)}
                                          >
                                            Continue Learning
                                          </Button>
                                        </div>
                                        <div className="mb-2">
                                          <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="font-medium">
                                              {Math.round((userCourse.completedModules / userCourse.course.totalModules) * 100)}%
                                            </span>
                                          </div>
                                          <Progress 
                                            value={(userCourse.completedModules / userCourse.course.totalModules) * 100} 
                                            className="h-2"
                                          />
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {userCourse.completedModules} of {userCourse.course.totalModules} modules completed
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-3">Certificates & Achievements</h3>
                            
                            {stats.certificatesEarned > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {[...Array(stats.certificatesEarned)].map((_, index) => (
                                  <Card key={index} className="overflow-hidden">
                                    <div className="p-4">
                                      <div className="flex justify-between items-start mb-4">
                                        <Badge className="bg-gradient-to-r from-blue-600 to-primary text-white">Certificate</Badge>
                                        <div className="text-sm text-gray-500">Issued {index < 2 ? "Apr 2023" : "Jun 2023"}</div>
                                      </div>
                                      <h4 className="font-semibold mb-1">
                                        {index === 0 && "Advanced JavaScript Mastery"}
                                        {index === 1 && "React Development Fundamentals"}
                                        {index === 2 && "Node.js Backend Engineering"}
                                        {index === 3 && "Full-Stack Web Development"}
                                        {index === 4 && "TypeScript for Professionals"}
                                      </h4>
                                      <div className="text-sm text-gray-500 mb-4">
                                        {index === 0 && "Completed with 97% score"}
                                        {index === 1 && "Completed with 92% score"}
                                        {index === 2 && "Completed with 95% score"}
                                        {index === 3 && "Completed with 90% score"}
                                        {index === 4 && "Completed with 94% score"}
                                      </div>
                                      <Button variant="outline" size="sm">View Certificate</Button>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <Card className="bg-gray-50 p-6 text-center">
                                <TrophyIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium mb-2">No certificates yet</h3>
                                <p className="text-gray-500 mb-1">Complete courses to earn certificates</p>
                              </Card>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="billing">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                            
                            <Card className="mb-4">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="h-10 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold mr-3">
                                      VISA
                                    </div>
                                    <div>
                                      <div className="font-medium">Visa ending in 4242</div>
                                      <div className="text-sm text-gray-500">Expires 12/2025</div>
                                    </div>
                                  </div>
                                  <Badge>Default</Badge>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Button className="flex items-center gap-1">
                              <CreditCardIcon className="h-4 w-4" />
                              <span>Add Payment Method</span>
                            </Button>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Billing History</h3>
                            
                            <Card>
                              <CardContent className="p-0">
                                <div className="divide-y">
                                  {[
                                    { date: "Apr 15, 2023", amount: "$49.99", description: "Advanced JavaScript Patterns" },
                                    { date: "Mar 02, 2023", amount: "$39.99", description: "React Development Fundamentals" },
                                    { date: "Feb 10, 2023", amount: "$59.99", description: "Node.js Backend Engineering" }
                                  ].map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-4">
                                      <div>
                                        <div className="font-medium">{item.description}</div>
                                        <div className="text-sm text-gray-500">{item.date}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-medium">{item.amount}</div>
                                        <Button variant="link" size="sm" className="h-auto p-0">
                                          Download Receipt
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Subscription</h3>
                            
                            <Card className="mb-4">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                  <div>
                                    <div className="font-medium">Free Plan</div>
                                    <div className="text-sm text-gray-500">
                                      Limited access to courses and features
                                    </div>
                                  </div>
                                  <Badge className="bg-blue-100 text-primary">Current</Badge>
                                </div>
                                
                                <Button
                                  className="w-full flex items-center justify-center gap-1"
                                  onClick={() => setLocation("/settings/upgrade")}
                                >
                                  <span>Upgrade to Pro</span>
                                </Button>
                              </CardContent>
                            </Card>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-medium mb-2">Pro Plan Benefits</h4>
                              <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm">
                                  <CheckIcon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                  <span>Unlimited access to all courses and content</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                  <CheckIcon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                  <span>Certificate of completion for all courses</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                  <CheckIcon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                  <span>Direct messaging with instructors</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                  <CheckIcon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                  <span>Download course materials for offline learning</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="notifications">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                            
                            <Card>
                              <CardContent className="p-0">
                                <div className="divide-y">
                                  <div className="flex justify-between items-center p-4">
                                    <div>
                                      <div className="font-medium">Course Updates</div>
                                      <div className="text-sm text-gray-500">Updates and announcements for enrolled courses</div>
                                    </div>
                                    <Switch id="course-updates" defaultChecked />
                                  </div>
                                  
                                  <div className="flex justify-between items-center p-4">
                                    <div>
                                      <div className="font-medium">Forum Activity</div>
                                      <div className="text-sm text-gray-500">Replies to your posts and mentions</div>
                                    </div>
                                    <Switch id="forum-activity" defaultChecked />
                                  </div>
                                  
                                  <div className="flex justify-between items-center p-4">
                                    <div>
                                      <div className="font-medium">New Courses</div>
                                      <div className="text-sm text-gray-500">Notifications about new course releases</div>
                                    </div>
                                    <Switch id="new-courses" />
                                  </div>
                                  
                                  <div className="flex justify-between items-center p-4">
                                    <div>
                                      <div className="font-medium">Promotions & Offers</div>
                                      <div className="text-sm text-gray-500">Special deals and discount promotions</div>
                                    </div>
                                    <Switch id="promotions" />
                                  </div>
                                  
                                  <div className="flex justify-between items-center p-4">
                                    <div>
                                      <div className="font-medium">Learning Reminders</div>
                                      <div className="text-sm text-gray-500">Weekly reminders to continue your courses</div>
                                    </div>
                                    <Switch id="learning-reminders" defaultChecked />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
                            
                            <Card>
                              <CardContent className="p-4">
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <BellIcon className="h-6 w-6 mx-auto mb-2 text-primary" />
                                    <div className="font-medium mb-1">In-App</div>
                                    <Switch id="in-app-notifications" defaultChecked />
                                  </div>
                                  
                                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <svg className="h-6 w-6 mx-auto mb-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="font-medium mb-1">Email</div>
                                    <Switch id="email-notifications" defaultChecked />
                                  </div>
                                  
                                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <svg className="h-6 w-6 mx-auto mb-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M9 16C2.814 16 2 14.393 2 12V6.5C2 4.567 3.567 3 5.5 3H9M9 16C15.186 16 16 14.393 16 12V6.5C16 4.567 14.433 3 12.5 3H9M9 16V21M9 21H6M9 21H12M15 7C15 6.44772 15.4477 6 16 6H18C18.5523 6 19 6.44772 19 7V9C19 9.55228 18.5523 10 18 10H16C15.4477 10 15 9.55228 15 9V7ZM20 7C20 6.44772 20.4477 6 21 6H23C23.5523 6 24 6.44772 24 7V9C24 9.55228 23.5523 10 23 10H21C20.4477 10 20 9.55228 20 9V7ZM15 14C15 13.4477 15.4477 13 16 13H18C18.5523 13 19 13.4477 19 14V16C19 16.5523 18.5523 17 18 17H16C15.4477 17 15 16.5523 15 16V14ZM20 14C20 13.4477 20.4477 13 21 13H23C23.5523 13 24 13.4477 24 14V16C24 16.5523 23.5523 17 23 17H21C20.4477 17 20 16.5523 20 16V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="font-medium mb-1">Mobile</div>
                                    <Switch id="mobile-notifications" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="security">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Password</h3>
                            
                            <Card>
                              <CardContent className="p-4">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input 
                                      id="current-password" 
                                      type="password" 
                                      placeholder="••••••••" 
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input 
                                      id="new-password" 
                                      type="password" 
                                      placeholder="••••••••" 
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input 
                                      id="confirm-password" 
                                      type="password" 
                                      placeholder="••••••••" 
                                    />
                                  </div>
                                  
                                  <Button>Update Password</Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                            
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div className="space-y-1">
                                    <div className="font-medium">Two-Factor Authentication</div>
                                    <div className="text-sm text-gray-500">
                                      Add an extra layer of security to your account
                                    </div>
                                  </div>
                                  <Button variant="outline">Enable</Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Sessions</h3>
                            
                            <Card>
                              <CardContent className="p-0">
                                <div className="divide-y">
                                  <div className="flex justify-between items-center p-4">
                                    <div className="flex items-center gap-3">
                                      <ShieldIcon className="h-6 w-6 text-primary" />
                                      <div>
                                        <div className="font-medium">Current Session</div>
                                        <div className="text-sm text-gray-500">Macbook Pro • San Francisco, CA</div>
                                      </div>
                                    </div>
                                    <Badge>Active Now</Badge>
                                  </div>
                                  
                                  <div className="flex justify-between items-center p-4">
                                    <div className="flex items-center gap-3">
                                      <ShieldIcon className="h-6 w-6 text-gray-400" />
                                      <div>
                                        <div className="font-medium">iPhone 13</div>
                                        <div className="text-sm text-gray-500">San Francisco, CA • Last active 2 days ago</div>
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                      Sign Out
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="bg-gray-50 p-4">
                                <Button 
                                  variant="destructive"
                                  className="w-full"
                                >
                                  Sign Out All Devices
                                </Button>
                              </CardFooter>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Account</h3>
                            
                            <Card>
                              <CardContent className="p-4">
                                <Button variant="destructive">Delete Account</Button>
                                <p className="text-sm text-gray-500 mt-2">
                                  This will permanently delete your account and all your data. This action cannot be undone.
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}