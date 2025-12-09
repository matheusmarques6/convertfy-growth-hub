import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgePercent, Pencil, Trash2, Loader2, Crown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import plansService, { Plan } from "@/services/plans";

const AdminPlans = () => {
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: plansService.getPlans,
  });

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return "Grátis";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency === 'BRL' ? 'BRL' : 'USD',
    }).format(price);
  };

  if (isLoading) {
    return (
      <AppLayout
        title="Planos (Admin)"
        description="Carregando planos..."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Planos (Admin)"
      description="CRUD de planos e billing."
      actions={<Button className="bg-cta text-white shadow-glow hover:opacity-90">Novo plano</Button>}
    >
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">Planos</CardTitle>
            <p className="text-sm text-muted-foreground">GET /api/plans</p>
          </div>
          <Badge className="bg-primary/20 text-primary">Admin</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-muted-foreground">Nome</TableHead>
                <TableHead className="text-muted-foreground">Preço</TableHead>
                <TableHead className="text-muted-foreground">Limites</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan: Plan) => (
                <TableRow key={plan.plan_id} className="border-white/10">
                  <TableCell className="flex items-center gap-2 text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                      <BadgePercent className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        {plan.name}
                        {plan.is_popular && (
                          <Crown className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{plan.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>{formatPrice(plan.price, plan.currency)}</div>
                    <div className="text-xs">/{plan.interval}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    <div>{plan.limits.contacts === -1 ? '∞' : plan.limits.contacts} contatos</div>
                    <div>{plan.limits.messages === -1 ? '∞' : plan.limits.messages} msgs/mês</div>
                    <div>{plan.limits.instances === -1 ? '∞' : plan.limits.instances} instâncias</div>
                  </TableCell>
                  <TableCell>
                    {plan.trial_days > 0 && (
                      <Badge className="bg-success/20 text-success text-xs">
                        {plan.trial_days}d trial
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-white/10 bg-white/5 text-white">
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" className="border border-white/10 bg-white/5 text-white">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default AdminPlans;
