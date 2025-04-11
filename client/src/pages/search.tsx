import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PostWithUser } from "@shared/schema";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get feed posts for the discover section
  const { data: posts, isLoading } = useQuery<PostWithUser[]>({
    queryKey: ['/api/posts'],
  });
  
  return (
    <>
      <div className="p-4 sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm"
          />
          <i className="ri-search-line absolute left-3 top-2.5 text-gray-500"></i>
          {searchTerm && (
            <button 
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={() => setSearchTerm("")}
            >
              <i className="ri-close-line"></i>
            </button>
          )}
        </div>
      </div>
      
      <div className="p-2 pb-20">
        <h2 className="text-lg font-semibold px-2 mb-2">Descubra</h2>
        
        {isLoading ? (
          // Grid loading skeleton
          <div className="grid grid-cols-3 gap-1">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="w-full aspect-square bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {posts?.map(post => (
              <div key={post.id} className="w-full aspect-square">
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
