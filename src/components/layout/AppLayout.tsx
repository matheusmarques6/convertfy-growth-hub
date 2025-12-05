import { ReactNode, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Bell,
  ChartPie,
  ChevronRight,
  Globe,
  LifeBuoy,
  LineChart,
  LogOut,
  Menu,
  MessageSquare,
  PhoneCall,
  Send,
  Settings,
  Users,
  Workflow,
  Bot,
  Contact,
  Radio,
  BadgePercent,
  ShieldCheck,
  Waypoints,
  PlugZap,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type AppLayoutProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

type NavSection = {
  heading: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    heading: "Principal",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: <ChartPie className="h-4 w-4" /> },
      { label: "Inbox", href: "/inbox", icon: <MessageSquare className="h-4 w-4" /> },
      { label: "Chatbots", href: "/chatbots", icon: <Bot className="h-4 w-4" /> },
      { label: "Flow Builder", href: "/flow/123", icon: <Workflow className="h-4 w-4" /> },
    ],
  },
  {
    heading: "Operação",
    items: [
      { label: "Broadcast", href: "/broadcast", icon: <Send className="h-4 w-4" /> },
      { label: "Contatos", href: "/contacts", icon: <Users className="h-4 w-4" /> },
      { label: "Phonebook", href: "/phonebook", icon: <PhoneCall className="h-4 w-4" /> },
      { label: "Templates", href: "/templates", icon: <FileText className="h-4 w-4" /> },
      { label: "Agentes", href: "/agents", icon: <ShieldCheck className="h-4 w-4" /> },
      { label: "Instâncias QR", href: "/instances", icon: <Radio className="h-4 w-4" /> },
      { label: "Planos", href: "/plans", icon: <BadgePercent className="h-4 w-4" /> },
      { label: "Configurações", href: "/settings", icon: <Settings className="h-4 w-4" /> },
    ],
  },
  {
    heading: "Admin",
    items: [
      { label: "Admin Dashboard", href: "/admin", icon: <LineChart className="h-4 w-4" /> },
      { label: "Usuários", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
      { label: "Planos", href: "/admin/plans", icon: <Waypoints className="h-4 w-4" /> },
      { label: "Configurações", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
    ],
  },
];

const quickActions: NavItem[] = [
  { label: "Nova campanha", href: "/broadcast", icon: <Send className="h-4 w-4" /> },
  { label: "Novo fluxo", href: "/flow/new", icon: <Workflow className="h-4 w-4" /> },
  { label: "Adicionar contato", href: "/contacts", icon: <Contact className="h-4 w-4" /> },
];

export const AppLayout = ({ title, description, actions, children }: AppLayoutProps) => {
  const { pathname } = useLocation();
  const [openMobile, setOpenMobile] = useState(false);

  const activeSection = useMemo(
    () => navSections.find((section) => section.items.some((item) => pathname.startsWith(item.href))),
    [pathname],
  );

  const renderNav = () => (
    <div className="flex h-full flex-col border-r border-white/5 bg-[#0b0d13]">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-white">WhatsCRM</p>
          <p className="text-xs text-muted-foreground">Operação em tempo real</p>
        </div>
        <Badge variant="secondary" className="border border-primary/40 bg-primary/10 text-primary">
          Live
        </Badge>
      </div>
      <Separator className="bg-white/5" />
      <ScrollArea className="flex-1">
        <div className="space-y-8 px-4 py-5">
          {navSections.map((section) => (
            <div key={section.heading} className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                <span>{section.heading}</span>
                {activeSection?.heading === section.heading && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-smooth",
                        "hover:bg-primary/10 hover:text-white",
                        isActive ? "bg-primary/15 text-white shadow-soft border border-primary/30" : "text-muted-foreground",
                      )
                    }
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-primary">
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Separator className="bg-white/5" />
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
          <Globe className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">Status</p>
          <p className="text-xs text-muted-foreground">Conectado à API</p>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="dark bg-[#0A0A0A] text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 lg:block">{renderNav()}</aside>

        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent side="left" className="w-[18rem] border-white/5 bg-[#0b0d13] p-0">
            <SheetHeader className="p-4 pb-2">
              <SheetTitle className="text-white">Navegação</SheetTitle>
            </SheetHeader>
            {renderNav()}
          </SheetContent>
        </Sheet>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white hover:bg-primary/10"
                  onClick={() => setOpenMobile(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <p className="text-xs text-muted-foreground">Workspace</p>
                  <p className="text-base font-semibold text-white">Growth Automation</p>
                </div>
                <Badge variant="secondary" className="border border-primary/30 bg-primary/10 text-primary">
                  SLA 99.9%
                </Badge>
              </div>

              <div className="flex flex-1 items-center justify-end gap-3">
                <div className="relative hidden max-w-sm flex-1 items-center lg:flex">
                  <Input
                    placeholder="Buscar conversas, fluxos ou contatos"
                    className="w-full rounded-xl border-white/10 bg-[#0f1118] text-white placeholder:text-muted-foreground"
                  />
                  <SearchHint />
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl border border-white/5 bg-white/5 text-white">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl border border-white/5 bg-white/5 text-white">
                  <LifeBuoy className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                  <div className="h-9 w-9 rounded-lg bg-primary text-white flex items-center justify-center font-semibold">MC</div>
                  <div className="hidden text-left text-sm lg:block">
                    <p className="font-semibold text-white">Maria Costa</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-white/5 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 px-4 py-2">
              <div className="flex items-center gap-3 overflow-x-auto text-sm text-muted-foreground">
                {quickActions.map((action) => (
                  <NavLink
                    key={action.href}
                    to={action.href}
                    className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-primary transition-smooth hover:border-primary/40 hover:text-white"
                  >
                    {action.icon}
                    {action.label}
                  </NavLink>
                ))}
                <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">
                  <PlugZap className="h-4 w-4 text-primary" />
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">API online</span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 bg-gradient-to-b from-[#0A0A0A] via-[#0b0d13] to-[#0A0A0A] px-4 py-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
              {actions}
            </div>
            <div className="space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

const SearchHint = () => (
  <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-white/5 bg-white/5 px-2 py-1 text-[11px] font-medium text-muted-foreground">
    <span>⌘</span>
    <span>K</span>
  </div>
);
