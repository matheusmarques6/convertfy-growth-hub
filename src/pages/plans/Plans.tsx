import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Crown, Rocket, ShieldCheck, Check, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import plansService, { Plan as PlanType } from "@/services/plans";
import { toast } from "sonner";
import { useState } from "react";

const Plans = () => {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  // Fetch plans from backend
  const { data: plans = [], isLoading: isLoadingPlans } = useQuery({
    queryKey: ['plans'],
    queryFn: plansService.getPlans,
  });

  // Fetch current user plan
  const { data: currentPlan } = useQuery({
    queryKey: ['current-plan'],
    queryFn: plansService.getCurrentPlan,
  });

  const handleSelectPlan = async (plan: PlanType) => {
    if (plan.plan_id === 'enterprise') {
      // TODO: Open contact sales modal
      toast.info("Entre em contato com nossa equipe de vendas para um plano Enterprise personalizado");
      return;
    }

    if (plan.plan_id === 'free') {
      toast.info("Você já pode usar o plano Free!");
      return;
    }

    try {
      setLoadingPlanId(plan.plan_id);

      // Create checkout session
      const { checkout_url } = await plansService.subscribe(plan.plan_id);

      // Redirect to Stripe checkout
      window.location.href = checkout_url;
    } catch (error: any) {
      console.error("Error subscribing to plan:", error);
      toast.error(error.response?.data?.message || "Erro ao criar sessão de pagamento");
      setLoadingPlanId(null);
    }
  };

  const formatPrice = (price: number, currency: string, interval: string) => {
    if (price === 0) return "Grátis";

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency === 'BRL' ? 'BRL' : 'USD',
    }).format(price);

    return `${formattedPrice}/${interval === 'monthly' ? 'mês' : 'ano'}`;
  };

  const isCurrentPlan = (planId: string) => {
    return currentPlan?.plan_id === planId;
  };

  if (isLoadingPlans) {
    return (
      <AppLayout
        title="Planos"
        description="Carregando planos disponíveis..."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Planos"
      description="Escolha ou faça upgrade do plano do workspace."
      actions={
        currentPlan && (
          <div className="text-sm text-muted-foreground">
            Plano atual: <span className="font-semibold text-primary">{currentPlan.plan_name}</span>
          </div>
        )
      }
    >
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {plans.map((plan) => {
          const isCurrent = isCurrentPlan(plan.plan_id);
          const isLoading = loadingPlanId === plan.plan_id;

          return (
            <Card
              key={plan.plan_id}
              className={`border-white/10 bg-white/5 ${
                plan.is_popular ? "border-primary/40 shadow-glow" : ""
              } ${isCurrent ? "border-success/40" : ""}`}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                  {plan.is_popular && (
                    <Badge className="bg-primary/20 text-primary">
                      <Crown className="mr-1 h-3.5 w-3.5" />
                      Popular
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge className="bg-success/20 text-success">
                      <Check className="mr-1 h-3.5 w-3.5" />
                      Atual
                    </Badge>
                  )}
                </div>
                <p className="text-2xl font-semibold text-white">
                  {formatPrice(plan.price, plan.currency, plan.interval)}
                </p>
                {plan.trial_days > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {plan.trial_days} dias de teste grátis
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>Contatos: {plan.limits.contacts === -1 ? 'Ilimitado' : plan.limits.contacts.toLocaleString()}</div>
                  <div>Mensagens: {plan.limits.messages === -1 ? 'Ilimitadas' : `${plan.limits.messages.toLocaleString()}/mês`}</div>
                  <div>Instâncias: {plan.limits.instances === -1 ? 'Ilimitadas' : plan.limits.instances}</div>
                </div>

                <Button
                  className="mt-2 w-full rounded-xl bg-cta text-white shadow-glow hover:opacity-90"
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : isCurrent ? (
                    "Plano Atual"
                  ) : plan.plan_id === "enterprise" ? (
                    "Contato"
                  ) : (
                    "Assinar"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
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
