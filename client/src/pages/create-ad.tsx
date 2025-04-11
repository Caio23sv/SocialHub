import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Image, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Esquema para validação do formulário
const adSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Preço deve ser um número positivo"
  }),
  imageUrl: z.string().url("URL da imagem inválida"),
  type: z.enum(["curso", "produto", "serviço", "evento", "outro"])
});

type AdFormData = z.infer<typeof adSchema>;

const CreateAd = () => {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<AdFormData>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      imageUrl: "",
      type: "produto"
    }
  });
  
  const handleBack = () => {
    setLocation("/");
  };
  
  const onSubmit = async (data: AdFormData) => {
    if (!authUser) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um anúncio",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create ad in Firebase
      const adData = {
        sellerId: authUser.id,
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
        category: data.type,
        likesCount: 0,
        commentsCount: 0,
        viewsCount: 0
      };
      
      const response = await createAd(adData);
      toast({
        title: "Anúncio criado",
        description: "Seu anúncio foi publicado com sucesso!"
      });
      setLocation("/profile");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao criar o anúncio. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="pb-20">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center">
          <button onClick={handleBack} className="text-gray-700">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold ml-4">Criar Anúncio</h2>
        </div>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do anúncio</Label>
            <Input 
              id="title" 
              placeholder="Ex: Curso de Marketing Digital" 
              {...register("title")} 
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo do anúncio</Label>
            <Select defaultValue="produto" {...register("type")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="curso">Curso</SelectItem>
                <SelectItem value="produto">Produto</SelectItem>
                <SelectItem value="serviço">Serviço</SelectItem>
                <SelectItem value="evento">Evento</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Valor (R$)</Label>
            <Input 
              id="price" 
              placeholder="0.00" 
              type="number"
              step="0.01"
              min="0"
              {...register("price")} 
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da imagem</Label>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <Input 
                  id="imageUrl" 
                  placeholder="https://example.com/image.jpg" 
                  {...register("imageUrl")} 
                />
                {errors.imageUrl && (
                  <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
                )}
              </div>
              <div className="w-16 h-16 border rounded-md flex items-center justify-center bg-gray-50">
                {control._formValues.imageUrl ? (
                  <img 
                    src={control._formValues.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Erro';
                    }}
                  />
                ) : (
                  <Image className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">Cole o endereço de uma imagem que represente seu anúncio</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              placeholder="Descreva seu anúncio em detalhes..." 
              rows={5}
              {...register("description")} 
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <span className="animate-spin mr-2">
                  <Upload className="h-4 w-4" />
                </span>
                Publicando...
              </div>
            ) : (
              "Publicar Anúncio"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateAd;