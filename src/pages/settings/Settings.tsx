import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, KeyRound, Smartphone, Shield, Link2, Globe } from "lucide-react";

const Settings = () => {
  return (
    <AppLayout
      title="Configurações"
      description="Perfil, credenciais WhatsApp e API Keys."
      actions={<Button className="bg-cta text-white shadow-glow hover:opacity-90">Salvar alterações</Button>}
    >
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Perfil</CardTitle>
          <p className="text-sm text-muted-foreground">GET /get-profile · POST /update-profile</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-white">
              Nome
            </Label>
            <Input id="name" placeholder="Maria Costa" className="rounded-xl border-white/10 bg-[#0f1118] text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-white">
              Email
            </Label>
            <Input id="email" type="email" placeholder="contato@empresa.com" className="rounded-xl border-white/10 bg-[#0f1118] text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm text-white">
              WhatsApp
            </Label>
            <Input id="phone" placeholder="+55 11 90000-0000" className="rounded-xl border-white/10 bg-[#0f1118] text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm text-white">
              Papel
            </Label>
            <Input id="role" placeholder="Admin" className="rounded-xl border-white/10 bg-[#0f1118] text-white" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">Credenciais Meta API</CardTitle>
            <p className="text-sm text-muted-foreground">GET /get-meta-keys · POST /save-meta-keys</p>
          </div>
          <Badge className="bg-primary/20 text-primary">Criptografado</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="appId" className="text-sm text-white">
              App ID
            </Label>
            <Input id="appId" placeholder="app-id" className="rounded-xl border-white/10 bg-[#0f1118] text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appSecret" className="text-sm text-white">
              App Secret
            </Label>
            <Input id="appSecret" placeholder="••••••••••" className="rounded-xl border-white/10 bg-[#0f1118] text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token" className="text-sm text-white">
              Access Token
            </Label>
            <Input id="token" placeholder="token" className="rounded-xl border-white/10 bg-[#0f1118] text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneId" className="text-sm text-white">
              Phone Number ID
            </Label>
            <Input id="phoneId" placeholder="phone-number-id" className="rounded-xl border-white/10 bg-[#0f1118] text-white" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">API & Webhooks</CardTitle>
          <p className="text-sm text-muted-foreground">Configuração de chaves e endpoints</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            { icon: <KeyRound className="h-4 w-4" />, title: "JWT Token", detail: "Authorization: Bearer <token>" },
            { icon: <Link2 className="h-4 w-4" />, title: "Webhook", detail: "POST /save-meta-keys" },
            { icon: <Shield className="h-4 w-4" />, title: "Logout seguro", detail: "{ success:false, logout:true }" },
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

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Notificações</CardTitle>
          <p className="text-sm text-muted-foreground">Envio de emails e push</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Mail className="h-4 w-4 text-primary" />
              Email operacional
            </div>
            <p className="mt-2 text-xs text-muted-foreground">SMTP e notificações de falha</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Smartphone className="h-4 w-4 text-primary" />
              Push e alerts
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Socket.io para eventos críticos</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Globe className="h-4 w-4 text-primary" />
              Domínio & URLs
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Base URL http://localhost:3010/api</p>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Settings;
