import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, Chrome, ShieldPlus, Loader2, Phone } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validações
    if (!name || !email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, email e senha",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A senha e confirmação devem ser iguais",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    const success = await register(name, email, password, mobile || undefined);

    if (success) {
      toast({
        title: "Conta criada!",
        description: "Bem-vindo ao WhatsCRM. Sua conta foi criada com sucesso.",
      });
      navigate("/dashboard", { replace: true });
    } else {
      toast({
        title: "Erro ao criar conta",
        description: error || "Verifique os dados e tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleGoogleRegister = async () => {
    toast({
      title: "Em breve",
      description: "Registro com Google será disponibilizado em breve",
    });
  };

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Teste gratuito para explorar inbox, bots, flow builder e disparos de campanha."
      sideNote={
        <div className="flex items-center gap-2">
          <ShieldPlus className="h-4 w-4" />
          Verificação por email e MFA disponível
        </div>
      }
      footer={
        <>
          <span>
            Já possui conta?{" "}
            <Link to="/login" className="text-primary hover:text-white">
              Fazer login
            </Link>
          </span>
          <Link to="/reset-password" className="text-primary hover:text-white">
            Recuperar senha
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-white">
              Nome completo
            </Label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Maria Costa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="border-none bg-transparent text-white placeholder:text-muted-foreground focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-white">
              Email
            </Label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="contato@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="border-none bg-transparent text-white placeholder:text-muted-foreground focus-visible:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile" className="text-sm text-white">
            Telefone (opcional)
          </Label>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <Input
              id="mobile"
              type="tel"
              placeholder="+55 11 99999-9999"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm text-white">
            Confirmar senha
          </Label>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="border-none bg-transparent text-white placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-cta text-white shadow-glow hover:opacity-90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>

        <div className="space-y-3">
          <Separator className="bg-white/10" />
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full rounded-xl border-primary/30 bg-primary/5 text-white hover:bg-primary/10"
          >
            <Chrome className="mr-2 h-4 w-4" />
            Registrar com Google
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
