import React from 'react';
import SignupForm from '@/components/auth/SignupForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function Signup() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-4 px-4 flex items-center border-b">
        <div className="inline-flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
             onClick={() => window.history.back()}>
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Voltar</span>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <SignupForm />
      </main>
    </div>
  );
}