import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClockIcon, DollarSignIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  logoUrl?: string;
  postedAt: Date;
  tags: string[];
  className?: string;
}

export function JobCard({
  title,
  company,
  location,
  description,
  salary,
  logoUrl,
  postedAt,
  tags,
  className,
}: JobCardProps) {
  // Calculate how many days ago the job was posted
  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffInTime = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };
  
  // Configure tags styling based on job category
  const getTagStyle = (tag: string) => {
    const categoryStyles: Record<string, { bgColor: string, textColor: string }> = {
      React: { bgColor: "bg-blue-100", textColor: "text-primary" },
      Redux: { bgColor: "bg-blue-100", textColor: "text-primary" },
      GraphQL: { bgColor: "bg-blue-100", textColor: "text-primary" },
      TypeScript: { bgColor: "bg-blue-100", textColor: "text-primary" },
      
      Python: { bgColor: "bg-purple-100", textColor: "text-purple-600" },
      FastAPI: { bgColor: "bg-purple-100", textColor: "text-purple-600" },
      AWS: { bgColor: "bg-purple-100", textColor: "text-purple-600" },
      PostgreSQL: { bgColor: "bg-purple-100", textColor: "text-purple-600" },
      
      Kubernetes: { bgColor: "bg-gray-100", textColor: "text-gray-700" },
      Docker: { bgColor: "bg-gray-100", textColor: "text-gray-700" },
      "CI/CD": { bgColor: "bg-gray-100", textColor: "text-gray-700" },
      Terraform: { bgColor: "bg-gray-100", textColor: "text-gray-700" },
    };
    
    return categoryStyles[tag] || { bgColor: "bg-gray-100", textColor: "text-gray-700" };
  };

  return (
    <Card className={cn("mb-4", className)}>
      <CardContent className="p-4">
        <div className="flex items-start mb-3">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt={`${company} logo`} 
              className="w-12 h-12 rounded-lg object-cover mr-3"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-gray-500 text-sm">{company} • {location}</p>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-3">{description}</p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => {
              const style = getTagStyle(tag);
              return (
                <Badge 
                  key={index} 
                  className={cn("text-xs", style.bgColor, style.textColor)}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <ClockIcon className="mr-1 h-4 w-4" />
            <span>Posted {getDaysAgo(postedAt)}</span>
          </div>
          
          {salary && (
            <div className="flex items-center text-gray-500">
              <DollarSignIcon className="mr-1 h-4 w-4" />
              <span>{salary}</span>
            </div>
          )}
        </div>
        
        <div className="mt-3">
          <Button className="w-full bg-primary hover:bg-primary/90">
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
