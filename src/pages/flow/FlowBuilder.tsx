import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Workflow,
  Send,
  GitBranch,
  Clock,
  Bot,
  Mail,
  Database,
  CirclePause,
  PlugZap,
  Braces,
  MessageCircle,
  BrainCircuit,
} from "lucide-react";

const nodes = [
  "SEND_MESSAGE",
  "CONDITION",
  "RESPONSE_SAVER",
  "MAKE_REQUEST",
  "DELAY",
  "SPREADSHEET",
  "EMAIL",
  "AGENT_TRANSFER",
  "AI_TRANSFER",
  "MYSQL_QUERY",
  "DISABLE_AUTOREPLY",
];

const FlowBuilder = () => {
  return (
    <AppLayout
      title="Flow Builder"
      description="Editor visual drag-and-drop com todos os tipos de nós definidos no backend."
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white">
            Versionar
          </Button>
          <Button className="bg-cta text-white shadow-glow hover:opacity-90">Publicar</Button>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="space-y-2">
            <CardTitle className="text-white">Paleta de nós</CardTitle>
            <p className="text-sm text-muted-foreground">Tipos disponíveis conforme API</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {nodes.map((node) => (
              <div key={node} className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0c0f16] px-3 py-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <Workflow className="h-4 w-4" />
                  </span>
                  {node}
                </div>
                <Badge className="bg-primary/15 text-primary">Drag</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-white">Canvas</CardTitle>
              <p className="text-sm text-muted-foreground">Arraste nós, conecte edges e salve</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary">Auto-save</Badge>
              <Badge className="bg-success/20 text-success">Conectado</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[420px] rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-[#0b0d13] to-accent/10 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                  <GitBranch className="h-4 w-4 text-primary" />
                  11 tipos de nós disponíveis
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  Último save há 3s
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <CanvasCard icon={<Send className="h-4 w-4" />} title="SEND_MESSAGE" detail="Texto, imagem, vídeo, botão, lista" />
                <CanvasCard icon={<MessageCircle className="h-4 w-4" />} title="CONDITION" detail="Segmentação, horário, origem" />
                <CanvasCard icon={<Bot className="h-4 w-4" />} title="RESPONSE_SAVER" detail="Salva respostas do usuário" />
                <CanvasCard icon={<PlugZap className="h-4 w-4" />} title="MAKE_REQUEST" detail="Chamada externa / webhook" />
                <CanvasCard icon={<Clock className="h-4 w-4" />} title="DELAY" detail="Aguarda X min/h" />
                <CanvasCard icon={<Database className="h-4 w-4" />} title="MYSQL_QUERY" detail="Consulta ou escrita" />
                <CanvasCard icon={<Mail className="h-4 w-4" />} title="EMAIL" detail="Enviar email de apoio" />
                <CanvasCard icon={<Braces className="h-4 w-4" />} title="DISABLE_AUTOREPLY" detail="Pausa auto-resposta" />
                <CanvasCard icon={<BrainCircuit className="h-4 w-4" />} title="AI_TRANSFER" detail="Escala para IA" />
                <CanvasCard icon={<CirclePause className="h-4 w-4" />} title="AGENT_TRANSFER" detail="Entrega para humano" />
              </div>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge className="bg-primary/20 text-primary">Ctrl+S salva edges</Badge>
              <Badge className="bg-primary/10 text-white">Ctrl+Click duplica nó</Badge>
              <Badge className="bg-white/5 text-muted-foreground">Autosave nodes & edges</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

const CanvasCard = ({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  </div>
);

export default FlowBuilder;
