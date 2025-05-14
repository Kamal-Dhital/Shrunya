import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, EyeIcon, ArrowUpIcon, ArrowDownIcon, HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DiscussionCardProps {
  id?: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
    avatar?: string;
  };
  createdAt: Date;
  upvotes: number;
  comments: number;
  views: number;
  tags: string[];
  className?: string;
}

export function DiscussionCard({
  id = 1, // Default ID if not provided
  title,
  content,
  author,
  createdAt,
  upvotes,
  comments,
  views,
  tags,
  className,
}: DiscussionCardProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  
  // Handle like/unlike
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    
    toast({
      title: liked ? "Post Unliked" : "Post Liked",
      description: liked ? "You have removed your like from this post." : "You have liked this post.",
    });
  };
  
  // Handle upvote
  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Upvoted",
      description: "You upvoted this post.",
    });
  };
  
  // Handle downvote
  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Downvoted",
      description: "You downvoted this post.",
    });
  };
  
  // Navigate to post detail
  const goToPostDetail = () => {
    navigate(`/community/post/${id}`);
  };
  // Calculate relative time (e.g., "2 hours ago")
  const getRelativeTime = (date: Date) => {
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

  return (
    <Card 
      className={cn("mb-4 cursor-pointer hover:shadow-md transition-shadow", className)}
      onClick={goToPostDetail}
    >
      <CardContent className="p-4">
        <div className="flex">
          <div className="flex flex-col items-center mr-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-primary"
              onClick={handleUpvote}
            >
              <ArrowUpIcon className="h-5 w-5" />
            </Button>
            <span className="font-medium my-1">{upvotes}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-red-500"
              onClick={handleDownvote}
            >
              <ArrowDownIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={author.avatar} alt={author.username} />
                <AvatarFallback>{author.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-500">{author.username}</span>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-xs text-gray-500">{getRelativeTime(createdAt)}</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-gray-500 text-sm mb-3">{content}</p>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-500">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-500">
              <div className="mr-4 flex items-center">
                <MessageSquareIcon className="mr-1 h-4 w-4" />
                <span>{comments} comments</span>
              </div>
              <div className="flex items-center">
                <EyeIcon className="mr-1 h-4 w-4" />
                <span>{views} views</span>
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
  );
}
