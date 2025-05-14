import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { SendIcon, PlayIcon, FileIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function ChallengeEditor() {
  const { toast } = useToast();
  const [match, params] = useRoute("/challenges/:id/editor");
  const [, navigate] = useLocation();
  const challengeId = params?.id;
  
  // Fetch challenge data
  const { data: challenge, isLoading } = useQuery({
    queryKey: [`/api/challenges/${challengeId}`],
    enabled: !!challengeId,
    staleTime: 60000
  });

  // State for code editor
  const [activeTab, setActiveTab] = useState("solution");
  const [code, setCode] = useState(
`// Write your solution here
function solution(input) {
  // Your code here
  return input.reduce((sum, num) => sum + num, 0);
}

// Example usage
const result = solution([1, 2, 3, 4, 5]);
console.log(result); // Should output: 15
`
  );
  const [testCode, setTestCode] = useState(
`// Test cases for your solution
function runTests() {
  const testCases = [
    { input: [1, 2, 3, 4, 5], expected: 15 },
    { input: [10, 20, 30], expected: 60 },
    { input: [-1, -2, -3], expected: -6 },
    { input: [], expected: 0 }
  ];
  
  let passed = 0;
  const results = [];
  
  for (const test of testCases) {
    const result = solution(test.input);
    const success = result === test.expected;
    
    if (success) passed++;
    
    results.push({
      input: JSON.stringify(test.input),
      expected: test.expected,
      actual: result,
      success
    });
  }
  
  return {
    passed,
    total: testCases.length,
    results
  };
}

// Run the tests
const testResults = runTests();
console.log(\`Passed \${testResults.passed}/\${testResults.total} tests\`);

// Display detailed results
testResults.results.forEach((result, index) => {
  console.log(\`Test \${index + 1}: \${result.success ? 'PASS' : 'FAIL'}\`);
  console.log(\`  Input: \${result.input}\`);
  console.log(\`  Expected: \${result.expected}\`);
  console.log(\`  Actual: \${result.actual}\`);
});
`
  );
  
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [testResults, setTestResults] = useState<{passed: number, total: number, success: boolean} | null>(null);

  // Run code
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("");
    
    // Simulate code execution
    setTimeout(() => {
      try {
        // Combine solution and test code
        const combinedCode = `${code}\n\n${testCode}`;
        
        // Create a function to capture console.log output
        let logs: string[] = [];
        const originalConsoleLog = console.log;
        console.log = (...args) => {
          logs.push(args.join(' '));
        };
        
        // Execute the code
        // In a real app, this would be done in a sandbox
        // eslint-disable-next-line no-eval
        eval(combinedCode);
        
        // Restore console.log
        console.log = originalConsoleLog;
        
        // Set output
        setOutput(logs.join('\n'));
        
        // Parse test results
        const passedMatch = logs.find(log => log.includes('Passed'));
        if (passedMatch) {
          const [passed, total] = passedMatch.match(/\d+/g) || ["0", "0"];
          setTestResults({
            passed: parseInt(passed),
            total: parseInt(total),
            success: parseInt(passed) === parseInt(total)
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          setOutput(`Error: ${error.message}`);
        } else {
          setOutput(`An unknown error occurred`);
        }
        setTestResults(null);
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };

  // Submit solution
  const handleSubmitSolution = () => {
    // First run the tests
    handleRunCode();
    // Then show the submit dialog
    setTimeout(() => setShowSubmitDialog(true), 1500);
  };

  // Confirm submission
  const confirmSubmission = () => {
    // In a real app, this would submit to the backend
    toast({
      title: "Solution Submitted",
      description: "Your solution has been submitted successfully."
    });
    
    setShowSubmitDialog(false);
    
    // Navigate to results page
    setTimeout(() => {
      navigate(`/challenges/${challengeId}/results`);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto md:ml-64">
          <Header />
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Challenges", href: "/challenges" },
            { label: "Challenge", href: `/challenges/${challengeId}` },
            { label: "Editor", href: `/challenges/${challengeId}/editor`, isCurrent: true }
          ]} />
          
          <main className="p-4 md:p-6">
            <Skeleton className="h-8 w-1/2 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
              <Skeleton className="h-full" />
              <Skeleton className="h-full" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Challenges", href: "/challenges" },
          { label: challenge?.title || "Challenge", href: `/challenges/${challengeId}` },
          { label: "Editor", href: `/challenges/${challengeId}/editor`, isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          {/* Editor Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{challenge?.title || "Challenge"}</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRunCode} 
                disabled={isRunning}
                className="gap-2"
              >
                <PlayIcon className="h-4 w-4" /> Run Tests
              </Button>
              <Button 
                onClick={handleSubmitSolution} 
                disabled={isRunning}
                className="gap-2"
              >
                <SendIcon className="h-4 w-4" /> Submit Solution
              </Button>
            </div>
          </div>
          
          {/* Editor Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
            {/* Code Editor - Wrap the entire section in Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
              <div className="p-3 border-b border-gray-200">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="solution">Solution</TabsTrigger>
                  <TabsTrigger value="tests">Tests</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-4 flex-1 overflow-auto">
                <TabsContent value="solution" className="h-full mt-0">
                  <textarea
                    className="w-full h-full font-mono text-sm p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck="false"
                  />
                </TabsContent>
                <TabsContent value="tests" className="h-full mt-0">
                  <textarea
                    className="w-full h-full font-mono text-sm p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                    spellCheck="false"
                  />
                </TabsContent>
              </div>
            </Tabs>
            
            {/* Output Console */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-medium flex items-center gap-1">
                  <FileIcon className="h-4 w-4 text-primary" /> Output
                </h2>
                {testResults && (
                  <div className="flex items-center gap-2">
                    {testResults.success ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircleIcon className="h-4 w-4" /> All tests passed
                      </span>
                    ) : (
                      <span className="text-orange-600 flex items-center gap-1">
                        <AlertCircleIcon className="h-4 w-4" /> 
                        {testResults.passed}/{testResults.total} tests passed
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-4 flex-1 overflow-auto bg-gray-900 text-gray-100 font-mono text-sm">
                {isRunning ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                    <span>Running code...</span>
                  </div>
                ) : output ? (
                  <pre className="whitespace-pre-wrap">{output}</pre>
                ) : (
                  <div className="text-gray-500 h-full flex items-center justify-center">
                    <p>Run your code to see output here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Dialog */}
          <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Your Solution</DialogTitle>
                <DialogDescription>
                  Are you sure you want to submit your solution? Once submitted, you won't be able to make changes.
                </DialogDescription>
              </DialogHeader>
              
              {testResults && (
                <div className="py-4">
                  <div className="flex items-center gap-2 mb-2">
                    {testResults.success ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        <span className="font-medium">All tests passed!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircleIcon className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">
                          {testResults.passed} out of {testResults.total} tests passed
                        </span>
                      </>
                    )}
                  </div>
                  
                  {!testResults.success && (
                    <p className="text-gray-500 text-sm">
                      You can still submit with failing tests, but you might want to fix the issues first.
                    </p>
                  )}
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
                <Button onClick={confirmSubmission}>Submit Solution</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}