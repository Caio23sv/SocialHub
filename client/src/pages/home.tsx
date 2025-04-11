import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import StoryCircle from "@/components/ui/story-circle";
import PostCard from "@/components/ui/post-card";
import { User, PostWithUser } from "@shared/schema";

const Home = () => {
  const [, setLocation] = useLocation();
  
  // Get feed posts
  const { data: posts, isLoading: postsLoading } = useQuery<PostWithUser[]>({
    queryKey: ['/api/posts'],
  });
  
  // Get users for stories
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      // We don't have a specific endpoint for all users, so we'll extract them from posts
      if (posts) {
        const uniqueUsers = new Map<number, User>();
        posts.forEach(post => {
          if (!uniqueUsers.has(post.user.id)) {
            uniqueUsers.set(post.user.id, post.user.id === 6 ? { ...post.user, seen: true } : post.user);
          }
        });
        return Array.from(uniqueUsers.values());
      }
      return [];
    },
    enabled: !!posts,
  });
  
  const handleNotificationsClick = () => {
    setLocation("/notifications");
  };
  
  // Current user ID (in a real app, this would come from authentication)
  const currentUserId = 6; // Rafael Costa's ID
  
  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <h1 className="text-xl font-['Poppins'] font-bold text-primary">RedeSocial</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={handleNotificationsClick} className="text-gray-700 hover:text-primary">
              <i className="ri-heart-3-line text-2xl"></i>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-14 pb-16 overflow-auto" id="main-content">
        {/* Stories section */}
        <div className="px-4 py-3 overflow-x-auto">
          <div className="flex space-x-4">
            {usersLoading ? (
              // Story loading skeletons
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-1">
                  <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))
            ) : (
              users?.map(user => (
                <StoryCircle key={user.id} user={user} />
              ))
            )}
          </div>
        </div>
        
        {/* Posts section */}
        <div className="mt-2">
          {postsLoading ? (
            // Post loading skeletons
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="border-b border-gray-200 mb-4 pb-2">
                <div className="px-4 py-2 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mr-2"></div>
                  <div>
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mt-1"></div>
                  </div>
                </div>
                <div className="w-full h-96 bg-gray-200 animate-pulse"></div>
                <div className="px-4 py-2">
                  <div className="h-8 flex space-x-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mt-2"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse mt-2"></div>
                  <div className="w-32 h-3 bg-gray-200 rounded animate-pulse mt-2"></div>
                </div>
              </div>
            ))
          ) : (
            posts?.map(post => (
              <PostCard key={post.id} post={post} currentUserId={currentUserId} />
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
