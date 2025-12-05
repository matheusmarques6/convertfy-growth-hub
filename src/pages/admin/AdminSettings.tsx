import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, CreditCard, ShieldCheck, Globe2 } from "lucide-react";

const AdminSettings = () => {
  return (
    <AppLayout
      title="Configurações (Admin)"
      description="SMTP, pagamentos e parâmetros globais."
      actions={<Badge className="bg-primary/20 text-primary">Apenas Admin</Badge>}
    >
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">SMTP</CardTitle>
          <p className="text-sm text-muted-foreground">Configurar email operacional</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            { icon: <Mail className="h-4 w-4 text-primary" />, title: "Host/Port", detail: "mail.convertfy.com : 587" },
            { icon: <ShieldCheck className="h-4 w-4 text-primary" />, title: "TLS/SSL", detail: "Credenciais seguras" },
            { icon: <Globe2 className="h-4 w-4 text-primary" />, title: "From/Reply-to", detail: "Operacional e suporte" },
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
        <Separator className="bg-white/10" />
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Pagamentos</CardTitle>
          <p className="text-sm text-muted-foreground">Biling e integrações</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CreditCard className="h-4 w-4 text-primary" />
              Gateway
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Stripe/Pagar.me configurável</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Notas fiscais
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Automação de cobranças e notas</p>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default AdminSettings;
