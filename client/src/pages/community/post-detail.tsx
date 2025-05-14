import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { MessageSquareIcon, EyeIcon, ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, SendIcon, HeartIcon } from "lucide-react";

export default function PostDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const postId = parseInt(params.id);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  
  // Fetch post details
  const postQuery = useQuery({
    queryKey: [`/api/discussions/${postId}`],
    staleTime: 60000,
    enabled: !isNaN(postId)
  });

  const isLoading = postQuery.isLoading;
  const post = postQuery.data;

  // Calculate relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} months ago`;
  };

  // Handle comment submission
  const handleSubmitComment = () => {
    if (!comment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please enter a comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    toast({
      title: "Comment Added",
      description: "Your comment has been posted successfully.",
    });

    // Reset comment field
    setComment("");
  };

  // Handle like/unlike
  const handleLike = () => {
    setLiked(!liked);
    
    // In a real app, this would be an API call
    toast({
      title: liked ? "Post Unliked" : "Post Liked",
      description: liked ? "You have removed your like from this post." : "You have liked this post.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Community", href: "/community" },
          { label: "Post Details", href: `/community/post/${postId}`, isCurrent: true }
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

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ) : post ? (
            <div className="max-w-4xl mx-auto">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`text-gray-400 hover:text-primary ${post.upvoted ? 'text-primary' : ''}`}
                        onClick={() => toast({ title: "Upvoted", description: "You upvoted this post." })}
                      >
                        <ArrowUpIcon className="h-5 w-5" />
                      </Button>
                      <span className="font-medium my-1">{post.upvotes}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => toast({ title: "Downvoted", description: "You downvoted this post." })}
                      >
                        <ArrowDownIcon className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={post.user?.avatar} alt={post.user?.username} />
                          <AvatarFallback>{post.user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{post.user?.username}</span>
                          <div className="text-xs text-gray-500">{getRelativeTime(post.createdAt)}</div>
                        </div>
                      </div>
                      
                      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                      <div className="prose max-w-none mb-6">
                        <p className="text-gray-700">{post.content}</p>
                      </div>
                      
                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 mt-4">
                        <div className="mr-4 flex items-center">
                          <EyeIcon className="mr-1 h-4 w-4" />
                          <span>{post.views} views</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquareIcon className="mr-1 h-4 w-4" />
                          <span>{post.comments?.length || 0} comments</span>
                        </div>
                        <div className="ml-auto">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-500'}`}
                            onClick={handleLike}
                          >
                            <HeartIcon className="h-4 w-4" />
                            <span>{liked ? 'Liked' : 'Like'}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Comments section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Comments ({post.comments?.length || 0})</h2>
                
                {/* Add comment */}
                <div className="mb-6">
                  <Textarea
                    placeholder="Write a comment..."
                    className="mb-2"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button 
                    className="flex items-center gap-1"
                    onClick={handleSubmitComment}
                  >
                    <SendIcon className="h-4 w-4" />
                    Post Comment
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                {/* Comments list */}
                {post.comments?.length > 0 ? (
                  <div className="space-y-4">
                    {post.comments.map((comment: any) => (
                      <Card key={comment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={comment.user?.avatar} alt={comment.user?.username} />
                              <AvatarFallback>{comment.user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <span className="font-medium">{comment.user?.username}</span>
                                <span className="mx-2 text-gray-500">•</span>
                                <span className="text-xs text-gray-500">{getRelativeTime(comment.createdAt)}</span>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
                              <div className="flex items-center mt-2 text-sm">
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary">
                                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                                  <span>{comment.upvotes || 0}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary ml-2">
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquareIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquareIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Post not found</h2>
              <p className="text-gray-500 mb-6">The post you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate("/community")}>Back to Community</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}