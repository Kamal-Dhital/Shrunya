import { useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, MessageSquareIcon, ArrowLeftIcon } from "lucide-react";

export default function PostSuccess() {
  const [, navigate] = useLocation();
  
  // Redirect to community page after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/community");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Community", href: "/community" },
          { label: "Post Success", href: "/community/post-success", isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/community")}
            className="mb-6 flex items-center"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Community
          </Button>
          
          <div className="max-w-3xl mx-auto">
            <Card className="border-green-100">
              <CardContent className="pt-10 pb-8 px-8 text-center">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircleIcon className="h-10 w-10 text-green-500" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Published Successfully!</h1>
                  <p className="text-gray-600 max-w-md">
                    Your post has been published to the community. Others can now view, comment, and interact with your post.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">What's Next?</h2>
                  <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => navigate("/community")}
                    >
                      <MessageSquareIcon className="h-4 w-4" />
                      View All Discussions
                    </Button>
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => navigate("/community/create-post")}
                    >
                      <MessageSquareIcon className="h-4 w-4" />
                      Create Another Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
              <MessageSquareIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Community Guidelines</h3>
                <p className="text-blue-700 text-sm">
                  Remember to follow our community guidelines when posting. Be respectful, provide value, and engage constructively with other members.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}