import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!name || !email || !password || !mobile) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, email, telefone e senha",
        variant: "destructive",
      });
      return;
    }

    if (!acceptPolicy) {
      toast({
        title: "Termos não aceitos",
        description: "Aceite os termos para continuar",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "Mínimo 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    const success = await register(name, email, password, mobile);

    if (success) {
      toast({
        title: "Conta criada!",
        description: "Agora escolha o plano ideal para você",
      });
      // Redirecionar para página de planos para escolher plano
      navigate("/plans", { replace: true });
    } else {
      toast({
        title: "Erro ao criar conta",
        description: error || "Tente novamente",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Teste gratuito"
      footer={
        <span>
          Já possui conta? <Link to="/login" className="text-primary hover:text-white">Fazer login</Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-white">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} placeholder="Seu nome" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-white">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} placeholder="seu@email.com" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile" className="text-sm text-white">Telefone</Label>
          <Input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} disabled={isLoading} placeholder="5511999999999" />
          <p className="text-xs text-muted-foreground">Ex: 5511999999999</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-white">Senha</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm text-white">Confirmar</Label>
          <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
        </div>

        <div className="flex items-start gap-2">
          <Checkbox id="terms" checked={acceptPolicy} onCheckedChange={(c) => setAcceptPolicy(c as boolean)} disabled={isLoading} />
          <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
            Aceito os termos e políticas
          </Label>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full rounded-xl bg-cta text-white shadow-glow">
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Criando...</> : "Criar conta"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;
