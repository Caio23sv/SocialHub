import { useState, useEffect } from "react";
import { PostWithUser } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

interface PostCardProps {
  post: PostWithUser;
  currentUserId: number;
}

const PostCard = ({ post, currentUserId }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  
  // Check if post is already liked by the current user
  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await fetch(`/api/likes?userId=${currentUserId}&postId=${post.id}`);
        if (response.ok) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };
    
    checkIfLiked();
  }, [currentUserId, post.id]);
  
  // Format post date
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });
  
  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => {
      return isLiked
        ? apiRequest("DELETE", `/api/likes?userId=${currentUserId}&postId=${post.id}`)
        : apiRequest("POST", "/api/likes", { userId: currentUserId, postId: post.id });
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      // Invalidate post queries to update like count
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível processar sua curtida.",
        variant: "destructive",
      });
    },
  });
  
  const handleLike = () => {
    likeMutation.mutate();
  };
  
  // Double tap to like
  const handleDoubleTap = () => {
    if (!isLiked) {
      setShowLikeAnimation(true);
      likeMutation.mutate();
      
      setTimeout(() => {
        setShowLikeAnimation(false);
      }, 1000);
    }
  };
  
  return (
    <div className="border-b border-gray-200 mb-4 pb-2">
      <div className="px-4 py-2 flex items-center">
        <img
          src={post.user.avatar}
          alt={`${post.user.name}'s avatar`}
          className="w-8 h-8 rounded-full mr-2 object-cover"
        />
        <div>
          <p className="text-sm font-semibold">{post.user.name}</p>
          <p className="text-xs text-gray-500">{post.user.location}</p>
        </div>
        <button className="ml-auto text-gray-500">
          <i className="ri-more-fill"></i>
        </button>
      </div>
      
      <div 
        className="relative" 
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={post.imageUrl}
          alt="Post content"
          className="w-full h-96 object-cover"
        />
        {showLikeAnimation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="ri-heart-3-fill text-6xl text-primary opacity-80"></i>
          </div>
        )}
      </div>
      
      <div className="px-4 py-2">
        <div className="flex items-center pb-2">
          <button 
            className={`mr-4 text-2xl ${isLiked ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            onClick={handleLike}
          >
            <i className={`${isLiked ? 'ri-heart-3-fill' : 'ri-heart-3-line'}`}></i>
          </button>
          <button className="mr-4 text-2xl text-gray-700 hover:text-primary">
            <i className="ri-chat-1-line"></i>
          </button>
          <button className="mr-4 text-2xl text-gray-700 hover:text-primary">
            <i className="ri-send-plane-line"></i>
          </button>
          <button className="ml-auto text-2xl text-gray-700 hover:text-primary">
            <i className="ri-bookmark-line"></i>
          </button>
        </div>
        
        <p className="text-sm font-semibold mb-1">{post.likesCount} curtidas</p>
        <p className="text-sm">
          <span className="font-semibold">{post.user.name}</span> {post.caption}
        </p>
        {post.commentsCount > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Ver todos os {post.commentsCount} comentários
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
      </div>
    </div>
  );
};

export default PostCard;
