import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgePercent, Pencil, Trash2 } from "lucide-react";

const plans = [
  { name: "Starter", price: "199", features: "1 instância WA" },
  { name: "Growth", price: "499", features: "3 instâncias + broadcast" },
  { name: "Enterprise", price: "custom", features: "SLA dedicado" },
];

const AdminPlans = () => {
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
            <p className="text-sm text-muted-foreground">GET /admin/plans</p>
          </div>
          <Badge className="bg-primary/20 text-primary">Admin</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-muted-foreground">Nome</TableHead>
                <TableHead className="text-muted-foreground">Preço</TableHead>
                <TableHead className="text-muted-foreground">Features</TableHead>
                <TableHead className="text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.name} className="border-white/10">
                  <TableCell className="flex items-center gap-2 text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                      <BadgePercent className="h-4 w-4" />
                    </span>
                    {plan.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{plan.price}</TableCell>
                  <TableCell className="text-muted-foreground">{plan.features}</TableCell>
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
