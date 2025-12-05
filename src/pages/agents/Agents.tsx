import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, ShieldCheck, PhoneCall, Clock3 } from "lucide-react";

const agents = [
  { name: "Maria Costa", role: "Admin", online: true, chats: 12, sla: "1m 20s" },
  { name: "João Pereira", role: "Agente", online: false, chats: 4, sla: "2m 10s" },
  { name: "Ana Silva", role: "Agente", online: true, chats: 7, sla: "1m 45s" },
];

const Agents = () => {
  return (
    <AppLayout
      title="Agentes"
      description="Gerencie operadores, filas e handover."
      actions={<Button className="bg-cta text-white shadow-glow hover:opacity-90">Adicionar agente</Button>}
    >
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">Equipe</CardTitle>
            <p className="text-sm text-muted-foreground">GET /get-agents</p>
          </div>
          <Badge className="bg-primary/20 text-primary">Round robin</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/20 text-primary">{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-white">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
                <Badge className={agent.online ? "bg-success/20 text-success" : "bg-white/10 text-muted-foreground"}>
                  {agent.online ? "Online" : "Offline"}
                </Badge>
              </div>
              <Separator className="my-3 bg-white/10" />
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <PhoneCall className="h-4 w-4 text-primary" />
                Chats ativos: {agent.chats}
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <Clock3 className="h-4 w-4 text-primary" />
                SLA médio: {agent.sla}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Regras de roteamento</CardTitle>
          <p className="text-sm text-muted-foreground">POST /assign-chat · /transfer-chat</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Round robin", detail: "Distribui igualmente" },
            { title: "Skill based", detail: "Filas por tag" },
            { title: "Handover bot → agente", detail: "Se score < 60%" },
          ].map((rule) => (
            <div key={rule.title} className="rounded-xl border border-white/10 bg-[#0c0f16] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {rule.title}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{rule.detail}</p>
            </div>
          ))}
        </CardContent>
        <Separator className="bg-white/10" />
      </Card>
    </AppLayout>
  );
};

export default Agents;
