import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChallengeCardProps {
  id?: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  participants: number;
  className?: string;
}

export function ChallengeCard({
  id,
  title,
  description,
  category,
  difficulty,
  participants,
  className,
}: ChallengeCardProps) {
  // Configure category and difficulty colors
  const getCategoryColor = (category: string) => {
    const categories: Record<string, { bgColor: string, textColor: string }> = {
      Algorithm: { bgColor: "bg-blue-100", textColor: "text-primary" },
      Frontend: { bgColor: "bg-green-100", textColor: "text-accent" },
      Backend: { bgColor: "bg-purple-100", textColor: "text-purple-600" },
      DevOps: { bgColor: "bg-orange-100", textColor: "text-orange-600" },
      Mobile: { bgColor: "bg-yellow-100", textColor: "text-yellow-600" },
    };
    
    return categories[category] || { bgColor: "bg-gray-100", textColor: "text-gray-600" };
  };
  
  const getDifficultyColor = (difficulty: string) => {
    const difficulties: Record<string, { bgColor: string, textColor: string }> = {
      Easy: { bgColor: "bg-green-100", textColor: "text-green-600" },
      Medium: { bgColor: "bg-yellow-100", textColor: "text-yellow-600" },
      Hard: { bgColor: "bg-orange-100", textColor: "text-orange-600" },
    };
    
    return difficulties[difficulty] || { bgColor: "bg-gray-100", textColor: "text-gray-600" };
  };
  
  const getBorderColor = (category: string) => {
    const categories: Record<string, string> = {
      Algorithm: "border-primary",
      Frontend: "border-accent",
      Backend: "border-purple-600",
      DevOps: "border-orange-600",
      Mobile: "border-yellow-600",
    };
    
    return categories[category] || "border-gray-300";
  };
  
  const categoryStyle = getCategoryColor(category);
  const difficultyStyle = getDifficultyColor(difficulty);
  const borderColor = getBorderColor(category);

  return (
    <Card className={cn("overflow-hidden border-l-4", borderColor, className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span 
              className={cn(
                "inline-block px-2 py-1 rounded text-xs font-medium mb-2", 
                categoryStyle.bgColor, 
                categoryStyle.textColor
              )}
            >
              {category}
            </span>
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
          <span 
            className={cn(
              "text-xs px-2 py-1 rounded-full", 
              difficultyStyle.bgColor, 
              difficultyStyle.textColor
            )}
          >
            {difficulty}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Participants:</span>
            <span className="font-medium">{participants}</span>
          </div>
          <a href={`/challenges/${id}`} className="text-primary text-sm font-medium">View challenge</a>
        </div>
      </CardContent>
    </Card>
  );
}
