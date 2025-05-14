import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquareIcon, XIcon, PlusIcon, ArrowLeftIcon } from "lucide-react";

export default function CreatePost() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    currentTag: ""
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formData.currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(formData.currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, prev.currentTag.trim()],
          currentTag: ""
        }));
      }
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Add tag button handler
  const handleAddTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ""
      }));
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your post.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show success message
      toast({
        title: "Post Created",
        description: "Your post has been published successfully!",
      });
      
      // Navigate to post success page
      navigate("/community/post-success");
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Community", href: "/community" },
          { label: "Create Post", href: "/community/create-post", isCurrent: true }
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
            <div className="mb-6">
              <h1 className="text-2xl font-bold flex items-center">
                <MessageSquareIcon className="mr-2 h-6 w-6 text-primary" />
                Create New Post
              </h1>
              <p className="text-gray-500">Share your thoughts, questions, or insights with the community</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Post Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter a descriptive title for your post"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Share your thoughts, code, or questions..."
                      rows={8}
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex">
                      <Input
                        id="currentTag"
                        name="currentTag"
                        placeholder="Add tags (press Enter after each tag)"
                        value={formData.currentTag}
                        onChange={handleInputChange}
                        onKeyDown={handleTagKeyDown}
                        className="flex-1 mr-2"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddTag}
                        disabled={!formData.currentTag.trim()}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button 
                              type="button" 
                              onClick={() => removeTag(tag)}
                              className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                            >
                              <XIcon className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Tags help others find your post. Add up to 5 relevant tags.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate("/community")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Publishing..." : "Publish Post"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}