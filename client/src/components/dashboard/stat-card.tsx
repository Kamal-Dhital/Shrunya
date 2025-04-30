import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  changeText?: string;
  changeIcon?: ReactNode;
  changeColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  iconBgColor,
  changeText,
  changeIcon = <ArrowUpIcon className="h-3 w-3" />,
  changeColor = "text-green-600",
  className,
}: StatCardProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-4", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        </div>
        <div className={cn("p-2 rounded-lg", iconBgColor)}>
          {icon}
        </div>
      </div>
      {changeText && (
        <div className={cn("mt-3 text-xs font-medium flex items-center", changeColor)}>
          {changeIcon}
          <span>{changeText}</span>
        </div>
      )}
    </div>
  );
}
