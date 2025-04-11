import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Notifications from "@/pages/notifications";
import Profile from "@/pages/profile";
import Search from "@/pages/search";
import CreatePost from "@/pages/create-post";
import BottomNavigation from "@/components/ui/bottom-navigation";

function Router() {
  const [location] = useLocation();
  const showBottomNav = !location.includes("/notifications");

  // Prefetch data
  useEffect(() => {
    // Prefetch posts for the feed
    queryClient.prefetchQuery({
      queryKey: ['/api/posts'],
    });
    
    // Prefetch current user notifications
    queryClient.prefetchQuery({
      queryKey: ['/api/users/6/notifications'],
    });
  }, []);
  
  return (
    <div className="relative min-h-screen max-w-md mx-auto bg-white shadow-lg overflow-hidden">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/profile" component={Profile} />
        <Route path="/search" component={Search} />
        <Route path="/create" component={CreatePost} />
        <Route component={NotFound} />
      </Switch>
      
      {showBottomNav && <BottomNavigation />}
      
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
