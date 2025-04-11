import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Notifications from "@/pages/notifications";
import Profile from "@/pages/profile";
import Search from "@/pages/search";
import CreatePost from "@/pages/create-post";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import BottomNavigation from "@/components/ui/bottom-navigation";

function Router() {
  const [location] = useLocation();
  const { user, isLoading } = useAuth();
  const showBottomNav = !location.includes("/notifications") && 
                        !location.includes("/login") && 
                        !location.includes("/signup");

  // Prefetch data if user is logged in
  useEffect(() => {
    if (user) {
      // Prefetch posts for the feed
      queryClient.prefetchQuery({
        queryKey: ['/api/posts'],
      });
      
      // Prefetch current user notifications
      queryClient.prefetchQuery({
        queryKey: [`/api/users/${user.id}/notifications`],
      });
    }
  }, [user]);
  
  // Determine which routes to show based on authentication status
  const renderRoutes = () => {
    if (isLoading) {
      return (
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      );
    }

    return (
      <Switch>
        {!user ? (
          <>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/">
              <Login />
            </Route>
          </>
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/profile" component={Profile} />
            <Route path="/search" component={Search} />
            <Route path="/create" component={CreatePost} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    );
  };
  
  return (
    <div className="relative min-h-screen max-w-md mx-auto bg-white shadow-lg overflow-hidden">
      {renderRoutes()}
      
      {showBottomNav && user && <BottomNavigation />}
      
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
