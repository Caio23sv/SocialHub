import { Link, useLocation } from "wouter";

const BottomNavigation = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 z-30">
      <div className="flex justify-around items-center h-14">
        <Link href="/">
          <a className={`bottom-nav-item flex flex-col items-center px-3 ${location === '/' ? 'text-primary' : 'text-gray-700'}`}>
            <i className={`${location === '/' ? 'ri-home-5-fill' : 'ri-home-5-line'} text-xl`}></i>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <Link href="/search">
          <a className={`bottom-nav-item flex flex-col items-center px-3 ${location === '/search' ? 'text-primary' : 'text-gray-700'}`}>
            <i className={`${location === '/search' ? 'ri-search-fill' : 'ri-search-line'} text-xl`}></i>
            <span className="text-xs mt-1">Buscar</span>
          </a>
        </Link>
        
        <Link href="/create">
          <a className={`bottom-nav-item flex flex-col items-center px-3 ${location === '/create' ? 'text-primary' : 'text-gray-700'}`}>
            <i className={`${location === '/create' ? 'ri-add-box-fill' : 'ri-add-box-line'} text-xl`}></i>
            <span className="text-xs mt-1">Criar</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={`bottom-nav-item flex flex-col items-center px-3 ${location === '/profile' ? 'text-primary' : 'text-gray-700'}`}>
            <div className={`w-6 h-6 rounded-full overflow-hidden ${location === '/profile' ? 'ring-2 ring-primary' : ''}`}>
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs mt-1">Perfil</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
