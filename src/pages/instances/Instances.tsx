import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QrCode, Wifi, Power, Trash2, Plus, Loader2, RefreshCcw, Smartphone } from "lucide-react";
import { instanceService, QRInstance } from "@/services/instances";
import { useToast } from "@/hooks/use-toast";
import { getSocket, onSocketEvent, offSocketEvent } from "@/services/socket";

const Instances = () => {
  const { toast } = useToast();
  const [instances, setInstances] = useState<QRInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<QRInstance | null>(null);

  // Form state
  const [newInstanceName, setNewInstanceName] = useState("");

  // QR Code state
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  // Fetch instances
  const fetchInstances = async () => {
    try {
      setIsLoading(true);
      const response = await instanceService.getInstances();
      if (response.success && response.data) {
        setInstances(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar instâncias:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as instâncias",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create instance
  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para a instância",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const response = await instanceService.createInstance({
        title: newInstanceName,
        uniqueId,
      });

      if (response.success) {
        toast({
          title: "Instância criada",
          description: "QR Code está sendo gerado. Aguarde...",
        });
        setShowCreateModal(false);
        setNewInstanceName("");
        fetchInstances();
      } else {
        toast({
          title: "Erro",
          description: response.msg || "Não foi possível criar a instância",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao criar instância:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar instância",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Delete instance
  const handleDeleteInstance = async () => {
    if (!selectedInstance) return;

    try {
      setIsDeleting(selectedInstance.uniqueId);
      const response = await instanceService.deleteInstance(selectedInstance.uniqueId);

      toast({
        title: "Instância removida",
        description: "A instância foi removida com sucesso",
      });
      setShowDeleteDialog(false);
      setSelectedInstance(null);
      fetchInstances();
    } catch (error) {
      console.error("Erro ao deletar instância:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a instância",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  // Open QR Modal
  const handleShowQR = (instance: QRInstance) => {
    setSelectedInstance(instance);
    setQrCode(null);
    setShowQRModal(true);
    setQrLoading(true);

    // Listen for QR code via socket
    const socket = getSocket();
    if (socket) {
      socket.emit("request_qr", { uniqueId: instance.uniqueId });
    }
  };

  // Socket listeners
  useEffect(() => {
    const handleQRCode = (data: { qrCode: string; instanceId: string }) => {
      console.log("QR Code recebido:", data);
      if (selectedInstance && data.instanceId === selectedInstance.uniqueId) {
        setQrCode(data.qrCode);
        setQrLoading(false);
      }
    };

    const handleConnected = (data: { instanceId: string }) => {
      console.log("Instância conectada:", data);
      toast({
        title: "WhatsApp conectado!",
        description: "A instância foi conectada com sucesso",
      });
      setShowQRModal(false);
      fetchInstances();
    };

    const handleDisconnected = (data: { instanceId: string }) => {
      console.log("Instância desconectada:", data);
      fetchInstances();
    };

    onSocketEvent("qr_code" as any, handleQRCode);
    onSocketEvent("qr_connected" as any, handleConnected);
    onSocketEvent("qr_disconnected" as any, handleDisconnected);

    return () => {
      offSocketEvent("qr_code" as any, handleQRCode);
      offSocketEvent("qr_connected" as any, handleConnected);
      offSocketEvent("qr_disconnected" as any, handleDisconnected);
    };
  }, [selectedInstance]);

  // Initial fetch
  useEffect(() => {
    fetchInstances();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-success/20 text-success">Conectado</Badge>;
      case "GENERATING":
        return <Badge className="bg-primary/20 text-primary">Gerando QR</Badge>;
      case "INACTIVE":
      default:
        return <Badge className="bg-muted/20 text-muted-foreground">Desconectado</Badge>;
    }
  };

  return (
    <AppLayout
      title="Instâncias QR"
      description="Conexões WhatsApp via QR Code com status em tempo real."
      actions={
        <Button
          className="bg-cta text-white shadow-glow hover:opacity-90"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova instância
        </Button>
      }
    >
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">Conexões WhatsApp</CardTitle>
            <p className="text-sm text-muted-foreground">
              {instances.length} instância(s) configurada(s)
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInstances}
            disabled={isLoading}
            className="border-white/10"
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : instances.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Smartphone className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhuma instância</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crie uma nova instância para conectar seu WhatsApp
              </p>
              <Button
                className="bg-cta text-white"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira instância
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {instances.map((instance) => (
                <div
                  key={instance.uniqueId}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{instance.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {instance.number || "Aguardando conexão"}
                      </p>
                    </div>
                    {getStatusBadge(instance.status)}
                  </div>
                  <Separator className="my-3 bg-white/10" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <QrCode className="h-4 w-4 text-primary" />
                    ID: {instance.uniqueId.slice(0, 20)}...
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wifi className="h-4 w-4 text-primary" />
                    Criado em: {new Date(instance.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {instance.status !== "ACTIVE" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 bg-white/5 text-white"
                        onClick={() => handleShowQR(instance)}
                      >
                        <QrCode className="mr-2 h-4 w-4" />
                        Ver QR
                      </Button>
                    )}
                    {instance.status === "ACTIVE" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-success/30 bg-success/10 text-success"
                        disabled
                      >
                        <Power className="mr-2 h-4 w-4" />
                        Conectado
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                      onClick={() => {
                        setSelectedInstance(instance);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal: Criar Instância */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle className="text-white">Nova Instância</DialogTitle>
            <DialogDescription>
              Crie uma nova conexão WhatsApp via QR Code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome da instância</Label>
              <Input
                id="name"
                placeholder="Ex: Suporte, Vendas, Marketing..."
                value={newInstanceName}
                onChange={(e) => setNewInstanceName(e.target.value)}
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
              onClick={handleCreateInstance}
              disabled={isCreating}
              className="bg-cta text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar instância
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: QR Code */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle className="text-white">Escanear QR Code</DialogTitle>
            <DialogDescription>
              Abra o WhatsApp no celular e escaneie o código abaixo
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            {qrLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
              </div>
            ) : qrCode ? (
              <div className="bg-white p-4 rounded-lg">
                <img src={qrCode} alt="QR Code" className="w-64 h-64" />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Aguardando QR Code...
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => selectedInstance && handleShowQR(selectedInstance)}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Tentar novamente
                </Button>
              </div>
            )}
          </div>
          <div className="text-center text-xs text-muted-foreground">
            <p>1. Abra o WhatsApp no seu celular</p>
            <p>2. Toque em Menu ou Configurações</p>
            <p>3. Toque em Aparelhos conectados</p>
            <p>4. Toque em Conectar um aparelho</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmar exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-white/10 bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Remover instância?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a instância "{selectedInstance?.title}"?
              Esta ação não pode ser desfeita e a conexão WhatsApp será encerrada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInstance}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removendo...
                </>
              ) : (
                "Remover"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Instances;
