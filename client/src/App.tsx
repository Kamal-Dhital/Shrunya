import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Learning from "@/pages/learning";
import Projects from "@/pages/projects";
import Challenges from "@/pages/challenges";
import Community from "@/pages/community";
import Jobs from "@/pages/jobs";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/learning" component={Learning} />
      <Route path="/projects" component={Projects} />
      <Route path="/challenges" component={Challenges} />
      <Route path="/community" component={Community} />
      <Route path="/jobs" component={Jobs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
