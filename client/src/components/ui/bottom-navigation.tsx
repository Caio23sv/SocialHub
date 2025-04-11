import { useLocation } from "wouter";
import { Home, Search, PlusSquare, User } from "lucide-react";

const BottomNavigation = () => {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 z-30">
      <div className="flex justify-around items-center h-14">
        <div 
          onClick={() => navigate("/")}
          className={`bottom-nav-item flex flex-col items-center px-3 cursor-pointer ${location === '/' ? 'text-primary' : 'text-gray-700'}`}
        >
          <Home className={`w-5 h-5 ${location === '/' ? 'fill-primary' : ''}`} />
          <span className="text-xs mt-1">Home</span>
        </div>
        
        <div 
          onClick={() => navigate("/search")}
          className={`bottom-nav-item flex flex-col items-center px-3 cursor-pointer ${location === '/search' ? 'text-primary' : 'text-gray-700'}`}
        >
          <Search className="w-5 h-5" />
          <span className="text-xs mt-1">Buscar</span>
        </div>
        
        <div 
          onClick={() => navigate("/create")}
          className={`bottom-nav-item flex flex-col items-center px-3 cursor-pointer ${location === '/create' ? 'text-primary' : 'text-gray-700'}`}
        >
          <PlusSquare className={`w-5 h-5 ${location === '/create' ? 'fill-primary' : ''}`} />
          <span className="text-xs mt-1">Criar</span>
        </div>
        
        <div 
          onClick={() => navigate("/profile")}
          className={`bottom-nav-item flex flex-col items-center px-3 cursor-pointer ${location === '/profile' ? 'text-primary' : 'text-gray-700'}`}
        >
          <div className={`w-6 h-6 rounded-full overflow-hidden ${location === '/profile' ? 'ring-2 ring-primary' : ''}`}>
            <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs mt-1">Perfil</span>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
