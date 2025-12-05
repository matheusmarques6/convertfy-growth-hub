import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ShieldCheck, Zap, Bot, Workflow } from "lucide-react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  sideNote?: ReactNode;
};

const highlights = [
  { icon: <ShieldCheck className="h-4 w-4" />, label: "Segurança enterprise" },
  { icon: <Zap className="h-4 w-4" />, label: "Entrega em segundos" },
  { icon: <Bot className="h-4 w-4" />, label: "Chatbots inteligentes" },
  { icon: <Workflow className="h-4 w-4" />, label: "Fluxos drag-and-drop" },
];

export const AuthLayout = ({ title, subtitle, children, footer, sideNote }: AuthLayoutProps) => {
  return (
    <div className="dark min-h-screen bg-[#0A0A0A] text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-10 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-white shadow-glow">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">WhatsCRM</p>
              <p className="text-xs text-muted-foreground">Automação & Inbox Omnichannel</p>
            </div>
          </div>
          <Badge className="border border-primary/30 bg-primary/10 text-primary">Disponível 24/7</Badge>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-[#0b0d13] to-[#0A0A0A] p-8 shadow-strong">
            <div className="pointer-events-none absolute inset-0 opacity-60 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
            <div className="relative space-y-4">
              <Badge variant="secondary" className="border border-white/10 bg-white/5 text-white">
                SaaS B2B · Modo escuro
              </Badge>
              <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
              <p className="text-base text-muted-foreground md:text-lg">{subtitle}</p>
              <Separator className="bg-white/10" />
              <div className="grid grid-cols-2 gap-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-muted-foreground"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                ))}
              </div>
              {sideNote && <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary">{sideNote}</div>}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0f16] p-6 shadow-medium">
            <div className="space-y-6">{children}</div>
            {footer && <div className={cn("mt-6 text-sm text-muted-foreground", "flex items-center justify-between")}>{footer}</div>}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/5 bg-white/5 px-3 py-1">React + Vite</span>
            <span className="rounded-full border border-white/5 bg-white/5 px-3 py-1">Tailwind + shadcn/ui</span>
            <span className="rounded-full border border-white/5 bg-white/5 px-3 py-1">Socket.io pronto</span>
          </div>
          <Link to="/" className="text-primary hover:text-white">
            Voltar para a Landing
          </Link>
        </div>
      </div>
    </div>
  );
};
