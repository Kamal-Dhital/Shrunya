import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-gray-50">
      <Card className="w-full max-w-md mx-4 shadow-lg border-2 border-gray-100">
        <CardContent className="pt-10 pb-8 px-8 text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">404 Page Not Found</h1>
            <p className="text-gray-600 max-w-sm">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              variant="default" 
              className="w-full" 
              onClick={() => navigate("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
