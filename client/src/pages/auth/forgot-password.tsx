import { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

// Password reset flow steps
type PasswordResetStep = "email" | "verification" | "reset" | "success";

// Email schema for first step
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// OTP verification schema for second step
const verificationSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// Password reset schema for final step
const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<PasswordResetStep>("email");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  
  // Form for email submission
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  
  // Form for OTP verification
  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      otp: "",
    },
  });
  
  // Form for password reset
  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Mutation for requesting password reset
  const requestResetMutation = useMutation({
    mutationFn: async (values: z.infer<typeof emailSchema>) => {
      setIsLoading(true);
      setError(null);
      try {
        // Store email for next steps
        setEmail(values.email);
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // In a real app, we would send a request to the server to send a reset email/OTP
        return { success: true };
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Verification code sent",
        description: `We've sent a verification code to ${email}. Please check your inbox.`,
      });
      setCurrentStep("verification");
    },
    onError: (error) => {
      console.error("Reset request error:", error);
      // Error is already set in the mutation function
    },
  });
  
  // Mutation for verifying OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async (values: z.infer<typeof verificationSchema>) => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // In a real app, we would verify the OTP with the server
        // For demo purposes, any 6-digit code will work
        if (values.otp.length === 6) {
          return { success: true };
        } else {
          throw new Error("Invalid verification code");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Verification successful",
        description: "Your identity has been verified. You can now reset your password.",
      });
      setCurrentStep("reset");
    },
    onError: (error) => {
      console.error("OTP verification error:", error);
      // Error is already set in the mutation function
    },
  });
  
  // Mutation for resetting password
  const resetPasswordMutation = useMutation({
    mutationFn: async (values: z.infer<typeof resetPasswordSchema>) => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // In a real app, we would send the new password to the server
        return { success: true };
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Password reset successful",
        description: "Your password has been reset successfully.",
      });
      setCurrentStep("success");
    },
    onError: (error) => {
      console.error("Password reset error:", error);
      // Error is already set in the mutation function
    },
  });

  // Form submission handlers
  const onEmailSubmit = (values: z.infer<typeof emailSchema>) => {
    requestResetMutation.mutate(values);
  };
  
  const onVerificationSubmit = (values: z.infer<typeof verificationSchema>) => {
    verifyOtpMutation.mutate(values);
  };
  
  const onResetPasswordSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    resetPasswordMutation.mutate(values);
  };
  
  // Helper for resending OTP
  const handleResendOtp = () => {
    if (email) {
      toast({
        title: "Verification code resent",
        description: `We've sent a new verification code to ${email}.`,
      });
    }
  };
  
  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "email":
        return (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending verification code..." : "Send verification code"}
              </Button>
            </form>
          </Form>
        );
      
      case "verification":
        return (
          <>
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <p className="text-sm">
                We've sent a verification code to <strong>{email}</strong>. 
                The code will expire in 10 minutes.
              </p>
            </Alert>
            <Form {...verificationForm}>
              <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-4">
                <FormField
                  control={verificationForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter 6-digit code" 
                          {...field} 
                          maxLength={6}
                          className="text-center tracking-widest font-mono text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setCurrentStep("email")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </div>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOtp}
                  >
                    Resend code
                  </Button>
                </div>
              </form>
            </Form>
          </>
        );
      
      case "reset":
        return (
          <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
              <FormField
                control={resetPasswordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resetPasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setCurrentStep("verification")}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          </Form>
        );
      
      case "success":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-lg font-medium">Password Reset Successful</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Button 
              className="w-full" 
              onClick={() => navigate("/auth/login")}
            >
              Back to Login
            </Button>
          </div>
        );
    }
  };
  
  // Progress indicators for the stepper
  const renderStepper = () => {
    const steps = [
      { key: "email", label: "Email" },
      { key: "verification", label: "Verification" },
      { key: "reset", label: "Reset" }
    ];
    
    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            {/* Step Circle */}
            <div 
              className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${currentStep === "success" ? "border-green-500 bg-green-50" : 
                  currentStep === step.key || 
                  steps.findIndex(s => s.key === currentStep) > index ? 
                  "border-primary bg-primary/10" : "border-gray-300 bg-gray-50"}
              `}
            >
              <span 
                className={`text-sm font-medium 
                  ${currentStep === "success" ? "text-green-500" : 
                    currentStep === step.key || 
                    steps.findIndex(s => s.key === currentStep) > index ? 
                    "text-primary" : "text-gray-400"}
                `}
              >
                {index + 1}
              </span>
            </div>
            
            {/* Step Label */}
            <span 
              className={`text-sm ml-2 
                ${currentStep === step.key || 
                  steps.findIndex(s => s.key === currentStep) > index ? 
                  "text-gray-800 font-medium" : "text-gray-400"}
              `}
            >
              {step.label}
            </span>
            
            {/* Connector line (except for last item) */}
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-0.5 mx-4 
                  ${steps.findIndex(s => s.key === currentStep) > index ? 
                    "bg-primary" : "bg-gray-300"}
                `}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit flex items-center gap-1 mb-2"
            onClick={() => navigate("/auth/login")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Button>
          <div className="flex justify-center mb-4">
            <div className="flex items-center">
              <svg 
                className="w-8 h-8 text-primary mr-2" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" 
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-2xl font-bold text-primary">SHRUNYA</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Reset your password</CardTitle>
          <CardDescription className="text-center">
            {currentStep === "email" && "Enter your email to receive a verification code"}
            {currentStep === "verification" && "Enter the verification code sent to your email"}
            {currentStep === "reset" && "Create a new password for your account"}
            {currentStep === "success" && "Your password has been reset successfully"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Stepper */}
          {currentStep !== "success" && renderStepper()}
          
          {/* Step Content */}
          {renderStepContent()}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Button
              variant="link"
              className="p-0 text-primary"
              onClick={() => navigate("/auth/login")}
            >
              Sign in
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}