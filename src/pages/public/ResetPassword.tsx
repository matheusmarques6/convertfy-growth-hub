import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, MailCheck, KeyRound } from "lucide-react";

const ResetPassword = () => {
  return (
    <AuthLayout
      title="Resetar senha"
      subtitle="Enviaremos um código de verificação para o seu email. Validação em duas etapas para manter sua conta segura."
      sideNote={
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          Se a resposta indicar logout, redirecionar para login e limpar token.
        </div>
      }
      footer={
        <>
          <Link to="/login" className="text-primary hover:text-white">
            Voltar para login
          </Link>
          <Link to="/register" className="text-primary hover:text-white">
            Criar nova conta
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-white">
            Email cadastrado
          </Label>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
            <MailCheck className="h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="border-none bg-transparent text-white placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="otp" className="text-sm text-white">
            Código (OTP)
          </Label>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            <Input
              id="otp"
              placeholder="123456"
              className="border-none bg-transparent text-white placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
        </div>
        <Button className="w-full rounded-xl bg-cta text-white shadow-glow hover:opacity-90">Enviar e validar</Button>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
