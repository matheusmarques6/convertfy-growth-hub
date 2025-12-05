import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LineChart, Users, ShieldCheck, Cpu, Globe2 } from "lucide-react";

const AdminDashboard = () => {
  return (
    <AppLayout
      title="Admin Dashboard"
      description="Métricas globais, uso por workspace e saúde da plataforma."
      actions={<Badge className="bg-primary/20 text-primary">Super Admin</Badge>}
    >
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Workspaces", value: "184", hint: "+12 esta semana" },
          { title: "Usuários ativos", value: "12.4k", hint: "+4.2%" },
          { title: "Mensagens/dia", value: "1.2M", hint: "98.7% entrega" },
          { title: "Erros", value: "0.4%", hint: "Monitorado" },
        ].map((item) => (
          <Card key={item.title} className="border-white/10 bg-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-white">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">Saúde da plataforma</CardTitle>
            <p className="text-sm text-muted-foreground">Infra, sockets e jobs</p>
          </div>
          <Badge className="bg-success/20 text-success">Operacional</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Cpu className="h-4 w-4 text-primary" />
              Workers
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Fila de disparos & fluxos</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Globe2 className="h-4 w-4 text-primary" />
              Socket.io
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Eventos de inbox e QR</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Segurança
            </div>
            <p className="mt-2 text-xs text-muted-foreground">JWT, MFA e logs</p>
          </div>
        </CardContent>
        <Separator className="bg-white/10" />
      </Card>
    </AppLayout>
  );
};

export default AdminDashboard;
