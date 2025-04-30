import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  CreditCardIcon,
  LockIcon,
  ShieldIcon,
  CheckIcon,
  ArrowLeftIcon,
  AlertTriangleIcon,
} from "lucide-react";

export default function CourseCheckout() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const courseId = parseInt(params.id);
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: ""
  });

  // Fetch course details
  const courseQuery = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    staleTime: 60000,
    enabled: !isNaN(courseId)
  });

  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/user-courses", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-courses/1"] });
      toast({
        title: "Payment Successful!",
        description: "You've successfully enrolled in this course",
        variant: "default",
      });
      // Navigate to course page
      setLocation(`/courses/${courseId}/learn`);
    }
  });

  // Validate form
  const isFormValid = () => {
    if (paymentMethod === "credit-card") {
      return (
        cardDetails.cardNumber.length >= 16 &&
        cardDetails.cardName.length > 3 &&
        cardDetails.expiry.length >= 5 &&
        cardDetails.cvc.length >= 3
      );
    }
    return true;
  };

  // Handle payment form submission
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: "Invalid Details",
        description: "Please fill in all the required fields correctly",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Complete enrollment after "payment"
        enrollMutation.mutate({
          userId: 1, // Using mock user ID for now
          courseId: courseId,
          completedModules: 0
        });
      }
    }, 150);
  };
  
  const course = courseQuery.data;
  const isLoading = courseQuery.isLoading;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setLocation(`/courses/${courseId}`)}
              className="mb-6"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Course
            </Button>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-40 mb-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : course ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Payment form */}
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Complete your purchase</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isProcessing ? (
                        <div className="py-8">
                          <div className="flex justify-center mb-4">
                            {progress < 100 ? (
                              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                            ) : (
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckIcon className="h-6 w-6 text-accent" />
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-medium mb-2">
                              {progress < 100 ? "Processing payment..." : "Payment complete!"}
                            </h3>
                            <p className="text-gray-500 mb-4">
                              {progress < 100 
                                ? "Please don't close or refresh this page." 
                                : "You've been successfully enrolled in this course."}
                            </p>
                            <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
                              <div 
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            {progress >= 100 && (
                              <Button 
                                onClick={() => setLocation(`/courses/${courseId}/learn`)}
                                className="mt-4"
                              >
                                Start Learning
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handlePayment}>
                          <div className="mb-6">
                            <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                            <RadioGroup 
                              defaultValue="credit-card" 
                              value={paymentMethod}
                              onValueChange={setPaymentMethod}
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2 p-3 border rounded-md bg-white">
                                <RadioGroupItem value="credit-card" id="credit-card" />
                                <Label htmlFor="credit-card" className="flex items-center flex-1 cursor-pointer">
                                  <CreditCardIcon className="mr-2 h-5 w-5 text-primary" />
                                  <span>Credit / Debit Card</span>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 border rounded-md bg-white">
                                <RadioGroupItem value="paypal" id="paypal" />
                                <Label htmlFor="paypal" className="flex items-center flex-1 cursor-pointer">
                                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.067 7.301C20.067 10.143 18.25 11.895 15.615 11.895H14.096C13.841 11.895 13.632 12.096 13.593 12.349L13.189 14.72L12.685 17.77C12.656 17.941 12.517 18.065 12.345 18.065H10.097C9.91 18.065 9.774 17.925 9.8 17.739L10.384 14.166L10.384 14.164C10.41 13.991 10.55 13.867 10.722 13.867H11.349C13.528 13.867 15.147 12.52 15.613 10.214C15.806 9.207 15.738 8.368 15.352 7.727C15.249 7.563 15.127 7.419 14.985 7.301H20.067Z" fill="#179BD7" />
                                    <path d="M15.352 7.728C15.282 7.617 15.202 7.514 15.116 7.419C14.693 7.003 14.075 6.812 13.329 6.812H10.137C9.882 6.812 9.657 6.997 9.598 7.247L8.14 15.704C8.103 15.916 8.265 16.113 8.48 16.113H10.248L10.826 12.35C10.884 12.097 11.093 11.896 11.349 11.896H12.868C15.502 11.896 17.319 10.142 17.319 7.302C17.319 7.102 17.306 6.911 17.282 6.725C17.067 7.131 16.542 7.73 15.352 7.73" fill="#253B80" />
                                  </svg>
                                  <span>PayPal</span>
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          {paymentMethod === "credit-card" && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="card-number">Card Number</Label>
                                <Input 
                                  id="card-number"
                                  placeholder="1234 5678 9012 3456"
                                  value={cardDetails.cardNumber}
                                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                                  maxLength={19}
                                  className="bg-white"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="card-name">Cardholder Name</Label>
                                <Input 
                                  id="card-name"
                                  placeholder="John Smith"
                                  value={cardDetails.cardName}
                                  onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                                  className="bg-white"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="expiry">Expiry Date</Label>
                                  <Input 
                                    id="expiry"
                                    placeholder="MM/YY"
                                    value={cardDetails.expiry}
                                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                                    maxLength={5}
                                    className="bg-white"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="cvc">CVC/CVV</Label>
                                  <Input 
                                    id="cvc"
                                    placeholder="123"
                                    value={cardDetails.cvc}
                                    onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                                    maxLength={4}
                                    className="bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-6">
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <LockIcon className="h-4 w-4 mr-1" />
                              <span>This is a secure, encrypted payment</span>
                            </div>
                            <Button type="submit" className="w-full">
                              Pay ${course.price || "49.99"}
                            </Button>
                          </div>
                        </form>
                      )}
                    </CardContent>
                    {!isProcessing && (
                      <CardFooter className="bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center p-4 text-center sm:text-left">
                        <div className="flex items-center text-sm text-gray-500 mb-2 sm:mb-0">
                          <ShieldIcon className="h-4 w-4 mr-1" />
                          <span>30-Day Money-Back Guarantee</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Need help? <a href="#" className="text-primary hover:underline">Contact support</a>
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                  
                  {!isProcessing && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex">
                        <AlertTriangleIcon className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-700">
                          <p className="font-medium mb-1">This is a demo payment page</p>
                          <p>No actual payment will be processed. You can use any card details for this simulation.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Order summary */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start mb-4">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-20 h-16 object-cover rounded-md mr-3"
                        />
                        <div>
                          <h3 className="font-medium">{course.title}</h3>
                          <div className="text-sm text-gray-500">
                            {course.totalModules} modules • Lifetime access
                          </div>
                          {course.isPremium && (
                            <Badge className="mt-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Original Price</span>
                          <span>${course.originalPrice || "69.99"}</span>
                        </div>
                        {course.discount && (
                          <div className="flex justify-between text-accent">
                            <span>Discount ({course.discount}%)</span>
                            <span>-${((course.originalPrice || 69.99) * (course.discount / 100)).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>${course.price || "49.99"}</span>
                      </div>
                      
                      <div className="mt-6 text-sm text-gray-500">
                        <p>
                          By completing your purchase, you agree to our{" "}
                          <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                          <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-2">Course not found</h2>
                <p className="text-gray-500 mb-4">The course you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => setLocation("/learning")}>
                  Back to Courses
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}