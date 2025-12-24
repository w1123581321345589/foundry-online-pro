import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";

// Import pages
import Home from "@/pages/Home";
import OperatorOnboarding from "@/pages/OperatorOnboarding";
import OperatorPayouts from "@/pages/OperatorPayouts";
import ParentPortalPage from "@/pages/ParentPortalPage";
import InstructorDashboard from "@/pages/InstructorDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/operator/onboarding" component={OperatorOnboarding} />
      <Route path="/operator/payouts" component={OperatorPayouts} />
      <Route path="/parent" component={ParentPortalPage} />
      <Route path="/instructor/sessions" component={InstructorDashboard} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light" storageKey="foundry-ui-theme">
          <div className="min-h-screen bg-background font-sans antialiased">
            <Navigation />
            <main className="flex-1">
              <Router />
            </main>
            <Toaster />
          </div>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
