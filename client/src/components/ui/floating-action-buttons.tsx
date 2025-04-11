import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, X, Edit, ShoppingBag } from "lucide-react";

const FloatingActionButtons = () => {
  const [, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleCreatePost = () => {
    navigate("/create");
    setIsOpen(false);
  };
  
  const handleCreateAd = () => {
    navigate("/create-ad");
    setIsOpen(false);
  };
  
  return (
    <div className="fixed bottom-20 right-4 z-20 flex flex-col items-end space-y-2">
      {isOpen && (
        <>
          <button
            onClick={handleCreatePost}
            className="bg-blue-500 text-white rounded-full shadow-lg w-12 h-12 flex items-center justify-center transform transition-all duration-200 hover:scale-105"
          >
            <Edit className="h-5 w-5" />
            <span className="absolute right-16 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Criar post
            </span>
          </button>
          
          <button
            onClick={handleCreateAd}
            className="bg-purple-500 text-white rounded-full shadow-lg w-12 h-12 flex items-center justify-center transform transition-all duration-200 hover:scale-105"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute right-16 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Criar anúncio
            </span>
          </button>
        </>
      )}
      
      <button
        onClick={toggleMenu}
        className={`${
          isOpen ? 'bg-red-500 rotate-45' : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-red-500'
        } text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center transform transition-all duration-200`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default FloatingActionButtons;