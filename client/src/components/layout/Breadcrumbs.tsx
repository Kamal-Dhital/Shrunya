import React from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbsProps {
  items?: Array<{
    label: string;
    href: string;
    isCurrent?: boolean;
  }>;
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const [location] = useLocation();
  
  // If no items are provided, generate them from the current path
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location);
  
  if (breadcrumbItems.length <= 1) return null;
  
  return (
    <div className={breadcrumbStyles.container}>
      <Breadcrumb className={breadcrumbStyles.breadcrumb}>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.isCurrent ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

// Helper function to generate breadcrumbs from the current path
function generateBreadcrumbsFromPath(path: string) {
  const segments = path.split("/").filter(Boolean);
  
  // Start with home
  const breadcrumbs = [{ label: " ", href: "/" }];
  
  let currentPath = "";
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Format the segment for display (capitalize, replace hyphens with spaces)
    const formattedSegment = segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    
    breadcrumbs.push({
      label: formattedSegment,
      href: currentPath,
      isCurrent: index === segments.length - 1
    });
  });
  
  return breadcrumbs;
}

// Add CSS to ensure proper styling
const breadcrumbStyles = {
  container: "sticky top-16 z-20 bg-background border-b shadow-sm",
  breadcrumb: "px-4 py-2 md:px-6"
};