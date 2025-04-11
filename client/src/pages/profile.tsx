import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Post, Product } from "@shared/schema";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, Settings, Grid, ShoppingBag, Package, Image } from "lucide-react";
import SettingsMenu from "@/components/modals/SettingsMenu";

const Profile = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'posts' | 'products'>('posts');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  
  // Get user posts (usando o id do usuário autenticado)
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: [`/api/users/${authUser?.id}/posts`],
    enabled: !!authUser?.id,
  });
  
  // Get user products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [`/api/users/${authUser?.id}/products`],
    enabled: !!authUser?.id && authUser?.isSeller === true,
  });
  
  const handleBack = () => {
    setLocation("/");
  };
  
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
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
          <button onClick={toggleSettings} className="ml-auto text-gray-700">
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
              className={`px-4 py-2 ${activeTab === 'products' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'} font-medium flex items-center`}
              onClick={() => setActiveTab('products')}
            >
              <ShoppingBag className="h-4 w-4 mr-1" /> Meus Produtos
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
          
          {activeTab === 'products' && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              {productsLoading ? (
                // Products grid skeleton
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="rounded-lg overflow-hidden bg-gray-200 animate-pulse h-48"></div>
                ))
              ) : products && products.length > 0 ? (
                products.map(product => (
                  <div key={product.id} className="border rounded-lg overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <p className="font-semibold truncate">{product.title}</p>
                      <p className="text-primary font-bold">R$ {product.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-10 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Nenhum produto cadastrado</p>
                  {!authUser?.isSeller && 
                    <button className="mt-4 bg-primary text-white px-4 py-2 rounded-lg font-medium">
                      Torne-se um vendedor
                    </button>
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isSettingsOpen && (
        <SettingsMenu isOpen={isSettingsOpen} onClose={toggleSettings} />
      )}
    </>
  );
};

export default Profile;