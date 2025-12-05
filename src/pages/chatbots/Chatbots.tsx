import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Bot, Workflow, Plus, Loader2, Trash2, RefreshCcw, Sparkles } from "lucide-react";
import { chatbotService, ChatbotData, FlowData } from "@/services/chatbots";
import { instanceService, QRInstance } from "@/services/instances";
import { useToast } from "@/hooks/use-toast";

const Chatbots = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Data states
  const [chatbots, setChatbots] = useState<ChatbotData[]>([]);
  const [flows, setFlows] = useState<FlowData[]>([]);
  const [instances, setInstances] = useState<QRInstance[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isToggling, setIsToggling] = useState<number | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<ChatbotData | null>(null);

  // Form states
  const [newChatbot, setNewChatbot] = useState({
    title: "",
    flowId: "",
    originCode: "META" as "META" | "QR",
    instanceId: "",
  });

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [chatbotsRes, flowsRes, instancesRes] = await Promise.all([
        chatbotService.getChatbots(),
        chatbotService.getFlows(),
        instanceService.getInstances(),
      ]);

      if (chatbotsRes.success && chatbotsRes.data) {
        setChatbots(chatbotsRes.data);
      }

      if (flowsRes.success && flowsRes.data) {
        setFlows(flowsRes.data);
      }

      if (instancesRes.success && instancesRes.data) {
        setInstances(instancesRes.data.filter(i => i.status === "ACTIVE"));
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create chatbot
  const handleCreateChatbot = async () => {
    if (!newChatbot.title || !newChatbot.flowId) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    if (newChatbot.originCode === "QR" && !newChatbot.instanceId) {
      toast({ title: "Selecione uma instância WhatsApp", variant: "destructive" });
      return;
    }

    const selectedFlow = flows.find(f => f.flow_id === newChatbot.flowId);
    if (!selectedFlow) {
      toast({ title: "Fluxo não encontrado", variant: "destructive" });
      return;
    }

    const selectedInstance = instances.find(i => i.uniqueId === newChatbot.instanceId);

    try {
      setIsCreating(true);
      const response = await chatbotService.createChatbot({
        title: newChatbot.title,
        origin: {
          code: newChatbot.originCode,
          title: newChatbot.originCode === "META" ? "Meta Cloud API" : selectedInstance?.title || "WhatsApp QR",
          data: newChatbot.originCode === "QR" ? { uniqueId: newChatbot.instanceId } : undefined,
        },
        flow: {
          id: selectedFlow.id.toString(),
          flow_id: selectedFlow.flow_id,
        },
      });

      if (response.success) {
        toast({ title: "Chatbot criado com sucesso!" });
        setShowCreateModal(false);
        setNewChatbot({ title: "", flowId: "", originCode: "META", instanceId: "" });
        fetchData();
      } else {
        toast({ title: "Erro", description: response.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro ao criar chatbot", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle chatbot status
  const handleToggle = async (chatbot: ChatbotData) => {
    try {
      setIsToggling(chatbot.id);
      const newStatus = chatbot.active === 0;
      const response = await chatbotService.toggleChatbot(chatbot.id, newStatus);

      if (response.success) {
        setChatbots(prev =>
          prev.map(c => c.id === chatbot.id ? { ...c, active: newStatus ? 1 : 0 } : c)
        );
        toast({ title: newStatus ? "Chatbot ativado" : "Chatbot desativado" });
      }
    } catch (error) {
      toast({ title: "Erro ao alterar status", variant: "destructive" });
    } finally {
      setIsToggling(null);
    }
  };

  // Delete chatbot
  const handleDelete = async () => {
    if (!selectedChatbot) return;

    try {
      const response = await chatbotService.deleteChatbot(selectedChatbot.id);

      if (response.success) {
        toast({ title: "Chatbot removido" });
        setShowDeleteDialog(false);
        setSelectedChatbot(null);
        fetchData();
      }
    } catch (error) {
      toast({ title: "Erro ao remover chatbot", variant: "destructive" });
    }
  };

  // Parse origin JSON
  const getOriginInfo = (originStr: string) => {
    try {
      return JSON.parse(originStr);
    } catch {
      return { code: "META", title: "Meta" };
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppLayout
      title="Chatbots"
      description="Gerencie fluxos, versões e conversões dos bots conectados ao WhatsApp."
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 text-white"
            onClick={() => navigate("/flow/new")}
          >
            <Workflow className="mr-2 h-4 w-4" />
            Criar fluxo
          </Button>
          <Button
            className="bg-cta text-white shadow-glow hover:opacity-90"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo chatbot
          </Button>
        </div>
      }
    >
      {/* Header com refresh */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {chatbots.length} chatbot(s) · {flows.length} fluxo(s) disponível(is)
          </p>
        </div>
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
      </div>

      {/* Chatbots Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : chatbots.length === 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhum chatbot</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie um chatbot para automatizar suas conversas
            </p>
            <Button
              className="bg-cta text-white"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar primeiro chatbot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {chatbots.map((chatbot) => {
            const origin = getOriginInfo(chatbot.origin);
            const flow = flows.find(f => f.flow_id === chatbot.flow_id);

            return (
              <Card key={chatbot.id} className="border-white/10 bg-white/5">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-white">{chatbot.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Fluxo: {flow?.title || chatbot.flow_id}
                    </p>
                  </div>
                  <Switch
                    checked={chatbot.active === 1}
                    onCheckedChange={() => handleToggle(chatbot)}
                    disabled={isToggling === chatbot.id}
                    className="data-[state=checked]:bg-primary"
                  />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className={origin.code === "META" ? "bg-primary/20 text-primary" : "bg-success/20 text-success"}>
                      {origin.code === "META" ? "Meta API" : "QR Code"}
                    </Badge>
                    <Badge
                      className={chatbot.active === 1 ? "bg-success/20 text-success" : "bg-muted/20 text-muted-foreground"}
                    >
                      {chatbot.active === 1 ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Criado em: {new Date(chatbot.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/10 bg-white/5 text-white"
                      onClick={() => navigate(`/flow/${chatbot.flow_id}`)}
                    >
                      <Workflow className="mr-2 h-4 w-4" />
                      Editar fluxo
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                      onClick={() => {
                        setSelectedChatbot(chatbot);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal: Criar Chatbot */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle className="text-white">Novo Chatbot</DialogTitle>
            <DialogDescription>
              Configure um novo chatbot para automatizar conversas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Nome do chatbot *</Label>
              <Input
                placeholder="Ex: Atendimento 24/7"
                value={newChatbot.title}
                onChange={(e) => setNewChatbot({ ...newChatbot, title: e.target.value })}
                className="border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Canal *</Label>
              <Select
                value={newChatbot.originCode}
                onValueChange={(v) => setNewChatbot({ ...newChatbot, originCode: v as "META" | "QR" })}
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="META">Meta Cloud API (Oficial)</SelectItem>
                  <SelectItem value="QR">WhatsApp via QR Code</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newChatbot.originCode === "QR" && (
              <div className="space-y-2">
                <Label className="text-white">Instância WhatsApp *</Label>
                <Select
                  value={newChatbot.instanceId}
                  onValueChange={(v) => setNewChatbot({ ...newChatbot, instanceId: v })}
                >
                  <SelectTrigger className="border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="Selecione uma instância conectada" />
                  </SelectTrigger>
                  <SelectContent>
                    {instances.length === 0 ? (
                      <SelectItem value="" disabled>Nenhuma instância ativa</SelectItem>
                    ) : (
                      instances.map(inst => (
                        <SelectItem key={inst.uniqueId} value={inst.uniqueId}>
                          {inst.title} {inst.number && `(${inst.number})`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-white">Fluxo *</Label>
              <Select
                value={newChatbot.flowId}
                onValueChange={(v) => setNewChatbot({ ...newChatbot, flowId: v })}
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Selecione um fluxo" />
                </SelectTrigger>
                <SelectContent>
                  {flows.length === 0 ? (
                    <SelectItem value="" disabled>Nenhum fluxo disponível</SelectItem>
                  ) : (
                    flows.map(flow => (
                      <SelectItem key={flow.flow_id} value={flow.flow_id}>
                        {flow.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {flows.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Você precisa criar um fluxo primeiro no Flow Builder
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)} className="border-white/10">
              Cancelar
            </Button>
            <Button
              onClick={handleCreateChatbot}
              disabled={isCreating || flows.length === 0}
              className="bg-cta text-white"
            >
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Criar chatbot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmar exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-white/10 bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Remover chatbot?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o chatbot "{selectedChatbot?.title}"?
              Esta ação não pode ser desfeita.
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

export default Chatbots;
