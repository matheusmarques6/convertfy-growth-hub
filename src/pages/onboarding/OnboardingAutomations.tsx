import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Bot, ShoppingCart, Eye, CreditCard, ChevronLeft, ShieldCheck, Sparkles } from "lucide-react";

type StoreSummary = {
  name: string;
  url: string;
  platform: string;
  niche: string;
  language: string;
  audience: string;
  notes?: string;
};

type AutomationOption = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const automationOptions: AutomationOption[] = [
  {
    id: "abandoned_cart",
    title: "Carrinho abandonado",
    description: "Recupere vendas com lembretes em minutos após o abandono.",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    id: "product_view",
    title: "Visualizou produto",
    description: "Engaje quem demonstrou interesse, com recomendações ou cupons.",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    id: "checkout_abandoned",
    title: "Checkout abandonado",
    description: "Mensagens de follow-up para quem quase concluiu a compra.",
    icon: <CreditCard className="h-5 w-5" />,
  },
];

const OnboardingAutomations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storeData = (location.state as { store?: StoreSummary } | undefined)?.store;
  const [selected, setSelected] = useState<string[]>(["abandoned_cart", "checkout_abandoned"]);

  useEffect(() => {
    // Se acessado direto sem dados prévios, volta para o passo 1
    if (!storeData) {
      navigate("/onboarding/stores/new");
    }
  }, [storeData, navigate]);

  const toggleSelection = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleFinish = () => {
    navigate("/onboarding/stores");
  };

  const store = useMemo(() => storeData, [storeData]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge className="w-fit border border-primary/30 bg-primary/10 text-primary">Passo 2 de 2</Badge>
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-white">Automações iniciais</h1>
              <p className="text-base text-text-body">
                Escolha o que ativar agora. Você pode ajustar depois em Templates ou Flow Builder.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:text-white"
            size="sm"
            onClick={() => navigate("/onboarding/stores/new")}
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para dados da loja
          </Button>
        </div>

        <Separator className="my-10 bg-white/5" />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-white/10 bg-white/5 shadow-soft">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-white">
                <Bot className="h-5 w-5 text-primary" />
                Selecione as automações
              </CardTitle>
              <p className="text-sm text-text-body">
                Recomendamos começar com carrinho/checkout e ativar produto visto para aumentar LTV.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {automationOptions.map((option) => {
                const isSelected = selected.includes(option.id);
                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => toggleSelection(option.id)}
                    className={cn(
                      "flex h-full flex-col gap-3 rounded-2xl border p-4 text-left transition-smooth",
                      "hover:border-primary/50 hover:shadow-medium",
                      isSelected ? "border-primary/60 bg-primary/10 shadow-soft" : "border-white/10 bg-white/5",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                          {option.icon}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">{option.title}</p>
                          <p className="text-sm text-text-body">{option.description}</p>
                        </div>
                      </div>
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleSelection(option.id)} />
                    </div>
                    {option.id === "checkout_abandoned" && (
                      <p className="text-xs text-success flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Alta conversão: confirme pagamento e ofereça suporte proativo.
                      </p>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 shadow-soft">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="flex items-center gap-3 text-lg text-white">
                <Sparkles className="h-5 w-5 text-primary" />
                Resumo rápido
              </CardTitle>
              <p className="text-sm text-text-body">Confirme os dados antes de concluir.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Loja</p>
                <p className="text-base text-white">{store?.name || "Nome não informado"}</p>
                <p className="text-sm text-text-secondary">{store?.url}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-text-body">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Plataforma</p>
                  <p className="text-white">{store?.platform}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Idioma</p>
                  <p className="text-white">{store?.language}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Nicho</p>
                  <p className="text-white">{store?.niche}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Público alvo</p>
                  <p className="text-white">{store?.audience}</p>
                </div>
              </div>
              {store?.notes && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="text-sm text-text-body">{store.notes}</p>
                </div>
              )}
              <Separator className="bg-white/5" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Automações selecionadas</p>
                <div className="flex flex-wrap gap-2">
                  {selected.map((id) => {
                    const option = automationOptions.find((item) => item.id === id);
                    return (
                      <Badge
                        key={id}
                        className="border border-primary/30 bg-primary/10 text-primary"
                        variant="secondary"
                      >
                        {option?.title}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div className="pt-2 space-y-2 text-xs text-muted-foreground">
                <p>Você pode ajustar templates e fluxos depois em Chatbots e Templates.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            className="border-white/10 text-white hover:border-primary/40"
            onClick={() => navigate("/onboarding/stores/new")}
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-text-secondary hover:text-white" onClick={() => navigate("/onboarding/stores")}>
              Configurar depois
            </Button>
            <Button className="bg-cta text-white shadow-medium hover:opacity-90" onClick={handleFinish}>
              Concluir onboarding
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingAutomations;
