import React from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Megaphone,
  ShoppingBag,
  UserPlus,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();

  if (!isOpen) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuSections = [
    {
      title: 'Conta',
      items: [
        { icon: <User size={20} />, label: 'Informações pessoais', onClick: () => {}, },
        { icon: <Bell size={20} />, label: 'Notificações', onClick: () => {}, },
        { icon: <Shield size={20} />, label: 'Privacidade e segurança', onClick: () => {}, },
      ]
    },
    {
      title: 'Rede Social',
      items: [
        { icon: <UserPlus size={20} />, label: 'Convidar amigos', onClick: () => {}, },
        { icon: <User size={20} />, label: 'Encontrar pessoas', onClick: () => {}, },
      ]
    },
    {
      title: 'Marketing',
      items: [
        { icon: <Megaphone size={20} />, label: 'Promoções', onClick: () => {}, },
        { icon: <ShoppingBag size={20} />, label: 'Marketplace', onClick: () => {}, },
        { icon: <DollarSign size={20} />, label: 'Programa de afiliados', onClick: () => {}, },
      ]
    },
    {
      title: 'Pagamentos',
      items: [
        { icon: <CreditCard size={20} />, label: 'Métodos de pagamento', onClick: () => {}, },
        { icon: <ShoppingBag size={20} />, label: 'Histórico de compras', onClick: () => {}, },
      ]
    },
    {
      title: 'Ajuda',
      items: [
        { icon: <HelpCircle size={20} />, label: 'Central de ajuda', onClick: () => {}, },
        { icon: <LogOut size={20} />, label: 'Sair', onClick: handleSignOut, className: 'text-red-500' },
      ]
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex" onClick={onClose}>
      <div 
        className="w-3/4 max-w-xs h-full bg-white transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Configurações</h2>
          <button onClick={onClose} className="text-gray-500">
            &times;
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {menuSections.map((section, index) => (
            <div key={index} className="px-4 py-2">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">{section.title}</h3>
              {section.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  className={`flex items-center justify-between py-3 cursor-pointer ${item.className || ''}`}
                  onClick={item.onClick}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;