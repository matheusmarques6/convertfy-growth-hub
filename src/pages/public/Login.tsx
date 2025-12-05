import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Shield, Chrome, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Redirecionar para a página anterior ou dashboard
  const from = (location.state as { from?: string })?.from || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha",
        variant: "destructive",
      });
      return;
    }

    const success = await login(email, password);

    if (success) {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta ao WhatsCRM",
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: "Erro ao fazer login",
        description: error || "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    // TODO: Implementar Google OAuth
    // Por enquanto, mostrar mensagem informativa
    toast({
      title: "Em breve",
      description: "Login com Google será disponibilizado em breve",
    });
  };

  return (
    <AuthLayout
      title="Acesse o WhatsCRM"
      subtitle="Centralize inbox, campanhas e fluxos em um painel com métricas em tempo real."
      sideNote={
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Autenticação segura via JWT + proteção de sessão
        </div>
      }
      footer={
        <>
          <span>
            Novo por aqui?{" "}
            <Link to="/register" className="text-primary hover:text-white">
              Criar conta
            </Link>
          </span>
          <Link to="/reset-password" className="text-primary hover:text-white">
            Esqueceu a senha?
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-white">
            Email
          </Label>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="border-none bg-transparent text-white placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-white">
            Senha
          </Label>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="border-none bg-transparent text-white placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="border-white/20 bg-transparent data-[state=checked]:border-primary data-[state=checked]:bg-primary"
            />
            Manter conectado
          </label>
          <Link to="/reset-password" className="text-primary hover:text-white">
            Recuperar senha
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-cta text-white shadow-glow hover:opacity-90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>

        <div className="space-y-3">
          <Separator className="bg-white/10" />
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full rounded-xl border-primary/30 bg-primary/5 text-white hover:bg-primary/10"
          >
            <Chrome className="mr-2 h-4 w-4" />
            Entrar com Google
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
