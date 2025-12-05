import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, ShieldCheck, Ban, UserPlus } from "lucide-react";

const users = [
  { email: "admin@empresa.com", role: "admin", workspaces: 4 },
  { email: "agent@empresa.com", role: "agent", workspaces: 2 },
  { email: "user@empresa.com", role: "user", workspaces: 1 },
];

const AdminUsers = () => {
  return (
    <AppLayout
      title="Usuários (Admin)"
      description="CRUD de usuários, papéis e workspaces."
      actions={<Button className="bg-cta text-white shadow-glow hover:opacity-90">Novo usuário</Button>}
    >
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">Usuários</CardTitle>
            <p className="text-sm text-muted-foreground">GET /admin/users</p>
          </div>
          <Badge className="bg-primary/20 text-primary">Admin only</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">Papel</TableHead>
                <TableHead className="text-muted-foreground">Workspaces</TableHead>
                <TableHead className="text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email} className="border-white/10">
                  <TableCell className="flex items-center gap-2 text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                      <Users className="h-4 w-4" />
                    </span>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-primary/20 text-primary">{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.workspaces}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-white/10 bg-white/5 text-white">
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" className="border border-white/10 bg-white/5 text-white">
                        <Ban className="mr-2 h-4 w-4" />
                        Suspender
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
          <CardTitle className="text-white">Permissões</CardTitle>
          <p className="text-sm text-muted-foreground">user | admin | agent</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Admin", detail: "Acesso total e rotas /admin", icon: <ShieldCheck className="h-4 w-4 text-primary" /> },
            { title: "Agent", detail: "Inbox, campanhas atribuídas", icon: <Users className="h-4 w-4 text-primary" /> },
            { title: "User", detail: "Dashboard e relatórios", icon: <UserPlus className="h-4 w-4 text-primary" /> },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                {item.icon}
                {item.title}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default AdminUsers;
