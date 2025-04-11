import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, Settings, Grid, Bookmark, Tag, Image } from "lucide-react";

const Profile = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  
  // Get user posts (usando o id do usuário autenticado)
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: [`/api/users/${authUser?.id}/posts`],
    enabled: !!authUser?.id,
  });
  
  const handleBack = () => {
    setLocation("/");
  };
  
  return (
    <>
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center">
          <button onClick={handleBack} className="text-gray-700">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold ml-4">
            {authUser ? `@${authUser.username}` : 'Perfil'}
          </h2>
          <button className="ml-auto text-gray-700">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-4 pb-20">
        {!authUser ? (
          // User info skeleton
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="ml-6 flex space-x-4">
              <div className="text-center">
                <div className="w-10 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
              <div className="text-center">
                <div className="w-10 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
              <div className="text-center">
                <div className="w-10 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <img
              src={authUser.avatar || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'}
              alt="Your profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-primary"
            />
            
            <div className="ml-6 flex space-x-4">
              <div className="text-center">
                <p className="font-semibold">{authUser.postsCount || 0}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              
              <div className="text-center">
                <p className="font-semibold">{authUser.followersCount || 0}</p>
                <p className="text-sm text-gray-500">Seguidores</p>
              </div>
              
              <div className="text-center">
                <p className="font-semibold">{authUser.followingCount || 0}</p>
                <p className="text-sm text-gray-500">Seguindo</p>
              </div>
            </div>
          </div>
        )}
        
        {!authUser ? (
          // Bio skeleton
          <div className="mt-4">
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-3 bg-gray-200 rounded animate-pulse mt-2"></div>
            <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse mt-1"></div>
            <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse mt-1"></div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex flex-col gap-0.5">
              <p className="font-semibold">{authUser.name}</p>
              <p className="text-sm text-muted-foreground font-medium">@{authUser.username}</p>
              <p className="text-sm text-gray-500 mt-1">{authUser.bio || 'Adicione uma bio aqui...'}</p>
              {authUser.website && (
                <p className="text-sm text-secondary">{authUser.website}</p>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-gray-100 text-gray-700 font-semibold py-1.5 px-3 rounded-lg">
            Editar perfil
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 font-semibold py-1.5 px-3 rounded-lg">
            Compartilhar perfil
          </button>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex justify-around">
            <button 
              className={`px-4 py-2 ${activeTab === 'posts' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'} font-medium flex items-center`}
              onClick={() => setActiveTab('posts')}
            >
              <Grid className="h-4 w-4 mr-1" /> Posts
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'saved' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'} font-medium flex items-center`}
              onClick={() => setActiveTab('saved')}
            >
              <Bookmark className="h-4 w-4 mr-1" /> Salvos
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'tagged' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'} font-medium flex items-center`}
              onClick={() => setActiveTab('tagged')}
            >
              <Tag className="h-4 w-4 mr-1" /> Marcados
            </button>
          </div>
          
          {activeTab === 'posts' && (
            <div className="grid grid-cols-3 gap-1 mt-2">
              {postsLoading ? (
                // Post grid skeleton
                Array(9).fill(0).map((_, i) => (
                  <div key={i} className="w-full aspect-square bg-gray-200 animate-pulse"></div>
                ))
              ) : posts && posts.length > 0 ? (
                posts.map(post => (
                  <img
                    key={post.id}
                    src={post.imageUrl}
                    alt="Your post"
                    className="w-full aspect-square object-cover"
                  />
                ))
              ) : (
                <div className="col-span-3 py-10 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Nenhum post ainda</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'saved' && (
            <div className="py-10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Bookmark className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Nenhum item salvo</p>
            </div>
          )}
          
          {activeTab === 'tagged' && (
            <div className="py-10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Tag className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Nenhuma foto marcada</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
