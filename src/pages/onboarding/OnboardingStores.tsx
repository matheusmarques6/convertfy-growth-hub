import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Store, Globe2, ShoppingBag, Link2, Plus } from "lucide-react";

type StoreInfo = {
  id: string;
  name: string;
  url: string;
  platform: string;
  niche: string;
  language: string;
  audience: string;
  automations: string[];
};

const mockStores: StoreInfo[] = [
  {
    id: "1",
    name: "Urban Outfit Pro",
    url: "https://urbanoutfit.pro",
    platform: "Shopify",
    niche: "Streetwear",
    language: "Português",
    audience: "Jovens 18-30",
    automations: ["Carrinho abandonado", "Checkout abandonado"],
  },
  {
    id: "2",
    name: "TechSmart Hub",
    url: "https://techsmart.io",
    platform: "VTEX",
    niche: "Eletrônicos",
    language: "Inglês/ES",
    audience: "Compradores de gadgets",
    automations: ["Visualizou produto"],
  },
];

const OnboardingStores = () => {
  const navigate = useNavigate();

  // Ajuste para [] quando os dados reais forem carregados
  const stores = useMemo<StoreInfo[]>(() => mockStores, []);
  const hasStores = stores.length > 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge className="w-fit border border-primary/30 bg-primary/10 text-primary">Onboarding</Badge>
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold text-white">Minhas lojas</h1>
              <p className="text-base text-text-body">
                Vincule suas lojas para ativar automações e campanhas. Você pode adicionar quantas lojas precisar.
              </p>
            </div>
          </div>

          {hasStores && (
            <Button
              size="lg"
              className="bg-cta text-white shadow-medium hover:opacity-90"
              onClick={() => navigate("/onboarding/stores/new")}
            >
              <Plus className="h-4 w-4" />
              Adicionar nova loja
            </Button>
          )}
        </div>

        <Separator className="my-10 bg-white/5" />

        {hasStores ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {stores.map((store) => (
              <Card
                key={store.id}
                className="border-white/10 bg-white/5 hover:border-primary/40 hover:shadow-medium transition-smooth"
              >
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl text-white">{store.name}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                      <span className="inline-flex items-center gap-1">
                        <Link2 className="h-4 w-4 text-primary" />
                        {store.url}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Globe2 className="h-4 w-4 text-primary" />
                        {store.language}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                        {store.niche}
                      </span>
                    </div>
                  </div>
                  <Badge className="border border-primary/30 bg-primary/10 text-primary">{store.platform}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Público-alvo</p>
                    <p className="text-base text-text-body">{store.audience}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Automações ativas</p>
                    <div className="flex flex-wrap gap-2">
                      {store.automations.map((automation) => (
                        <Badge
                          key={automation}
                          className="border border-primary/30 bg-primary/10 text-primary"
                          variant="secondary"
                        >
                          {automation}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="border-white/10 text-white hover:border-primary/40">
                      Gerenciar loja
                    </Button>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-white">
                      Ver automações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-white/10 bg-white/5 px-8 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-soft">
              <Store className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">Nenhuma loja vinculada</h2>
              <p className="max-w-xl text-text-body">
                Adicione sua primeira loja para começar a recuperar carrinhos, enviar campanhas e automatizar mensagens.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Button
                size="lg"
                className="bg-cta text-white shadow-medium hover:opacity-90"
                onClick={() => navigate("/onboarding/stores/new")}
              >
                <Plus className="h-4 w-4" />
                Adicionar nova loja
              </Button>
              <ScrollArea className="max-h-10">
                <button className="text-sm font-semibold text-primary hover:underline">Precisa de ajuda para conectar?</button>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingStores;
