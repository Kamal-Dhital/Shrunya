import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation, useRoute } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  UserIcon,
  GlobeIcon,
  MapPinIcon,
  CalendarIcon,
  LinkIcon,
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  EditIcon,
  CheckIcon,
  XIcon,
  BellIcon,
  CreditCardIcon,
  KeyIcon,
  UserPlusIcon,
  LockIcon,
  LockIcon as PrivacyIcon,
  BookIcon,
  TrophyIcon,
  BriefcaseIcon,
  MenuIcon,
  HomeIcon,
  MessageSquareIcon
} from "lucide-react";
import { GitHubIntegration } from "@/components/github/GitHubIntegration";
import { GitHubIcon } from "@/components/icons/github";

export default function UserProfile() {
  const { toast } = useToast();
  const [, params] = useRoute("/user/:tab?");
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  
  // Extract tab from URL if present
  useEffect(() => {
    if (params?.tab) {
      setActiveTab(params.tab);
    }
  }, [params]);
  
  // Get current tab from search params
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const tab = urlSearchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [window.location.search]);
  
  // Fetch user data
  const { data: user = {}, isLoading } = useQuery({
    queryKey: ["/api/user/1"], // Hardcoded to user 1 for demo
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Prepare form data for editing
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
  
  // Update form data when user data is loaded
  useEffect(() => {
    if (user && !isLoading) {
      setFormData({
        name: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        github: user.github || "",
        twitter: user.twitter || "",
        linkedin: user.linkedin || ""
      });
    }
  }, [user, isLoading]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("PATCH", `/api/user/1`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/1"] });
      setEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "User Profile", href: "/user/profile", isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">User Profile</h1>
                {!editing && (
                  <Button 
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <EditIcon className="w-4 h-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
              <p className="text-gray-500">Manage your account settings and profile information</p>
            </div>
            
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-4">
                <TabsTrigger value="profile" onClick={() => navigate("/user/profile")}>Profile</TabsTrigger>
                <TabsTrigger value="applications" onClick={() => navigate("/user/applications")}>Applications</TabsTrigger>
                <TabsTrigger value="account" onClick={() => navigate("/user/profile?tab=account")}>Account</TabsTrigger>
                <TabsTrigger value="notifications" onClick={() => navigate("/user/profile?tab=notifications")}>Notifications</TabsTrigger>
                <TabsTrigger value="security" className="hidden lg:block" onClick={() => navigate("/user/profile?tab=security")}>Security</TabsTrigger>
                <TabsTrigger value="privacy" className="hidden lg:block" onClick={() => navigate("/user/profile?tab=privacy")}>Privacy</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                {editing ? (
                  // Editing Mode
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          Update your personal information and contact details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleInputChange} 
                            placeholder="Your username"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email"
                            value={formData.email} 
                            onChange={handleInputChange} 
                            placeholder="Your email address"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea 
                            id="bio" 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleInputChange} 
                            placeholder="A short description about yourself"
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
                            placeholder="Your location"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Social Links</CardTitle>
                        <CardDescription>
                          Connect your website and social media accounts
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <div className="flex items-center">
                            <LinkIcon className="mr-2 h-4 w-4 text-gray-500" />
                            <Input 
                              id="website" 
                              name="website" 
                              value={formData.website} 
                              onChange={handleInputChange} 
                              placeholder="https://yourdomain.com"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub</Label>
                          <div className="flex items-center">
                            <GithubIcon className="mr-2 h-4 w-4 text-gray-500" />
                            <Input 
                              id="github" 
                              name="github" 
                              value={formData.github} 
                              onChange={handleInputChange} 
                              placeholder="Your GitHub username"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter</Label>
                          <div className="flex items-center">
                            <TwitterIcon className="mr-2 h-4 w-4 text-gray-500" />
                            <Input 
                              id="twitter" 
                              name="twitter" 
                              value={formData.twitter} 
                              onChange={handleInputChange} 
                              placeholder="Your Twitter username"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <div className="flex items-center">
                            <LinkedinIcon className="mr-2 h-4 w-4 text-gray-500" />
                            <Input 
                              id="linkedin" 
                              name="linkedin" 
                              value={formData.linkedin} 
                              onChange={handleInputChange} 
                              placeholder="Your LinkedIn username"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  // View Mode
                  <>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Profile Picture */}
                          <div className="flex flex-col items-center space-y-3 mb-4 md:mb-0">
                            <Avatar className="h-32 w-32">
                              <AvatarImage src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face"} alt={user.fullName || "User"} />
                              <AvatarFallback>{user.fullName ? user.fullName.substring(0, 2).toUpperCase() : "SW"}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-semibold">{user.fullName || "User"}</h2>
                            <p className="text-gray-500">@{user.username || "username"}</p>
                          </div>
                          
                          {/* Profile Info */}
                          <div className="flex-1 space-y-4">
                            {user.bio && (
                              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <p>{user.bio}</p>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {user.location && (
                                <div className="flex items-center">
                                  <MapPinIcon className="w-5 h-5 text-gray-500 mr-2" />
                                  <span>{user.location}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center">
                                <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />
                                <span>Joined {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'April 2022'}</span>
                              </div>
                              
                              {user.website && (
                                <div className="flex items-center">
                                  <LinkIcon className="w-5 h-5 text-gray-500 mr-2" />
                                  <a 
                                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {user.website}
                                  </a>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              {user.github && (
                                <a 
                                  href={`https://github.com/${user.github}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                  <GithubIcon className="w-5 h-5" />
                                </a>
                              )}
                              
                              {user.twitter && (
                                <a 
                                  href={`https://twitter.com/${user.twitter}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900"
                                >
                                  <TwitterIcon className="w-5 h-5" />
                                </a>
                              )}
                              
                              {user.linkedin && (
                                <a 
                                  href={`https://linkedin.com/in/${user.linkedin}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-700 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900"
                                >
                                  <LinkedinIcon className="w-5 h-5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Courses */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <BookIcon className="w-5 h-5 mr-2 text-primary" />
                            Enrolled Courses
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                            <div className="space-y-2">
                              {user.enrolledCourses.map((course: any) => (
                                <div key={course.id} className="flex justify-between items-center">
                                  <span>{course.title}</span>
                                  <Badge variant={course.completed ? "success" : "secondary"}>
                                    {course.completed ? "Completed" : `${course.progress}%`}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No courses enrolled yet.</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* Challenges */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <TrophyIcon className="w-5 h-5 mr-2 text-primary" />
                            Completed Challenges
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {user.completedChallenges && user.completedChallenges.length > 0 ? (
                            <div className="space-y-2">
                              {user.completedChallenges.map((challenge: any) => (
                                <div key={challenge.id} className="flex justify-between items-center">
                                  <span>{challenge.title}</span>
                                  <Badge>{challenge.difficulty}</Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No challenges completed yet.</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* Activity */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <MessageSquareIcon className="w-5 h-5 mr-2 text-primary" />
                            Recent Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {user.recentActivity && user.recentActivity.length > 0 ? (
                            <div className="space-y-2">
                              {user.recentActivity.map((activity: any) => (
                                <div key={activity.id} className="flex justify-between items-center">
                                  <span>{activity.description}</span>
                                  <span className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No recent activity.</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* GitHub Integration - Full Width */}
                      <div className="col-span-1 md:col-span-3 mt-4">
                        <GitHubIntegration username={user.github} />
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
              
              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Basic account settings and information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <span>@{user.username}</span>
                        <Button variant="ghost" size="sm">Change</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <span>{user.email || "sarah.williams@example.com"}</span>
                        <Button variant="ghost" size="sm">Change</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <span>••••••••••••</span>
                        <Button variant="ghost" size="sm">Change</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Accounts</CardTitle>
                    <CardDescription>
                      Connect your accounts to enable single sign-on
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <GithubIcon className="mr-3 h-5 w-5" />
                        <div>
                          <p className="font-medium">GitHub</p>
                          <p className="text-sm text-gray-500">Connect your GitHub account</p>
                        </div>
                      </div>
                      <Button variant="outline">{user.github ? "Disconnect" : "Connect"}</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <TwitterIcon className="mr-3 h-5 w-5 text-blue-400" />
                        <div>
                          <p className="font-medium">Twitter</p>
                          <p className="text-sm text-gray-500">Connect your Twitter account</p>
                        </div>
                      </div>
                      <Button variant="outline">{user.twitter ? "Disconnect" : "Connect"}</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <LinkedinIcon className="mr-3 h-5 w-5 text-blue-700" />
                        <div>
                          <p className="font-medium">LinkedIn</p>
                          <p className="text-sm text-gray-500">Connect your LinkedIn account</p>
                        </div>
                      </div>
                      <Button variant="outline">{user.linkedin ? "Disconnect" : "Connect"}</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>
                      Manage your subscription and billing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Free Plan</h3>
                          <p className="text-sm text-gray-500">Current plan</p>
                        </div>
                        <Badge variant="outline" className="text-primary">Active</Badge>
                      </div>
                      <p className="text-sm mb-4">Access to basic features and community resources.</p>
                      <Button variant="default">Upgrade to Pro Plan</Button>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Pro Plan</h3>
                        <span className="font-semibold">$12/month</span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center text-sm">
                          <CheckIcon className="w-4 h-4 text-primary mr-2" />
                          <span>Access to all premium courses</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckIcon className="w-4 h-4 text-primary mr-2" />
                          <span>Advanced challenges and exercises</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckIcon className="w-4 h-4 text-primary mr-2" />
                          <span>Certificate of completion</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckIcon className="w-4 h-4 text-primary mr-2" />
                          <span>Priority support</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
                      <div className="flex items-center">
                        <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-md mr-4">
                          <CreditCardIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium">No payment method added</p>
                          <p className="text-sm text-gray-500">Add a payment method to upgrade your plan</p>
                        </div>
                      </div>
                      <Button variant="outline">Add Method</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>
                      View your recent billing history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 text-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-gray-500">No billing history available</p>
                      <p className="text-sm text-gray-400">Your recent transactions will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-gray-500">
                            Receive email notifications about your activity
                          </p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="browser-notifications">Browser Notifications</Label>
                          <p className="text-sm text-gray-500">
                            Receive notifications in your browser
                          </p>
                        </div>
                        <Switch id="browser-notifications" />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="marketing-emails">Marketing Emails</Label>
                          <p className="text-sm text-gray-500">
                            Receive emails about new features and offers
                          </p>
                        </div>
                        <Switch id="marketing-emails" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Categories</CardTitle>
                    <CardDescription>
                      Choose which types of notifications you want to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="font-medium" htmlFor="course-updates">
                            Course Updates
                          </Label>
                          <p className="text-sm text-gray-500">
                            Notifications about course content updates
                          </p>
                        </div>
                        <Switch id="course-updates" defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="font-medium" htmlFor="discussion-mentions">
                            Discussion Mentions
                          </Label>
                          <p className="text-sm text-gray-500">
                            Notifications when you are mentioned in discussions
                          </p>
                        </div>
                        <Switch id="discussion-mentions" defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="font-medium" htmlFor="challenge-reminders">
                            Challenge Reminders
                          </Label>
                          <p className="text-sm text-gray-500">
                            Reminders about upcoming and ongoing challenges
                          </p>
                        </div>
                        <Switch id="challenge-reminders" defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="font-medium" htmlFor="job-alerts">
                            Job Alerts
                          </Label>
                          <p className="text-sm text-gray-500">
                            Notifications about new job opportunities
                          </p>
                        </div>
                        <Switch id="job-alerts" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch id="two-factor" />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="session-timeout">Session Timeout</Label>
                          <p className="text-sm text-gray-500">
                            Automatically log out after period of inactivity
                          </p>
                        </div>
                        <Switch id="session-timeout" defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Password</h3>
                          <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                        </div>
                        <Button variant="outline">Change Password</Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Active Sessions</h3>
                          <p className="text-sm text-gray-500">Manage your active sessions</p>
                        </div>
                        <Button variant="outline">View Sessions</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Manage how your information is displayed and shared
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="profile-visibility">Profile Visibility</Label>
                          <p className="text-sm text-gray-500">
                            Control who can view your profile
                          </p>
                        </div>
                        <select 
                          id="profile-visibility" 
                          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent"
                        >
                          <option value="public">Public</option>
                          <option value="members">Members Only</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="activity-visibility">Activity Visibility</Label>
                          <p className="text-sm text-gray-500">
                            Control who can see your activity and progress
                          </p>
                        </div>
                        <select 
                          id="activity-visibility" 
                          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent"
                        >
                          <option value="public">Public</option>
                          <option value="members">Members Only</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="data-usage">Data Usage</Label>
                          <p className="text-sm text-gray-500">
                            Allow us to use your data to improve our services
                          </p>
                        </div>
                        <Switch id="data-usage" defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <h3 className="font-medium text-red-600">Delete Account</h3>
                          <p className="text-sm text-gray-500">
                            Permanently delete your account and all your data
                          </p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}