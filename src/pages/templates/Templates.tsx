import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Plus,
  Loader2,
  RefreshCcw,
  Trash2,
  Send,
  MessageSquare,
} from "lucide-react";
import {
  templateService,
  MetaTemplate,
  UserTemplate,
} from "@/services/templates";
import { useToast } from "@/hooks/use-toast";

const Templates = () => {
  const { toast } = useToast();

  // Data states
  const [metaTemplates, setMetaTemplates] = useState<MetaTemplate[]>([]);
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([]);

  // Loading states
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Selected states
  const [selectedTemplate, setSelectedTemplate] = useState<MetaTemplate | null>(null);
  const [selectedUserTemplate, setSelectedUserTemplate] = useState<UserTemplate | null>(null);
  const [selectedTab, setSelectedTab] = useState("meta");

  // Form states
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    type: "text",
    content: "",
  });

  const [sendForm, setSendForm] = useState({
    phone: "",
    variables: [] as string[],
  });

  // Fetch Meta templates
  const fetchMetaTemplates = async () => {
    try {
      setIsLoadingMeta(true);
      const response = await templateService.getMetaTemplates();

      if (response.success && response.data) {
        setMetaTemplates(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar Meta templates:", error);
    } finally {
      setIsLoadingMeta(false);
    }
  };

  // Fetch User templates
  const fetchUserTemplates = async () => {
    try {
      setIsLoadingUser(true);
      const response = await templateService.getUserTemplates();

      if (response.success && response.data) {
        setUserTemplates(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar templates:", error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  // Create user template
  const handleCreateTemplate = async () => {
    if (!newTemplate.title || !newTemplate.content) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    try {
      setIsCreating(true);
      const response = await templateService.createUserTemplate({
        title: newTemplate.title,
        type: newTemplate.type,
        content: { text: newTemplate.content },
      });

      if (response.success) {
        toast({ title: "Template criado com sucesso!" });
        setShowCreateModal(false);
        setNewTemplate({ title: "", type: "text", content: "" });
        fetchUserTemplates();
      } else {
        toast({ title: "Erro", description: response.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro ao criar template", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  // Delete user template
  const handleDeleteUserTemplate = async () => {
    if (!selectedUserTemplate) return;

    try {
      const response = await templateService.deleteUserTemplates([selectedUserTemplate.id]);

      if (response.success) {
        toast({ title: "Template removido" });
        setShowDeleteDialog(false);
        setSelectedUserTemplate(null);
        fetchUserTemplates();
      }
    } catch (error) {
      toast({ title: "Erro ao remover template", variant: "destructive" });
    }
  };

  // Send Meta template
  const handleSendTemplate = async () => {
    if (!selectedTemplate || !sendForm.phone) {
      toast({ title: "Preencha o telefone", variant: "destructive" });
      return;
    }

    try {
      setIsSending(true);
      const response = await templateService.sendTemplate({
        sendTo: sendForm.phone,
        templetName: selectedTemplate.name,
        exampleArr: sendForm.variables,
      });

      if (response.success) {
        toast({ title: "Template enviado com sucesso!" });
        setShowSendModal(false);
        setSendForm({ phone: "", variables: [] });
      } else {
        toast({ title: "Erro", description: response.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro ao enviar template", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-success/20 px-3 py-1 text-xs text-success">
            <CheckCircle2 className="h-4 w-4" />
            Aprovado
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
            <Clock className="h-4 w-4" />
            Pendente
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-destructive/20 px-3 py-1 text-xs text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Rejeitado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-muted/20 px-3 py-1 text-xs text-muted-foreground">
            {status}
          </span>
        );
    }
  };

  // Parse template content
  const parseContent = (content: string) => {
    try {
      return JSON.parse(content);
    } catch {
      return { text: content };
    }
  };

  // Get template body text
  const getTemplateBody = (template: MetaTemplate) => {
    const bodyComponent = template.components?.find((c) => c.type === "BODY");
    return bodyComponent?.text || "-";
  };

  // Count variables in template
  const countVariables = (template: MetaTemplate) => {
    const body = getTemplateBody(template);
    const matches = body.match(/\{\{[0-9]+\}\}/g);
    return matches ? matches.length : 0;
  };

  useEffect(() => {
    fetchMetaTemplates();
    fetchUserTemplates();
  }, []);

  return (
    <AppLayout
      title="Templates"
      description="Gerencie templates de mensagens para WhatsApp"
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchMetaTemplates();
              fetchUserTemplates();
            }}
            disabled={isLoadingMeta || isLoadingUser}
            className="border-white/10"
          >
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${isLoadingMeta || isLoadingUser ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
          <Button
            className="bg-cta text-white shadow-glow hover:opacity-90"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo template
          </Button>
        </div>
      }
    >
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="border-white/10 bg-white/5">
          <TabsTrigger value="meta" className="data-[state=active]:bg-primary/20">
            <MessageSquare className="mr-2 h-4 w-4" />
            Meta Templates ({metaTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="user" className="data-[state=active]:bg-primary/20">
            <FileText className="mr-2 h-4 w-4" />
            Meus Templates ({userTemplates.length})
          </TabsTrigger>
        </TabsList>

        {/* Meta Templates Tab */}
        <TabsContent value="meta">
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="space-y-2">
              <CardTitle className="text-white">Meta WhatsApp Templates</CardTitle>
              <p className="text-sm text-muted-foreground">
                Templates aprovados pela Meta para envio via WhatsApp Business API
              </p>
            </CardHeader>
            <CardContent>
              {isLoadingMeta ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : metaTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Nenhum Meta template encontrado
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure as credenciais Meta API nas configuracoes para sincronizar seus
                    templates
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-muted-foreground">Nome</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Categoria</TableHead>
                      <TableHead className="text-muted-foreground">Idioma</TableHead>
                      <TableHead className="text-muted-foreground">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metaTemplates.map((template) => (
                      <TableRow key={template.id} className="border-white/10">
                        <TableCell className="flex items-center gap-2 text-white">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                            <FileText className="h-4 w-4" />
                          </span>
                          {template.name}
                        </TableCell>
                        <TableCell>{getStatusBadge(template.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {template.category}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {template.language}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/10 bg-white/5 text-white"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setShowPreviewModal(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Previa
                            </Button>
                            {template.status === "APPROVED" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="border border-white/10 bg-white/5 text-white"
                                onClick={() => {
                                  setSelectedTemplate(template);
                                  const varCount = countVariables(template);
                                  setSendForm({
                                    phone: "",
                                    variables: Array(varCount).fill(""),
                                  });
                                  setShowSendModal(true);
                                }}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Enviar
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Templates Tab */}
        <TabsContent value="user">
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="space-y-2">
              <CardTitle className="text-white">Meus Templates</CardTitle>
              <p className="text-sm text-muted-foreground">
                Templates personalizados para uso em chatbots e campanhas
              </p>
            </CardHeader>
            <CardContent>
              {isLoadingUser ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : userTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Nenhum template criado
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Crie templates para reutilizar em seus chatbots e campanhas
                  </p>
                  <Button
                    className="bg-cta text-white"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar template
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-muted-foreground">Titulo</TableHead>
                      <TableHead className="text-muted-foreground">Tipo</TableHead>
                      <TableHead className="text-muted-foreground">Criado em</TableHead>
                      <TableHead className="text-muted-foreground">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userTemplates.map((template) => {
                      const content = parseContent(template.content);
                      return (
                        <TableRow key={template.id} className="border-white/10">
                          <TableCell className="flex items-center gap-2 text-white">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                              <FileText className="h-4 w-4" />
                            </span>
                            {template.title}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-primary/20 text-primary">
                              {template.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(template.createdAt).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/10 bg-white/5 text-white"
                                onClick={() => {
                                  setSelectedUserTemplate(template);
                                  setShowPreviewModal(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                                onClick={() => {
                                  setSelectedUserTemplate(template);
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
        </TabsContent>
      </Tabs>

      {/* Modal: Criar Template */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle className="text-white">Novo Template</DialogTitle>
            <DialogDescription>
              Crie um template de mensagem para reutilizar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Titulo *</Label>
              <Input
                placeholder="Ex: Boas-vindas"
                value={newTemplate.title}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, title: e.target.value })
                }
                className="border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Tipo</Label>
              <Select
                value={newTemplate.type}
                onValueChange={(v) => setNewTemplate({ ...newTemplate, type: v })}
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="media">Midia</SelectItem>
                  <SelectItem value="interactive">Interativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Conteudo *</Label>
              <Textarea
                placeholder="Digite o conteudo do template..."
                value={newTemplate.content}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, content: e.target.value })
                }
                className="min-h-[120px] border-white/10 bg-white/5 text-white"
              />
              <p className="text-xs text-muted-foreground">
                Use {"{{1}}"}, {"{{2}}"}, etc. para variaveis dinamicas
              </p>
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
              onClick={handleCreateTemplate}
              disabled={isCreating}
              className="bg-cta text-white"
            >
              {isCreating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Preview Template */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedTemplate?.name || selectedUserTemplate?.title}
            </DialogTitle>
            <DialogDescription>Previa do template</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            {selectedTemplate ? (
              <div className="space-y-3">
                {selectedTemplate.components?.map((comp, idx) => (
                  <div key={idx}>
                    {comp.type === "HEADER" && (
                      <p className="font-bold text-white">{comp.text}</p>
                    )}
                    {comp.type === "BODY" && (
                      <p className="text-white whitespace-pre-wrap">{comp.text}</p>
                    )}
                    {comp.type === "FOOTER" && (
                      <p className="text-sm text-muted-foreground">{comp.text}</p>
                    )}
                    {comp.type === "BUTTONS" && comp.buttons && (
                      <div className="flex gap-2 mt-2">
                        {comp.buttons.map((btn, btnIdx) => (
                          <Button
                            key={btnIdx}
                            size="sm"
                            variant="outline"
                            className="border-primary/30 text-primary"
                          >
                            {btn.text}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex gap-2 pt-2 border-t border-white/10 mt-4">
                  <Badge className="bg-primary/20 text-primary">
                    {selectedTemplate.category}
                  </Badge>
                  <Badge className="bg-white/10 text-white">
                    {selectedTemplate.language}
                  </Badge>
                  {getStatusBadge(selectedTemplate.status)}
                </div>
              </div>
            ) : selectedUserTemplate ? (
              <div className="space-y-2">
                <p className="text-white whitespace-pre-wrap">
                  {parseContent(selectedUserTemplate.content)?.text}
                </p>
                <div className="flex gap-2 pt-2 border-t border-white/10 mt-4">
                  <Badge className="bg-primary/20 text-primary">
                    {selectedUserTemplate.type}
                  </Badge>
                </div>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPreviewModal(false);
                setSelectedTemplate(null);
                setSelectedUserTemplate(null);
              }}
              className="border-white/10"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Enviar Template */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle className="text-white">Enviar Template</DialogTitle>
            <DialogDescription>
              Envie o template "{selectedTemplate?.name}" para um numero
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Telefone *</Label>
              <Input
                placeholder="5511999999999"
                value={sendForm.phone}
                onChange={(e) => setSendForm({ ...sendForm, phone: e.target.value })}
                className="border-white/10 bg-white/5 text-white"
              />
              <p className="text-xs text-muted-foreground">
                Inclua o codigo do pais sem o +
              </p>
            </div>

            {sendForm.variables.length > 0 && (
              <div className="space-y-2">
                <Label className="text-white">Variaveis</Label>
                {sendForm.variables.map((_, idx) => (
                  <Input
                    key={idx}
                    placeholder={`Variavel {{${idx + 1}}}`}
                    value={sendForm.variables[idx]}
                    onChange={(e) => {
                      const newVars = [...sendForm.variables];
                      newVars[idx] = e.target.value;
                      setSendForm({ ...sendForm, variables: newVars });
                    }}
                    className="border-white/10 bg-white/5 text-white"
                  />
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSendModal(false)}
              className="border-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendTemplate}
              disabled={isSending}
              className="bg-cta text-white"
            >
              {isSending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmar exclusao */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-white/10 bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Remover template?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o template "{selectedUserTemplate?.title}"?
              Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUserTemplate}
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

export default Templates;
