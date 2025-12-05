import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Book, Plus, Users, Link2 } from "lucide-react";

const books = [
  { name: "Vendas Enterprise", contacts: 3400, sharedWith: "Equipe comercial" },
  { name: "Suporte Premium", contacts: 1260, sharedWith: "Equipe suporte" },
  { name: "Leads RD", contacts: 890, sharedWith: "Marketing" },
];

const Phonebook = () => {
  return (
    <AppLayout
      title="Phonebook"
      description="Agendas e listas dinâmicas para segmentar disparos e inbox."
      actions={<Button className="bg-cta text-white shadow-glow hover:opacity-90">Nova agenda</Button>}
    >
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">Agendas</CardTitle>
            <p className="text-sm text-muted-foreground">Listas consumidas por campanhas e bots</p>
          </div>
          <Badge className="bg-primary/20 text-primary">Sync automático</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-muted-foreground">Agenda</TableHead>
                <TableHead className="text-muted-foreground">Contatos</TableHead>
                <TableHead className="text-muted-foreground">Compartilhada com</TableHead>
                <TableHead className="text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.name} className="border-white/10">
                  <TableCell className="flex items-center gap-2 text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                      <Book className="h-4 w-4" />
                    </span>
                    {book.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{book.contacts}</TableCell>
                  <TableCell className="text-muted-foreground">{book.sharedWith}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-white/10 bg-white/5 text-white">
                        Abrir
                      </Button>
                      <Button size="sm" variant="ghost" className="border border-white/10 bg-white/5 text-white">
                        Compartilhar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Integrações de agenda</CardTitle>
          <p className="text-sm text-muted-foreground">Sincronize CRM, planilhas e APIs</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Importar CSV", icon: <Plus className="h-4 w-4" />, detail: "Upload rápido" },
            { title: "Conectar CRM", icon: <Users className="h-4 w-4" />, detail: "HubSpot, RD, Pipedrive" },
            { title: "Webhook", icon: <Link2 className="h-4 w-4" />, detail: "POST /import-contacts" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-[#0c0f16] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  {item.icon}
                </span>
                {item.title}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </CardContent>
        <Separator className="bg-white/10" />
      </Card>
    </AppLayout>
  );
};

export default Phonebook;
