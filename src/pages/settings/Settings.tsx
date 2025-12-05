import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  KeyRound,
  Smartphone,
  Shield,
  Globe,
  User,
  Loader2,
  Save,
  RefreshCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { settingsService, MetaApiKeys, WhatsAppBusinessProfile } from "@/services/settings";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

// Timezones comuns para Brasil
const TIMEZONES = [
  { value: "America/Sao_Paulo", label: "Brasilia (GMT-3)" },
  { value: "America/Manaus", label: "Manaus (GMT-4)" },
  { value: "America/Belem", label: "Belem (GMT-3)" },
  { value: "America/Fortaleza", label: "Fortaleza (GMT-3)" },
  { value: "America/Recife", label: "Recife (GMT-3)" },
  { value: "America/Cuiaba", label: "Cuiaba (GMT-4)" },
  { value: "America/Porto_Velho", label: "Porto Velho (GMT-4)" },
  { value: "America/Rio_Branco", label: "Rio Branco (GMT-5)" },
  { value: "America/Noronha", label: "Noronha (GMT-2)" },
];

const Settings = () => {
  const { toast } = useToast();
  const { user, updateProfile: updateAuthProfile } = useAuthStore();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    mobile_with_country_code: "",
    timezone: "America/Sao_Paulo",
    newPassword: "",
  });

  // Meta API form state
  const [metaForm, setMetaForm] = useState<MetaApiKeys>({
    waba_id: "",
    business_account_id: "",
    access_token: "",
    business_phone_number_id: "",
    app_id: "",
  });

  // WhatsApp Business profile
  const [waProfile, setWaProfile] = useState<WhatsAppBusinessProfile | null>(null);

  // Loading states
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const [isLoadingWaProfile, setIsLoadingWaProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingMeta, setIsSavingMeta] = useState(false);

  // UI states
  const [showToken, setShowToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        mobile_with_country_code: user.mobile_with_country_code || user.mobile || "",
        timezone: user.timezone || "America/Sao_Paulo",
        newPassword: "",
      });
    }
  }, [user]);

  // Fetch Meta API keys
  const fetchMetaKeys = async () => {
    try {
      setIsLoadingMeta(true);
      const response = await settingsService.getMetaKeys();

      if (response.success && response.data) {
        setMetaForm({
          waba_id: response.data.waba_id || "",
          business_account_id: response.data.business_account_id || "",
          access_token: response.data.access_token || "",
          business_phone_number_id: response.data.business_phone_number_id || "",
          app_id: response.data.app_id || "",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar Meta keys:", error);
    } finally {
      setIsLoadingMeta(false);
    }
  };

  // Fetch WhatsApp Business profile
  const fetchWaProfile = async () => {
    try {
      setIsLoadingWaProfile(true);
      const response = await settingsService.fetchWhatsAppProfile();

      if (response.success && response.data) {
        setWaProfile(response.data);
        toast({ title: "Conexao verificada com sucesso!" });
      } else {
        toast({ title: "Erro", description: response.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro ao verificar conexao", variant: "destructive" });
    } finally {
      setIsLoadingWaProfile(false);
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (!profileForm.name || !profileForm.email || !profileForm.mobile_with_country_code) {
      toast({ title: "Preencha os campos obrigatorios", variant: "destructive" });
      return;
    }

    try {
      setIsSavingProfile(true);
      const response = await settingsService.updateProfile(profileForm);

      if (response.success) {
        toast({ title: "Perfil atualizado com sucesso!" });
        // Update auth store
        updateAuthProfile({
          name: profileForm.name,
          email: profileForm.email,
          mobile_with_country_code: profileForm.mobile_with_country_code,
          timezone: profileForm.timezone,
        });
        // Clear password field
        setProfileForm((prev) => ({ ...prev, newPassword: "" }));
      } else {
        toast({ title: "Erro", description: response.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro ao salvar perfil", variant: "destructive" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Save Meta API keys
  const handleSaveMeta = async () => {
    if (
      !metaForm.waba_id ||
      !metaForm.business_account_id ||
      !metaForm.access_token ||
      !metaForm.business_phone_number_id ||
      !metaForm.app_id
    ) {
      toast({ title: "Preencha todos os campos Meta API", variant: "destructive" });
      return;
    }

    try {
      setIsSavingMeta(true);
      const response = await settingsService.updateMetaKeys(metaForm);

      if (response.success) {
        toast({ title: "Credenciais Meta atualizadas!" });
        // Refresh WA profile
        fetchWaProfile();
      } else {
        toast({ title: "Erro", description: response.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro ao salvar credenciais", variant: "destructive" });
    } finally {
      setIsSavingMeta(false);
    }
  };

  useEffect(() => {
    fetchMetaKeys();
  }, []);

  // Check if Meta keys are configured
  const hasMetaKeys = !!(metaForm.access_token && metaForm.business_phone_number_id);

  return (
    <AppLayout
      title="Configuracoes"
      description="Perfil, credenciais WhatsApp e API Keys."
      actions={
        <Button
          className="bg-cta text-white shadow-glow hover:opacity-90"
          onClick={handleSaveProfile}
          disabled={isSavingProfile}
        >
          {isSavingProfile ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar alteracoes
        </Button>
      }
    >
      {/* Profile Card */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5 text-primary" />
            Perfil
          </CardTitle>
          <p className="text-sm text-muted-foreground">Suas informacoes pessoais</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-white">
              Nome *
            </Label>
            <Input
              id="name"
              placeholder="Seu nome"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="rounded-xl border-white/10 bg-[#0f1118] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-white">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="rounded-xl border-white/10 bg-[#0f1118] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm text-white">
              Telefone *
            </Label>
            <Input
              id="phone"
              placeholder="+55 11 99999-9999"
              value={profileForm.mobile_with_country_code}
              onChange={(e) =>
                setProfileForm({ ...profileForm, mobile_with_country_code: e.target.value })
              }
              className="rounded-xl border-white/10 bg-[#0f1118] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-sm text-white">
              Fuso horario
            </Label>
            <Select
              value={profileForm.timezone}
              onValueChange={(v) => setProfileForm({ ...profileForm, timezone: v })}
            >
              <SelectTrigger className="rounded-xl border-white/10 bg-[#0f1118] text-white">
                <SelectValue placeholder="Selecione o fuso horario" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="password" className="text-sm text-white">
              Nova senha (opcional)
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Deixe em branco para manter a atual"
                value={profileForm.newPassword}
                onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                className="rounded-xl border-white/10 bg-[#0f1118] text-white pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta API Keys Card */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-primary" />
              Credenciais Meta API
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure sua integracao com WhatsApp Business API
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasMetaKeys ? (
              <Badge className="bg-success/20 text-success">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Configurado
              </Badge>
            ) : (
              <Badge className="bg-destructive/20 text-destructive">
                <AlertCircle className="mr-1 h-3 w-3" />
                Nao configurado
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingMeta ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="appId" className="text-sm text-white">
                    App ID *
                  </Label>
                  <Input
                    id="appId"
                    placeholder="Ex: 123456789012345"
                    value={metaForm.app_id}
                    onChange={(e) => setMetaForm({ ...metaForm, app_id: e.target.value })}
                    className="rounded-xl border-white/10 bg-[#0f1118] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wabaId" className="text-sm text-white">
                    WABA ID *
                  </Label>
                  <Input
                    id="wabaId"
                    placeholder="WhatsApp Business Account ID"
                    value={metaForm.waba_id}
                    onChange={(e) => setMetaForm({ ...metaForm, waba_id: e.target.value })}
                    className="rounded-xl border-white/10 bg-[#0f1118] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAccountId" className="text-sm text-white">
                    Business Account ID *
                  </Label>
                  <Input
                    id="businessAccountId"
                    placeholder="Meta Business Account ID"
                    value={metaForm.business_account_id}
                    onChange={(e) =>
                      setMetaForm({ ...metaForm, business_account_id: e.target.value })
                    }
                    className="rounded-xl border-white/10 bg-[#0f1118] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneId" className="text-sm text-white">
                    Phone Number ID *
                  </Label>
                  <Input
                    id="phoneId"
                    placeholder="ID do numero de telefone"
                    value={metaForm.business_phone_number_id}
                    onChange={(e) =>
                      setMetaForm({ ...metaForm, business_phone_number_id: e.target.value })
                    }
                    className="rounded-xl border-white/10 bg-[#0f1118] text-white"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="token" className="text-sm text-white">
                    Access Token *
                  </Label>
                  <div className="relative">
                    <Input
                      id="token"
                      type={showToken ? "text" : "password"}
                      placeholder="Token de acesso permanente"
                      value={metaForm.access_token}
                      onChange={(e) => setMetaForm({ ...metaForm, access_token: e.target.value })}
                      className="rounded-xl border-white/10 bg-[#0f1118] text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowToken(!showToken)}
                    >
                      {showToken ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {hasMetaKeys && (
                  <Button
                    variant="outline"
                    onClick={fetchWaProfile}
                    disabled={isLoadingWaProfile}
                    className="border-white/10"
                  >
                    {isLoadingWaProfile ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="mr-2 h-4 w-4" />
                    )}
                    Testar conexao
                  </Button>
                )}
                <Button onClick={handleSaveMeta} disabled={isSavingMeta} className="bg-cta text-white">
                  {isSavingMeta ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Salvar credenciais
                </Button>
              </div>
            </>
          )}

          {/* WhatsApp Business Profile */}
          {waProfile && (
            <>
              <Separator className="bg-white/10" />
              <div className="rounded-xl border border-success/30 bg-success/10 p-4">
                <h4 className="font-medium text-white mb-2">Conexao verificada!</h4>
                <div className="grid gap-2 text-sm">
                  {waProfile.verified_name && (
                    <p className="text-muted-foreground">
                      <span className="text-white">Nome verificado:</span> {waProfile.verified_name}
                    </p>
                  )}
                  {waProfile.display_phone_number && (
                    <p className="text-muted-foreground">
                      <span className="text-white">Numero:</span> {waProfile.display_phone_number}
                    </p>
                  )}
                  {waProfile.quality_rating && (
                    <p className="text-muted-foreground">
                      <span className="text-white">Qualidade:</span> {waProfile.quality_rating}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* API & Integration Info */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <KeyRound className="h-5 w-5 text-primary" />
            API & Integracoes
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Informacoes para integracao externa
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#0c0f16] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <Globe className="h-4 w-4" />
              </span>
              Base URL
            </div>
            <p className="mt-2 text-xs text-muted-foreground font-mono break-all">
              {import.meta.env.VITE_API_URL || "http://localhost:3010/api"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0c0f16] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <KeyRound className="h-4 w-4" />
              </span>
              Autenticacao
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Authorization: Bearer {"<token>"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0c0f16] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </span>
              Webhook
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Configure no Meta Business
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Info */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Smartphone className="h-5 w-5 text-primary" />
            Notificacoes
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configuracoes de alertas e notificacoes
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Mail className="h-4 w-4 text-primary" />
              Email operacional
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Notificacoes de falha e alertas criticos
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Smartphone className="h-4 w-4 text-primary" />
              Push em tempo real
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Socket.io para eventos de mensagens
            </p>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Settings;
