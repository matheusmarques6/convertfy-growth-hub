import { useEffect, useState, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { UserRound, Upload, Filter, Plus, Loader2, Trash2, RefreshCcw, FolderPlus, Search } from "lucide-react";
import { contactService, ContactData, PhonebookData } from "@/services/contacts";
import { useToast } from "@/hooks/use-toast";

const Contacts = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data states
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [phonebooks, setPhonebooks] = useState<PhonebookData[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactData[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Selection states
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [selectedPhonebook, setSelectedPhonebook] = useState<string>("all");

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddPhonebookModal, setShowAddPhonebookModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form states
  const [newPhonebookName, setNewPhonebookName] = useState("");
  const [newContact, setNewContact] = useState({
    name: "",
    mobile: "",
    phonebook_id: "",
    var1: "",
    var2: "",
  });

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [contactsRes, phonebooksRes] = await Promise.all([
        contactService.getContacts(),
        contactService.getPhonebooks(),
      ]);

      if (contactsRes.success && contactsRes.data) {
        setContacts(contactsRes.data);
        setFilteredContacts(contactsRes.data);
      }

      if (phonebooksRes.success && phonebooksRes.data) {
        setPhonebooks(phonebooksRes.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter contacts
  useEffect(() => {
    let filtered = contacts;

    // Filter by phonebook
    if (selectedPhonebook !== "all") {
      filtered = filtered.filter(c => c.phonebook_id === parseInt(selectedPhonebook));
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c => c.name?.toLowerCase().includes(query) || c.mobile?.includes(query)
      );
    }

    setFilteredContacts(filtered);
  }, [contacts, selectedPhonebook, searchQuery]);

  // Create phonebook
  const handleCreatePhonebook = async () => {
    if (!newPhonebookName.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }

    try {
      setIsCreating(true);
      const response = await contactService.createPhonebook(newPhonebookName);

      if (response.success) {
        toast({ title: "Lista criada com sucesso!" });
        setShowAddPhonebookModal(false);
        setNewPhonebookName("");
        fetchData();
      } else {
        toast({ title: "Erro", description: response.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro ao criar lista", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  // Add contact
  const handleAddContact = async () => {
    if (!newContact.mobile || !newContact.phonebook_id) {
      toast({ title: "Telefone e lista são obrigatórios", variant: "destructive" });
      return;
    }

    const phonebook = phonebooks.find(p => p.id === parseInt(newContact.phonebook_id));
    if (!phonebook) {
      toast({ title: "Selecione uma lista válida", variant: "destructive" });
      return;
    }

    try {
      setIsCreating(true);
      const response = await contactService.addContact({
        id: phonebook.id,
        phonebook_name: phonebook.name,
        name: newContact.name,
        mobile: newContact.mobile,
        var1: newContact.var1,
        var2: newContact.var2,
      });

      if (response.success) {
        toast({ title: "Contato adicionado!" });
        setShowAddContactModal(false);
        setNewContact({ name: "", mobile: "", phonebook_id: "", var1: "", var2: "" });
        fetchData();
      } else {
        toast({ title: "Erro", description: response.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro ao adicionar contato", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  // Import CSV
  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const phonebookId = newContact.phonebook_id;
    if (!phonebookId) {
      toast({ title: "Selecione uma lista primeiro", variant: "destructive" });
      return;
    }

    const phonebook = phonebooks.find(p => p.id === parseInt(phonebookId));
    if (!phonebook) return;

    try {
      setIsImporting(true);
      const response = await contactService.importCSV(file, phonebook.id, phonebook.name);

      if (response.success) {
        toast({ title: "Contatos importados com sucesso!" });
        setShowImportModal(false);
        fetchData();
      } else {
        toast({ title: "Erro", description: response.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro ao importar", variant: "destructive" });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Delete selected contacts
  const handleDeleteSelected = async () => {
    if (selectedContacts.length === 0) return;

    try {
      const response = await contactService.deleteContacts(selectedContacts);

      if (response.success) {
        toast({ title: `${selectedContacts.length} contato(s) removido(s)` });
        setSelectedContacts([]);
        setShowDeleteDialog(false);
        fetchData();
      }
    } catch (error) {
      toast({ title: "Erro ao remover contatos", variant: "destructive" });
    }
  };

  // Toggle contact selection
  const toggleContactSelection = (id: number) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Toggle all
  const toggleAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppLayout
      title="Contatos"
      description="Base de contatos com importação, tags e envio de templates."
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 text-white"
            onClick={() => setShowImportModal(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar CSV
          </Button>
          <Button
            className="bg-cta text-white shadow-glow hover:opacity-90"
            onClick={() => setShowAddContactModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar contato
          </Button>
        </div>
      }
    >
      {/* Phonebooks Card */}
      <Card className="border-white/10 bg-white/5 mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Listas de Contatos</CardTitle>
            <p className="text-sm text-muted-foreground">{phonebooks.length} lista(s)</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-white/10"
            onClick={() => setShowAddPhonebookModal(true)}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Nova lista
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge
              className={`cursor-pointer ${selectedPhonebook === "all" ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
              onClick={() => setSelectedPhonebook("all")}
            >
              Todos ({contacts.length})
            </Badge>
            {phonebooks.map(pb => (
              <Badge
                key={pb.id}
                className={`cursor-pointer ${selectedPhonebook === pb.id.toString() ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
                onClick={() => setSelectedPhonebook(pb.id.toString())}
              >
                {pb.name} ({pb.contactCount || 0})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-white">Contatos</CardTitle>
              <p className="text-sm text-muted-foreground">{filteredContacts.length} contato(s)</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedContacts.length > 0 && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover ({selectedContacts.length})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="border-white/10"
                onClick={fetchData}
                disabled={isLoading}
              >
                <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-white/10 bg-[#0f1118] text-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserRound className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhum contato</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione contatos manualmente ou importe um CSV
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead className="text-muted-foreground">Nome</TableHead>
                  <TableHead className="text-muted-foreground">Telefone</TableHead>
                  <TableHead className="text-muted-foreground">Lista</TableHead>
                  <TableHead className="text-muted-foreground">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id} className="border-white/10">
                    <TableCell>
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => toggleContactSelection(contact.id)}
                      />
                    </TableCell>
                    <TableCell className="flex items-center gap-2 text-white">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                        <UserRound className="h-4 w-4" />
                      </span>
                      {contact.name || "Sem nome"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{contact.mobile}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary/20 text-primary">{contact.phonebook_name}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal: Adicionar Contato */}
      <Dialog open={showAddContactModal} onOpenChange={setShowAddContactModal}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle className="text-white">Adicionar Contato</DialogTitle>
            <DialogDescription>Preencha os dados do novo contato</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Lista *</Label>
              <Select
                value={newContact.phonebook_id}
                onValueChange={(v) => setNewContact({ ...newContact, phonebook_id: v })}
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Selecione uma lista" />
                </SelectTrigger>
                <SelectContent>
                  {phonebooks.map(pb => (
                    <SelectItem key={pb.id} value={pb.id.toString()}>{pb.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Telefone *</Label>
              <Input
                placeholder="+5511999999999"
                value={newContact.mobile}
                onChange={(e) => setNewContact({ ...newContact, mobile: e.target.value })}
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Nome</Label>
              <Input
                placeholder="Nome do contato"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddContactModal(false)} className="border-white/10">
              Cancelar
            </Button>
            <Button onClick={handleAddContact} disabled={isCreating} className="bg-cta text-white">
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Nova Lista */}
      <Dialog open={showAddPhonebookModal} onOpenChange={setShowAddPhonebookModal}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle className="text-white">Nova Lista</DialogTitle>
            <DialogDescription>Crie uma nova lista para organizar seus contatos</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Nome da lista</Label>
              <Input
                placeholder="Ex: Clientes VIP, Leads, Marketing..."
                value={newPhonebookName}
                onChange={(e) => setNewPhonebookName(e.target.value)}
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPhonebookModal(false)} className="border-white/10">
              Cancelar
            </Button>
            <Button onClick={handleCreatePhonebook} disabled={isCreating} className="bg-cta text-white">
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FolderPlus className="mr-2 h-4 w-4" />}
              Criar lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Importar CSV */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle className="text-white">Importar CSV</DialogTitle>
            <DialogDescription>
              Faça upload de um arquivo CSV com seus contatos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Lista de destino *</Label>
              <Select
                value={newContact.phonebook_id}
                onValueChange={(v) => setNewContact({ ...newContact, phonebook_id: v })}
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Selecione uma lista" />
                </SelectTrigger>
                <SelectContent>
                  {phonebooks.map(pb => (
                    <SelectItem key={pb.id} value={pb.id.toString()}>{pb.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Arquivo CSV</Label>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                disabled={isImporting || !newContact.phonebook_id}
                className="border-white/10 bg-white/5 text-white file:bg-primary file:text-white file:border-0"
              />
              <p className="text-xs text-muted-foreground">
                Headers obrigatórios: name, mobile. Opcionais: var1, var2, var3, var4, var5
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportModal(false)} className="border-white/10">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmar exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-white/10 bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Remover contatos?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover {selectedContacts.length} contato(s)?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
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

export default Contacts;
