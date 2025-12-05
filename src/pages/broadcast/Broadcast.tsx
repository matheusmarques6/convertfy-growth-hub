import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Megaphone,
  Play,
  Pause,
  Send,
  Users,
  RefreshCcw,
  Plus,
  Loader2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { broadcastService, CampaignData, DashboardStats } from "@/services/broadcast";
import { templateService, MetaTemplate } from "@/services/templates";
import { contactService, PhonebookData } from "@/services/contacts";
import { useToast } from "@/hooks/use-toast";

const Broadcast = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Data states
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [templates, setTemplates] = useState<MetaTemplate[]>([]);
  const [phonebooks, setPhonebooks] = useState<PhonebookData[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignData | null>(null);

  // Form states
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    templateName: "",
    templateLanguage: "pt_BR",
    phonebookId: "",
    schedule: "",
  });

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [campaignsRes, templatesRes, phonebooksRes, dashboardRes] = await Promise.all([
        broadcastService.getCampaigns(),
        templateService.getMetaTemplates(),
        contactService.getPhonebooks(),
        broadcastService.getDashboardStats().catch(() => null),
      ]);

      if (campaignsRes.success && campaignsRes.data) {
        setCampaigns(campaignsRes.data);
      }

      if (templatesRes.success && templatesRes.data) {
        setTemplates(templatesRes.data.filter((t) => t.status === "APPROVED"));
      }

      if (phonebooksRes.success && phonebooksRes.data) {
        setPhonebooks(phonebooksRes.data);
      }

      if (dashboardRes && dashboardRes.success) {
        setDashboardStats(dashboardRes);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create campaign
  const handleCreateCampaign = async () => {
    if (!newCampaign.title || !newCampaign.templateName || !newCampaign.phonebookId) {
      toast({ title: "Preencha todos os campos obrigatorios", variant: "destructive" });
      return;
    }

    try {
      setIsCreating(true);
      const response = await broadcastService.createCampaign({
        campaign_title: newCampaign.title,
        template_name: newCampaign.templateName,
        template_language: newCampaign.templateLanguage,
        phonebook_id: parseInt(newCampaign.phonebookId),
        schedule: newCampaign.schedule || null,
      });

      if (response.success) {
        toast({ title: "Campanha criada com sucesso!" });
        setShowCreateModal(false);
        setNewCampaign({
          title: "",
          templateName: "",
          templateLanguage: "pt_BR",
          phonebookId: "",
          schedule: "",
        });
        fetchData();
      } else {
        toast({ title: "Erro", description: response.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro ao criar campanha", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  // Change campaign status
  const handleChangeStatus = async (campaign: CampaignData, newStatus: string) => {
    const campaignId = campaign.campaign_id || campaign.broadcast_id;
    if (!campaignId) return;

    try {
      setIsChangingStatus(campaignId);
      const response = await broadcastService.changeCampaignStatus(campaignId, newStatus);

      if (response.success) {
        toast({ title: `Status alterado para ${newStatus}` });
        fetchData();
      }
    } catch (error) {
      toast({ title: "Erro ao alterar status", variant: "destructive" });
    } finally {
      setIsChangingStatus(null);
    }
  };

  // Delete campaign
  const handleDelete = async () => {
    if (!selectedCampaign) return;

    const campaignId = selectedCampaign.campaign_id || selectedCampaign.broadcast_id;
    if (!campaignId) return;

    try {
      const response = await broadcastService.deleteCampaign(campaignId);

      if (response.success) {
        toast({ title: "Campanha removida" });
        setShowDeleteDialog(false);
        setSelectedCampaign(null);
        fetchData();
      }
    } catch (error) {
      toast({ title: "Erro ao remover campanha", variant: "destructive" });
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RUNNING":
      case "QUEUE":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-success/20 px-3 py-1 text-xs text-success">
            <Play className="h-3 w-3" />
            {status === "RUNNING" ? "Executando" : "Na fila"}
          </span>
        );
      case "PAUSED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
            <Pause className="h-3 w-3" />
            Pausada
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
            <CheckCircle2 className="h-3 w-3" />
            Finalizada
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-destructive/20 px-3 py-1 text-xs text-destructive">
            <XCircle className="h-3 w-3" />
            Cancelada
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-muted/20 px-3 py-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Pendente
          </span>
        );
    }
  };

  // Calculate progress
  const getProgress = (campaign: CampaignData) => {
    const total = campaign.total_contacts || 0;
    const sent = campaign.sent_count || 0;
    if (total === 0) return 0;
    return Math.round((sent / total) * 100);
  };

  // Calculate open rate
  const getOpenRate = (campaign: CampaignData) => {
    const delivered = campaign.delivered_count || 0;
    const read = campaign.read_count || 0;
    if (delivered === 0) return "0%";
    return `${Math.round((read / delivered) * 100)}%`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppLayout
      title="Broadcast"
      description="Dispare campanhas em massa com templates aprovados e logs de envio."
      actions={
        <div className="flex items-center gap-3">
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
          <Button
            className="bg-cta text-white shadow-glow hover:opacity-90"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova campanha
          </Button>
        </div>
      }
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <Megaphone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Campanhas</p>
                <p className="text-xl font-semibold text-white">
                  {dashboardStats?.totalCampaigns || campaigns.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-success/30 bg-success/10 text-success">
                <Send className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Enviadas</p>
                <p className="text-xl font-semibold text-white">
                  {dashboardStats?.messageStats?.sent?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Entregues</p>
                <p className="text-xl font-semibold text-white">
                  {dashboardStats?.messageStats?.delivered?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-white/10 text-white">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Templates</p>
                <p className="text-xl font-semibold text-white">{templates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">Campanhas</CardTitle>
            <p className="text-sm text-muted-foreground">
              {campaigns.length} campanha(s) cadastrada(s)
            </p>
          </div>
          <Badge className="bg-primary/20 text-primary">Meta templates</Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhuma campanha</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crie sua primeira campanha de broadcast
              </p>
              <Button className="bg-cta text-white" onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova campanha
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-muted-foreground">Campanha</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Contatos</TableHead>
                  <TableHead className="text-muted-foreground">Enviadas</TableHead>
                  <TableHead className="text-muted-foreground">Abertura</TableHead>
                  <TableHead className="text-muted-foreground">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const campaignId = campaign.campaign_id || campaign.broadcast_id || "";
                  return (
                    <TableRow key={campaign.id} className="border-white/10">
                      <TableCell>
                        <div>
                          <p className="font-semibold text-white">{campaign.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {campaign.template_name || campaign.templet || "-"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {campaign.total_contacts?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {campaign.sent_count?.toLocaleString() || 0}
                        <span className="text-xs ml-1">({getProgress(campaign)}%)</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {getOpenRate(campaign)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 bg-white/5 text-white"
                            onClick={() => navigate(`/broadcast/${campaignId}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </Button>
                          {(campaign.status === "PENDING" || campaign.status === "PAUSED") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="border border-white/10 bg-white/5 text-white"
                              onClick={() => handleChangeStatus(campaign, "QUEUE")}
                              disabled={isChangingStatus === campaignId}
                            >
                              {isChangingStatus === campaignId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          {(campaign.status === "RUNNING" || campaign.status === "QUEUE") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="border border-white/10 bg-white/5 text-white"
                              onClick={() => handleChangeStatus(campaign, "PAUSED")}
                              disabled={isChangingStatus === campaignId}
                            >
                              {isChangingStatus === campaignId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Pause className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal: Criar Campanha */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle className="text-white">Nova Campanha</DialogTitle>
            <DialogDescription>
              Configure uma nova campanha de broadcast
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Titulo da campanha *</Label>
              <Input
                placeholder="Ex: Lancamento Novembro"
                value={newCampaign.title}
                onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                className="border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Template *</Label>
              <Select
                value={newCampaign.templateName}
                onValueChange={(v) => setNewCampaign({ ...newCampaign, templateName: v })}
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Selecione um template aprovado" />
                </SelectTrigger>
                <SelectContent>
                  {templates.length === 0 ? (
                    <SelectItem value="" disabled>
                      Nenhum template aprovado
                    </SelectItem>
                  ) : (
                    templates.map((template) => (
                      <SelectItem key={template.id} value={template.name}>
                        {template.name} ({template.language})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {templates.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Configure as credenciais Meta API para sincronizar templates
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white">Lista de contatos *</Label>
              <Select
                value={newCampaign.phonebookId}
                onValueChange={(v) => setNewCampaign({ ...newCampaign, phonebookId: v })}
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Selecione uma lista" />
                </SelectTrigger>
                <SelectContent>
                  {phonebooks.length === 0 ? (
                    <SelectItem value="" disabled>
                      Nenhuma lista de contatos
                    </SelectItem>
                  ) : (
                    phonebooks.map((pb) => (
                      <SelectItem key={pb.id} value={pb.id.toString()}>
                        {pb.name} ({pb.contactCount || 0} contatos)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Agendar envio (opcional)</Label>
              <Input
                type="datetime-local"
                value={newCampaign.schedule}
                onChange={(e) => setNewCampaign({ ...newCampaign, schedule: e.target.value })}
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="border-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCampaign}
              disabled={isCreating || templates.length === 0 || phonebooks.length === 0}
              className="bg-cta text-white"
            >
              {isCreating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Criar campanha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmar exclusao */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-white/10 bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Remover campanha?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a campanha "{selectedCampaign?.title}"? Esta
              acao nao pode ser desfeita e todos os logs serao removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Broadcast;
