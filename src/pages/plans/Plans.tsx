import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Crown, Rocket, ShieldCheck } from "lucide-react";

const plans = [
  { name: "Starter", price: "R$ 199/mês", features: ["1 instância WA", "Templates ilimitados", "Fluxos básicos"] },
  { name: "Growth", price: "R$ 499/mês", features: ["3 instâncias WA", "Flow builder completo", "Broadcast avançado"], popular: true },
  { name: "Enterprise", price: "Sob consulta", features: ["Instâncias ilimitadas", "SLA dedicado", "Suporte 24/7"] },
];

const Plans = () => {
  return (
    <AppLayout
      title="Planos"
      description="Escolha ou faça upgrade do plano do workspace."
      actions={<Button className="bg-cta text-white shadow-glow hover:opacity-90">Falar com vendas</Button>}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={`border-white/10 bg-white/5 ${plan.popular ? "border-primary/40 shadow-glow" : ""}`}>
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{plan.name}</CardTitle>
                {plan.popular && (
                  <Badge className="bg-primary/20 text-primary">
                    <Crown className="mr-1 h-3.5 w-3.5" />
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-semibold text-white">{plan.price}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  {feature}
                </div>
              ))}
              <Button className="mt-2 w-full rounded-xl bg-cta text-white shadow-glow hover:opacity-90">
                {plan.name === "Enterprise" ? "Contato" : "Assinar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Benefícios</CardTitle>
          <p className="text-sm text-muted-foreground">Recursos chave por camada</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Rocket className="h-4 w-4 text-primary" />
              Escala
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Auto-scale em horários de pico</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Crown className="h-4 w-4 text-primary" />
              SLA
            </div>
            <p className="mt-2 text-xs text-muted-foreground">99.9% uptime com monitoramento</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Segurança
            </div>
            <p className="mt-2 text-xs text-muted-foreground">MFA, criptografia e logs</p>
          </div>
        </CardContent>
        <Separator className="bg-white/10" />
      </Card>
    </AppLayout>
  );
};

export default Plans;
