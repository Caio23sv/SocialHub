import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import blkLogo from '@/assets/blk-logo.png';

export default function Welcome() {
  const [, navigate] = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState('pt-BR');
  
  const languages = [
    { code: 'pt-BR', name: 'Português (Brasil)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Español' }
  ];
  
  const handleContinue = () => {
    // Save selected language to localStorage
    localStorage.setItem('language', selectedLanguage);
    // Navigate to login page
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="mb-8">
          <div className="h-32 w-32 mx-auto mb-6 flex items-center justify-center">
            <img 
              src={blkLogo} 
              alt="BLK Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-indigo-600 to-red-500 bg-clip-text text-transparent">
            Bem-vindo ao BLK
          </h1>
          <p className="text-muted-foreground mt-2">
            Selecione seu idioma para continuar
          </p>
        </div>
        
        <div className="space-y-3">
          {languages.map((lang) => (
            <div 
              key={lang.code} 
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                selectedLanguage === lang.code 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedLanguage(lang.code)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${
                  selectedLanguage === lang.code 
                    ? 'bg-primary' 
                    : 'border border-muted-foreground'
                }`}></div>
                <span>{lang.name}</span>
              </div>
            </div>
          ))}
        </div>
        
        <Button className="w-full mt-8 bg-gradient-to-r from-blue-500 via-indigo-600 to-red-500 hover:from-blue-600 hover:via-indigo-700 hover:to-red-600" onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}