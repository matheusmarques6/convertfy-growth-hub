import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  CircleDot,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCcw,
  Play,
  Pause,
  Download,
  ArrowLeft,
  Send,
  Clock,
} from "lucide-react";
import { broadcastService, CampaignData, CampaignLog } from "@/services/broadcast";
import { useToast } from "@/hooks/use-toast";

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Data states
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [logs, setLogs] = useState<CampaignLog[]>([]);
  const [stats, setStats] = useState({
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    pending: 0,
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch data
  const fetchData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);

      // Try beta API first
      const response = await broadcastService.getCampaignWithStats(id);

      if (response.success) {
        setCampaign(response.campaign);
        setLogs(response.logs || []);

        // Calculate stats from logs
        const statsFromLogs = response.logs?.reduce(
          (acc, log) => {
            const status = log.delivery_status?.toLowerCase();
            if (status === "sent") acc.sent++;
            else if (status === "delivered") acc.delivered++;
            else if (status === "read") acc.read++;
            else if (status === "failed") acc.failed++;
            else acc.pending++;
            return acc;
          },
          { sent: 0, delivered: 0, read: 0, failed: 0, pending: 0 }
        ) || stats;

        setStats(statsFromLogs);
      } else {
        // Fallback to old API
        const detailsRes = await broadcastService.getCampaignDetails(id);
        if (detailsRes.success) {
          setCampaign(detailsRes.campaign);
          setLogs(detailsRes.logs || []);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar campanha:", error);
      toast({ title: "Erro ao carregar campanha", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Change status
  const handleChangeStatus = async (newStatus: string) => {
    if (!campaign) return;

    const campaignId = campaign.campaign_id || campaign.broadcast_id;
    if (!campaignId) return;

    try {
      setIsChangingStatus(true);
      const response = await broadcastService.changeCampaignStatus(campaignId, newStatus);

      if (response.success) {
        toast({ title: `Status alterado para ${newStatus}` });
        fetchData();
      }
    } catch (error) {
      toast({ title: "Erro ao alterar status", variant: "destructive" });
    } finally {
      setIsChangingStatus(false);
    }
  };

  // Export CSV
  const handleExportCSV = async () => {
    if (!id) return;

    try {
      setIsExporting(true);
      const blob = await broadcastService.exportCampaignCSV(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `campanha-${id}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "CSV exportado com sucesso!" });
    } catch (error) {
      toast({ title: "Erro ao exportar CSV", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate progress
  const getProgress = () => {
    if (!campaign) return 0;
    const total = campaign.total_contacts || 0;
    const sent = campaign.sent_count || stats.sent + stats.delivered + stats.read;
    if (total === 0) return 0;
    return Math.round((sent / total) * 100);
  };

  // Get delivery rate
  const getDeliveryRate = () => {
    const sent = campaign?.sent_count || stats.sent || 0;
    const delivered = campaign?.delivered_count || stats.delivered || 0;
    if (sent === 0) return "0%";
    return `${Math.round((delivered / sent) * 100)}%`;
  };

  // Get open rate
  const getOpenRate = () => {
    const delivered = campaign?.delivered_count || stats.delivered || 0;
    const read = campaign?.read_count || stats.read || 0;
    if (delivered === 0) return "0%";
    return `${Math.round((read / delivered) * 100)}%`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "RUNNING":
      case "QUEUE":
        return (
          <Badge className="bg-success/20 text-success">
            <Play className="mr-1 h-3 w-3" />
            {status === "RUNNING" ? "Executando" : "Na fila"}
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge className="bg-primary/20 text-primary">
            <Pause className="mr-1 h-3 w-3" />
            Pausada
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-white/10 text-white">
            <CheckCircle className="mr-1 h-3 w-3" />
            Finalizada
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted/20 text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {status || "Pendente"}
          </Badge>
        );
    }
  };

  // Get log status icon
  const getLogStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-success/20 px-3 py-1 text-xs text-success">
            <CircleDot className="h-4 w-4" />
            Entregue
          </span>
        );
      case "read":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
            <CheckCircle className="h-4 w-4" />
            Lido
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-destructive/20 px-3 py-1 text-xs text-destructive">
            <AlertCircle className="h-4 w-4" />
            Falhou
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
            <Send className="h-4 w-4" />
            Enviado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-muted/20 px-3 py-1 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            Pendente
          </span>
        );
    }
  };

  // Parse contact JSON
  const parseContact = (contactStr: string | undefined) => {
    if (!contactStr) return null;
    try {
      return JSON.parse(contactStr);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout title="Carregando..." description="">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!campaign) {
    return (
      <AppLayout title="Campanha nao encontrada" description="">
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-muted-foreground mb-4">
            A campanha solicitada nao foi encontrada.
          </p>
          <Button onClick={() => navigate("/broadcast")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={campaign.title}
      description="Visao de entrega, aberturas e erros por contato."
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/broadcast")}
            className="border-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={isLoading}
            className="border-white/10"
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          {(campaign.status === "PENDING" || campaign.status === "PAUSED") && (
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 text-white"
              onClick={() => handleChangeStatus("QUEUE")}
              disabled={isChangingStatus}
            >
              {isChangingStatus ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Iniciar
            </Button>
          )}
          {(campaign.status === "RUNNING" || campaign.status === "QUEUE") && (
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 text-white"
              onClick={() => handleChangeStatus("PAUSED")}
              disabled={isChangingStatus}
            >
              {isChangingStatus ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Pause className="mr-2 h-4 w-4" />
              )}
              Pausar
            </Button>
          )}
          <Button
            className="bg-cta text-white shadow-glow hover:opacity-90"
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Exportar CSV
          </Button>
        </div>
      }
    >
      {/* Summary Card */}
      <Card className="border-white/10 bg-white/5 mb-6">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">Resumo</CardTitle>
            <p className="text-sm text-muted-foreground">
              Template: {campaign.template_name || "-"}
            </p>
          </div>
          {getStatusBadge(campaign.status)}
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-[#0c0f16] p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-semibold text-white">
              {campaign.total_contacts?.toLocaleString() || 0}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0c0f16] p-4">
            <p className="text-sm text-muted-foreground">Enviadas</p>
            <p className="text-xl font-semibold text-white">
              {(campaign.sent_count || stats.sent)?.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0c0f16] p-4">
            <p className="text-sm text-muted-foreground">Entregues</p>
            <p className="text-xl font-semibold text-white">
              {(campaign.delivered_count || stats.delivered)?.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0c0f16] p-4">
            <p className="text-sm text-muted-foreground">Lidas</p>
            <p className="text-xl font-semibold text-white">
              {(campaign.read_count || stats.read)?.toLocaleString()}
            </p>
          </div>
          <div className="col-span-full">
            <Progress value={getProgress()} className="h-2 bg-white/10" />
            <p className="mt-2 text-xs text-muted-foreground">{getProgress()}% concluida</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <BarChart3 className="h-4 w-4 text-primary" />
              Taxa de Entrega
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{getDeliveryRate()}</p>
            <p className="text-xs text-muted-foreground">delivery rate</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CircleDot className="h-4 w-4 text-primary" />
              Taxa de Abertura
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{getOpenRate()}</p>
            <p className="text-xs text-muted-foreground">open rate</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Falhas
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              {(campaign.failed_count || stats.failed)?.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">mensagens com erro</p>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">Logs por contato</CardTitle>
            <p className="text-sm text-muted-foreground">{logs.length} registro(s)</p>
          </div>
          <Badge className="bg-primary/20 text-primary">Tempo real</Badge>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Sem logs ainda</h3>
              <p className="text-sm text-muted-foreground">
                Os logs aparecerao conforme as mensagens forem enviadas
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-muted-foreground">Contato</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Detalhe</TableHead>
                  <TableHead className="text-muted-foreground">Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.slice(0, 100).map((log, index) => {
                  const contact = parseContact(log.contact);
                  return (
                    <TableRow key={log.id || index} className="border-white/10">
                      <TableCell>
                        <div>
                          <p className="text-white">
                            {contact?.name || log.contact_name || "-"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.send_to || log.contact_mobile || "-"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getLogStatusIcon(log.delivery_status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.error_message || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleTimeString("pt-BR")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default CampaignDetail;
