import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BadgeCheck,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  MessageCircle,
  Users,
  Bot,
  Send,
  Zap,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useSocket } from "@/hooks/useSocket";
import { dashboardService, DashboardMetrics, PipelineInfo, PerformanceMetrics } from "@/services/dashboard";

// Dados mock para fallback quando o backend não está disponível
const mockMetrics: DashboardMetrics = {
  messagesDelivered: 128400,
  messagesDeliveredDelta: 12,
  responsesReceived: 34600,
  responsesReceivedDelta: 8,
  activeChatbots: 23,
  activeChatbotsDelta: -2,
  csatAverage: 4.82,
  csatDelta: 0.4,
};

const mockPipelines: PipelineInfo[] = [
  { id: 1, name: "Onboarding WA", progress: 82, status: "online", type: "onboarding" },
  { id: 2, name: "Recuperação de carrinho", progress: 67, status: "online", type: "recovery" },
  { id: 3, name: "Reengajamento 30d", progress: 45, status: "paused", type: "reengagement" },
];

const mockPerformance: PerformanceMetrics = {
  openRate: 78,
  openRateDelta: 6,
  avgResponseTime: "1m 42s",
  avgResponseTimeDelta: -12,
  deliveryRate: 98.2,
  deliveryRateDelta: 1.3,
  weeklyData: [42, 65, 72, 58, 90, 120, 110],
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { connected } = useSocket();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [pipelines, setPipelines] = useState<PipelineInfo[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Função para carregar dados
  const loadDashboardData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      // Tentar carregar dados reais da API
      const [metricsRes, pipelinesRes, performanceRes] = await Promise.allSettled([
        dashboardService.getMetrics(),
        dashboardService.getPipelines(),
        dashboardService.getPerformance(),
      ]);

      // Usar dados reais se disponíveis, senão usar mock
      if (metricsRes.status === "fulfilled" && metricsRes.value.success) {
        setMetrics(metricsRes.value.data!);
      } else {
        setMetrics(mockMetrics);
      }

      if (pipelinesRes.status === "fulfilled" && pipelinesRes.value.success) {
        setPipelines(pipelinesRes.value.data!);
      } else {
        setPipelines(mockPipelines);
      }

      if (performanceRes.status === "fulfilled" && performanceRes.value.success) {
        setPerformance(performanceRes.value.data!);
      } else {
        setPerformance(mockPerformance);
      }
    } catch {
      // Em caso de erro, usar dados mock
      console.log("Usando dados de demonstração");
      setMetrics(mockMetrics);
      setPipelines(mockPipelines);
      setPerformance(mockPerformance);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Carregar dados ao montar
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Formatar número grande
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // Métricas para cards
  const metricsData = metrics
    ? [
        {
          label: "Mensagens entregues",
          value: formatNumber(metrics.messagesDelivered),
          delta: `${metrics.messagesDeliveredDelta > 0 ? "+" : ""}${metrics.messagesDeliveredDelta}%`,
          positive: metrics.messagesDeliveredDelta > 0,
          icon: <Send className="h-4 w-4" />,
        },
        {
          label: "Respostas recebidas",
          value: formatNumber(metrics.responsesReceived),
          delta: `${metrics.responsesReceivedDelta > 0 ? "+" : ""}${metrics.responsesReceivedDelta}%`,
          positive: metrics.responsesReceivedDelta > 0,
          icon: <MessageCircle className="h-4 w-4" />,
        },
        {
          label: "Chatbots ativos",
          value: metrics.activeChatbots.toString(),
          delta: `${metrics.activeChatbotsDelta > 0 ? "+" : ""}${metrics.activeChatbotsDelta}%`,
          positive: metrics.activeChatbotsDelta > 0,
          icon: <Bot className="h-4 w-4" />,
        },
        {
          label: "CSAT médio",
          value: metrics.csatAverage.toFixed(2),
          delta: `${metrics.csatDelta > 0 ? "+" : ""}${metrics.csatDelta}`,
          positive: metrics.csatDelta > 0,
          icon: <Users className="h-4 w-4" />,
        },
      ]
    : [];

  return (
    <AppLayout
      title={`Olá, ${user?.name?.split(" ")[0] || "usuário"}`}
      description="Visão consolidada de mensagens, campanhas e bots em tempo real."
      actions={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${connected ? "bg-success animate-pulse" : "bg-destructive"}`}
            />
            <span className="text-xs text-muted-foreground">{connected ? "Conectado" : "Offline"}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadDashboardData(true)}
            disabled={isRefreshing}
            className="border-white/10 bg-white/5 text-white"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button
            className="bg-cta text-white shadow-glow hover:opacity-90"
            onClick={() => navigate("/broadcast")}
          >
            Nova campanha
          </Button>
        </div>
      }
    >
      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="border-white/10 bg-white/5">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24 bg-white/10" />
                    <Skeleton className="h-9 w-9 rounded-lg bg-white/10" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="mb-2 h-8 w-20 bg-white/10" />
                    <Skeleton className="h-3 w-32 bg-white/10" />
                  </CardContent>
                </Card>
              ))
          : metricsData.map((item) => (
              <Card key={item.label} className="border-white/10 bg-white/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    {item.icon}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <p
                    className={`flex items-center gap-1 text-xs ${item.positive ? "text-success" : "text-destructive"}`}
                  >
                    {item.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {item.delta} vs. última semana
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Gráfico de performance */}
        <Card className="lg:col-span-2 border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <p className="text-sm text-muted-foreground">Performance 7 dias</p>
              <CardTitle className="text-xl text-white">Mensagens e conversões</CardTitle>
            </div>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Live
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-52 rounded-xl border border-white/10 bg-gradient-to-br from-primary/10 via-[#0A0A0A] to-accent/10 p-4">
              <div className="flex h-full items-end gap-2">
                {(performance?.weeklyData || mockPerformance.weeklyData).map((height, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-primary/40 to-primary transition-all duration-300"
                    style={{ height: `${(height / 120) * 100}%`, maxHeight: "100%" }}
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-muted-foreground">Taxa de abertura</p>
                <p className="text-lg font-semibold text-white">{performance?.openRate || mockPerformance.openRate}%</p>
                <p className="text-xs text-success">
                  +{performance?.openRateDelta || mockPerformance.openRateDelta}% WoW
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-muted-foreground">Tempo médio de resposta</p>
                <p className="text-lg font-semibold text-white">
                  {performance?.avgResponseTime || mockPerformance.avgResponseTime}
                </p>
                <p className="text-xs text-success">
                  {performance?.avgResponseTimeDelta || mockPerformance.avgResponseTimeDelta}% WoW
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-muted-foreground">Delivery rate</p>
                <p className="text-lg font-semibold text-white">
                  {performance?.deliveryRate || mockPerformance.deliveryRate}%
                </p>
                <p className="text-xs text-success">
                  +{performance?.deliveryRateDelta || mockPerformance.deliveryRateDelta}% WoW
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pipelines ativos */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Pipelines ativos</CardTitle>
            <p className="text-sm text-muted-foreground">Fluxos monitorados em tempo real</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {(pipelines.length > 0 ? pipelines : mockPipelines).map((pipeline) => (
              <div key={pipeline.id} className="space-y-2 rounded-xl border border-white/10 bg-[#0c0f16] p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{pipeline.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Status:{" "}
                      <span className={pipeline.status === "online" ? "text-success" : "text-destructive"}>
                        {pipeline.status === "online" ? "Online" : "Pausado"}
                      </span>
                    </p>
                  </div>
                  <Badge variant="secondary" className="border border-primary/20 bg-primary/10 text-primary">
                    {pipeline.progress}% SLA
                  </Badge>
                </div>
                <Progress value={pipeline.progress} className="h-2 bg-white/10" />
              </div>
            ))}
            <Separator className="bg-white/5" />
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Status da API</p>
                <p className="text-xs text-muted-foreground">Respostas {"< 150ms"}</p>
              </div>
              <Badge className={connected ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}>
                {connected ? "Online" : "Offline"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha de cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Handover para agentes</CardTitle>
            <p className="text-sm text-muted-foreground">Distribuição automática por skill</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Equipe Vendas", "Suporte Premium", "Suporte Geral"].map((team) => (
              <div
                key={team}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{team}</p>
                  <p className="text-xs text-muted-foreground">SLA 2m · Round robin</p>
                </div>
                <Badge className="bg-primary/15 text-primary">Ativo</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Fluxos em destaque</CardTitle>
            <p className="text-sm text-muted-foreground">Top 3 por conversão</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Qualificação automática", lift: "+22%" },
              { name: "Agendamento com agente", lift: "+15%" },
              { name: "Recuperação Pix", lift: "+12%" },
            ].map((flow) => (
              <div
                key={flow.name}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{flow.name}</p>
                  <p className="text-xs text-muted-foreground">Conversão melhorada</p>
                </div>
                <Badge className="bg-success/20 text-success">{flow.lift}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Alertas</CardTitle>
            <p className="text-sm text-muted-foreground">Erros e filas</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <BadgeCheck className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-white">Fila de disparos</p>
                <p className="text-xs text-muted-foreground">3 campanhas aguardando aprovação</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/10 p-3">
              <Zap className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-semibold text-white">Upgrade recomendado</p>
                <p className="text-xs text-muted-foreground">Ative auto-scale para horário de pico</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
