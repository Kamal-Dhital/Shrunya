import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  totalModules: number;
  completedModules: number;
  className?: string;
}

export function CourseCard({
  id,
  title,
  description,
  category,
  thumbnail,
  totalModules,
  completedModules,
  className,
}: CourseCardProps) {
  const [, navigate] = useLocation();
  const progressPercentage = (completedModules / totalModules) * 100;
  
  const getCategoryColorClass = (category: string) => {
    const categories: Record<string, string> = {
      JavaScript: "bg-primary",
      React: "bg-secondary",
      Python: "bg-purple-600",
      TypeScript: "bg-blue-500",
      Node: "bg-green-600",
    };
    
    return categories[category] || "bg-gray-600";
  };
  
  const handleCardClick = () => {
    // If course has progress, go to learning page, otherwise go to course details
    if (completedModules > 0) {
      navigate(`/courses/${id}/learn`);
    } else {
      navigate(`/courses/${id}`);
    }
  };

  return (
    <Card 
      className={cn("overflow-hidden flex flex-col cursor-pointer", className)}
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={thumbnail} 
          alt={`${title} course thumbnail`} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className={cn("text-white text-xs font-medium px-2 py-1 rounded", getCategoryColorClass(category))}>
            {category}
          </span>
        </div>
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-4">{description}</p>
        
        <div className="mt-auto">
          <Progress value={progressPercentage} className="h-2 mb-2" />
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">{progressPercentage.toFixed(0)}% completed</span>
            <span className="text-gray-500">{completedModules}/{totalModules} modules</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <Button 
          variant="link" 
          className="text-primary w-full justify-center"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/courses/${id}/learn`);
          }}
        >
          Continue learning
          <ArrowRightIcon className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
