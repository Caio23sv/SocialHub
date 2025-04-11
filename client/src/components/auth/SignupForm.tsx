import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/AuthContext';
import { Loader2, Mail, Lock, User, Image } from 'lucide-react';
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
import { SignUpParams } from '@/lib/firebase';

// Schema for signup validation
const signupSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  username: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Nome de usuário deve conter apenas letras, números, pontos e underscores'),
  displayName: z.string().min(2, 'Nome completo é obrigatório'),
  photoURL: z.string().url('URL inválida').optional(),
});

export default function SignupForm() {
  const { signUpWithEmail, isLoading, error } = useAuth();
  
  const form = useForm<SignUpParams>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
      displayName: '',
      photoURL: '',
    }
  });

  const onSubmit = async (data: SignUpParams) => {
    await signUpWithEmail(data);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Criar Conta</h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para se cadastrar
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome de usuário</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="usuario123" 
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
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Seu Nome Completo" 
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
            name="photoURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da foto (opcional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Image className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="https://exemplo.com/minhafoto.jpg" 
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
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Criar conta
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Já tem uma conta?{" "}
          <a href="/login" className="text-primary hover:underline">
            Entrar
          </a>
        </p>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <p>
          Ao se cadastrar, você concorda com nossos{" "}
          <span className="underline cursor-pointer">Termos de Serviço</span> e{" "}
          <span className="underline cursor-pointer">Política de Privacidade</span>.
        </p>
      </div>
    </div>
  );
}