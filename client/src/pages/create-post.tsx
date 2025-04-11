import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

const CreatePost = () => {
  const [, setLocation] = useLocation();
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Current user ID (in a real app, this would come from authentication)
  const currentUserId = 6; // Rafael Costa's ID
  
  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: () => {
      return apiRequest("POST", "/api/posts", {
        userId: currentUserId,
        caption,
        imageUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/posts`] });
      toast({
        title: "Post criado",
        description: "Seu post foi publicado com sucesso!",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o post. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      toast({
        title: "Erro",
        description: "Por favor, adicione uma imagem ao seu post.",
        variant: "destructive",
      });
      return;
    }
    
    createPostMutation.mutate();
  };
  
  // Mock image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you would upload the file to a storage service
    // For this demo, we'll just simulate an upload
    setIsUploading(true);
    
    // Simulate delay
    setTimeout(() => {
      // Use a placeholder URL
      setImageUrl("https://images.unsplash.com/photo-1526779259212-939e64788e3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80");
      setIsUploading(false);
    }, 1500);
  };
  
  const handleBack = () => {
    setLocation("/");
  };
  
  return (
    <>
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center">
          <button onClick={handleBack} className="text-gray-700">
            <i className="ri-arrow-left-line text-2xl"></i>
          </button>
          <h2 className="text-lg font-semibold ml-4">Nova Publicação</h2>
          <button 
            className={`ml-auto font-semibold ${!imageUrl || createPostMutation.isPending ? 'text-gray-400' : 'text-primary'}`}
            disabled={!imageUrl || createPostMutation.isPending}
            onClick={handleSubmit}
          >
            Compartilhar
          </button>
        </div>
      </div>
      
      <div className="p-4 pb-20">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            {!imageUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label 
                  htmlFor="image-upload" 
                  className="cursor-pointer block"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500">Carregando imagem...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <i className="ri-image-add-line text-4xl text-gray-400 mb-2"></i>
                      <p className="text-gray-500">Clique para adicionar uma foto</p>
                    </div>
                  )}
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Post preview"
                  className="w-full h-80 object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2"
                  onClick={() => setImageUrl("")}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <textarea
              placeholder="Escreva uma legenda..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none"
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={!imageUrl || createPostMutation.isPending}
            className={`w-full py-3 rounded-lg font-semibold ${
              !imageUrl || createPostMutation.isPending
                ? 'bg-gray-200 text-gray-500'
                : 'bg-primary text-white'
            }`}
          >
            {createPostMutation.isPending ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
