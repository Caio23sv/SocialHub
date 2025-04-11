import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/AuthContext';
import { FaGoogle } from 'react-icons/fa';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { SignInParams } from '@/lib/firebase';

// Schema for login validation
const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

export default function LoginForm() {
  const { signInWithEmail, signInWithGoogle, isLoading, error } = useAuth();
  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);

  const form = useForm<SignInParams>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: SignInParams) => {
    await signInWithEmail(data);
  };

  const handleGoogleSignIn = async () => {
    setIsSigningInWithGoogle(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSigningInWithGoogle(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Bem-vindo</h1>
        <p className="text-muted-foreground">
          Entre com sua conta para continuar
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/15 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="seu@email.com" 
                      className="pl-8" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="******" 
                      className="pl-8" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading && !isSigningInWithGoogle ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Entrar
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
        </div>
      </div>

      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2"
        variant="outline"
      >
        {isSigningInWithGoogle ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FaGoogle className="h-4 w-4" />
        )}
        Google
      </Button>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Não tem uma conta?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <p>
          Ao entrar, você concorda com nossos{" "}
          <span className="underline cursor-pointer">Termos de Serviço</span> e{" "}
          <span className="underline cursor-pointer">Política de Privacidade</span>.
        </p>
      </div>
    </div>
  );
}