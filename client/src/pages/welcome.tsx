import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Globe } from 'lucide-react';

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
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Bem-vindo</h1>
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
        
        <Button className="w-full mt-8" onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}