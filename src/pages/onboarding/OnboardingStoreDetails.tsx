import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChevronLeft, LayoutGrid, ArrowRight } from "lucide-react";

const storeSchema = z.object({
  name: z.string().min(2, "Informe o nome da loja"),
  url: z.string().url("Informe uma URL válida"),
  platform: z.string().min(1, "Selecione a plataforma"),
  niche: z.string().min(2, "Informe o nicho"),
  language: z.string().min(1, "Selecione o idioma"),
  audience: z.string().min(2, "Descreva o público-alvo"),
  notes: z.string().optional(),
});

type StoreFormValues = z.infer<typeof storeSchema>;

const platformOptions = ["Shopify", "VTEX", "WooCommerce", "Nuvemshop", "Custom"];
const languageOptions = ["Português", "Inglês", "Espanhol", "Bilingue"];

const OnboardingStoreDetails = () => {
  const navigate = useNavigate();

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      url: "",
      platform: "Shopify",
      niche: "",
      language: "Português",
      audience: "",
      notes: "",
    },
  });

  const platformList = useMemo(() => platformOptions, []);
  const languageList = useMemo(() => languageOptions, []);

  const onSubmit = (values: StoreFormValues) => {
    navigate("/onboarding/stores/new/automations", { state: { store: values } });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge className="w-fit border border-primary/30 bg-primary/10 text-primary">Passo 1 de 2</Badge>
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-white">Dados da loja</h1>
              <p className="text-base text-text-body">
                Conte o básico sobre sua loja para personalizarmos integrações e automações.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:text-white"
            size="sm"
            onClick={() => navigate("/onboarding/stores")}
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para lojas
          </Button>
        </div>

        <Separator className="my-10 bg-white/5" />

        <Card className="border-white/10 bg-white/5 shadow-soft">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-white">
              <LayoutGrid className="h-5 w-5 text-primary" />
              Informações básicas
            </CardTitle>
            <p className="text-sm text-text-body">
              Use a URL oficial e escolha a plataforma para sugerirmos o conector correto.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-secondary">Nome da loja</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: TechSmart Hub" className="bg-transparent text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-secondary">URL da loja</FormLabel>
                        <FormControl>
                          <Input placeholder="https://sualoja.com" className="bg-transparent text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-secondary">Plataforma</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-transparent text-white">
                              <SelectValue placeholder="Selecione a plataforma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#0A0A0A] text-white">
                            {platformList.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="niche"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-secondary">Nicho da loja</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Eletrônicos, Moda, Beleza" className="bg-transparent text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-secondary">Idioma da loja</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-transparent text-white">
                              <SelectValue placeholder="Selecione o idioma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#0A0A0A] text-white">
                            {languageList.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-secondary">Público alvo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Jovens 18-30, PME, Mães, etc." className="bg-transparent text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-text-secondary">Algo específico que queira contar?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Operamos dropshipping, temos catálogo sazonal, usamos atendimento híbrido."
                          className="min-h-[120px] bg-transparent text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-text-secondary hover:text-white"
                    onClick={() => navigate("/onboarding/stores")}
                  >
                    Cancelar
                  </Button>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/10 text-white hover:border-primary/40"
                      onClick={() => navigate("/onboarding/stores")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Voltar
                    </Button>
                    <Button type="submit" className="bg-cta text-white shadow-medium hover:opacity-90">
                      Continuar
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingStoreDetails;
