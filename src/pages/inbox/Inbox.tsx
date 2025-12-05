import { useEffect, useState, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageCircle,
  PhoneCall,
  SendHorizonal,
  Search,
  Sparkles,
  CircleCheck,
  Loader2,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Paperclip,
  Image,
  FileText,
  Mic,
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { useSocket } from "@/hooks/useSocket";
import { Chat, Message } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

// Dados mock para demonstração
const mockChats: Chat[] = [
  {
    id: 1,
    uid: "user1",
    chat_id: "chat1",
    sender_name: "Loja ACME",
    sender_mobile: "+5511999999999",
    last_message: { text: "Enviar proposta com link", type: "text", timestamp: Date.now() / 1000 },
    unread_count: 4,
    origin: "meta",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    uid: "user1",
    chat_id: "chat2",
    sender_name: "Suporte VIP",
    sender_mobile: "+5511988888888",
    last_message: { text: "Ticket #9834 aguardando", type: "text", timestamp: Date.now() / 1000 - 3600 },
    unread_count: 0,
    origin: "qr",
    assigned_agent: "agent1",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    uid: "user1",
    chat_id: "chat3",
    sender_name: "Campanha Black Friday",
    sender_mobile: "+5511977777777",
    last_message: { text: "Fluxo disparado", type: "text", timestamp: Date.now() / 1000 - 86400 },
    unread_count: 12,
    origin: "meta",
    createdAt: new Date().toISOString(),
  },
];

const mockMessages: Message[] = [
  {
    id: 1,
    chat_id: "chat1",
    uid: "user1",
    type: "text",
    msgContext: { text: { body: "Olá, quero saber mais sobre o plano business." } },
    timestamp: Date.now() / 1000 - 180,
    senderName: "Loja ACME",
    senderMobile: "+5511999999999",
    status: "read",
    route: "INCOMING",
    origin: "meta",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    chat_id: "chat1",
    uid: "user1",
    type: "text",
    msgContext: { text: { body: "Claro! Qual segmento da sua empresa?" } },
    timestamp: Date.now() / 1000 - 120,
    senderName: "Bot",
    senderMobile: "",
    status: "delivered",
    route: "OUTGOING",
    origin: "meta",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    chat_id: "chat1",
    uid: "user1",
    type: "text",
    msgContext: { text: { body: "Ecommerce de moda" } },
    timestamp: Date.now() / 1000 - 60,
    senderName: "Loja ACME",
    senderMobile: "+5511999999999",
    status: "read",
    route: "INCOMING",
    origin: "meta",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    chat_id: "chat1",
    uid: "user1",
    type: "text",
    msgContext: { text: { body: "Perfeito! Posso te enviar uma simulação com ticket médio e previsão de disparos?" } },
    timestamp: Date.now() / 1000 - 30,
    senderName: "Agente",
    senderMobile: "",
    status: "delivered",
    route: "OUTGOING",
    origin: "meta",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    chat_id: "chat1",
    uid: "user1",
    type: "text",
    msgContext: { text: { body: "Sim, envie por favor." } },
    timestamp: Date.now() / 1000,
    senderName: "Loja ACME",
    senderMobile: "+5511999999999",
    status: "read",
    route: "INCOMING",
    origin: "meta",
    createdAt: new Date().toISOString(),
  },
];

const Inbox = () => {
  const { toast } = useToast();
  const { connected } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    chats,
    activeChat,
    messages,
    isLoadingChats,
    isLoadingMessages,
    isSendingMessage,
    searchQuery,
    fetchChats,
    setActiveChat,
    setSearchQuery,
    sendTextMessage,
    filteredChats,
  } = useChatStore();

  const [messageText, setMessageText] = useState("");
  const [displayChats, setDisplayChats] = useState<Chat[]>([]);
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);

  // Carregar chats ao montar
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchChats();
      } catch {
        // Usar dados mock se falhar
        console.log("Usando chats de demonstração");
      }
    };
    loadData();
  }, [fetchChats]);

  // Atualizar chats exibidos (reais ou mock)
  useEffect(() => {
    const filtered = filteredChats();
    if (filtered.length > 0) {
      setDisplayChats(filtered);
    } else if (chats.length === 0 && !isLoadingChats) {
      setDisplayChats(mockChats);
    } else {
      setDisplayChats(filtered);
    }
  }, [chats, searchQuery, isLoadingChats, filteredChats]);

  // Atualizar mensagens exibidas (reais ou mock)
  useEffect(() => {
    if (messages.length > 0) {
      setDisplayMessages(messages);
    } else if (activeChat && !isLoadingMessages) {
      setDisplayMessages(mockMessages);
    } else {
      setDisplayMessages([]);
    }
  }, [messages, activeChat, isLoadingMessages]);

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChat) return;

    const text = messageText;
    setMessageText("");

    const success = await sendTextMessage(text);

    if (!success) {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
      setMessageText(text); // Restaurar texto
    }
  };

  // Formatar hora
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Ontem";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("pt-BR", { weekday: "short" });
    } else {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    }
  };

  // Ícone de status da mensagem
  const StatusIcon = ({ status }: { status: Message["status"] }) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case "failed":
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  // Status do chat
  const getChatStatus = (chat: Chat): "online" | "handover" | "bot" => {
    if (chat.assigned_agent) return "handover";
    return "online";
  };

  return (
    <AppLayout
      title="Inbox"
      description="Central de conversas com bots, agentes e integrações em tempo real."
      actions={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${connected ? "bg-success animate-pulse" : "bg-destructive"}`} />
            <span className="text-xs text-muted-foreground">{connected ? "Conectado" : "Offline"}</span>
          </div>
          <Button variant="outline" className="border-white/10 bg-white/5 text-white">
            Nova tag
          </Button>
          <Button className="bg-cta text-white shadow-glow hover:opacity-90">Nova conversa</Button>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[360px,1fr]">
        {/* Lista de Chats */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Chats</CardTitle>
              <Badge className="bg-primary/20 text-primary">
                {displayChats.reduce((acc, c) => acc + c.unread_count, 0)} não lidas
              </Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar contato ou tag"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-white/10 bg-[#0f1118] pl-10 text-white placeholder:text-muted-foreground"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[520px]">
              <div className="space-y-1">
                {isLoadingChats ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="border-b border-white/5 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                          <div className="flex-1">
                            <Skeleton className="mb-2 h-4 w-24 bg-white/10" />
                            <Skeleton className="h-3 w-32 bg-white/10" />
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  displayChats.map((chat) => (
                    <button
                      key={chat.chat_id}
                      onClick={() => setActiveChat(chat)}
                      className={cn(
                        "w-full text-left transition-all duration-200",
                        "border-b border-white/5 px-4 py-3 hover:bg-white/5",
                        chat.unread_count > 0 && "bg-primary/5",
                        activeChat?.chat_id === chat.chat_id && "bg-primary/10 border-l-2 border-l-primary"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {chat.sender_name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-white">{chat.sender_name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {chat.last_message?.text || "Sem mensagens"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <p>{chat.last_message?.timestamp ? formatTime(chat.last_message.timestamp) : ""}</p>
                          {chat.unread_count > 0 && (
                            <span className="mt-1 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-primary/20 px-2 text-primary">
                              {chat.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <Badge className="border-white/10 bg-white/5 text-muted-foreground">
                          {chat.origin === "meta" ? "#meta" : "#qr"}
                        </Badge>
                        <StatusPill status={getChatStatus(chat)} />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Área de Conversa */}
        <Card className="border-white/10 bg-white/5">
          {activeChat ? (
            <>
              <CardHeader className="flex flex-col gap-3 border-b border-white/5 pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-success/20 text-success">
                      {activeChat.sender_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-white">
                      {activeChat.origin === "meta" ? "WhatsApp" : "QR"} · {activeChat.sender_name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{activeChat.sender_mobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={activeChat.origin === "meta" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"}>
                    {activeChat.origin === "meta" ? "Meta API" : "QR Code"}
                  </Badge>
                  <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white">
                    Transferir
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid min-h-[520px] grid-rows-[1fr,auto]">
                  {/* Mensagens */}
                  <ScrollArea className="p-4">
                    <div className="space-y-4">
                      {isLoadingMessages ? (
                        Array(3)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                              <Skeleton className="h-16 w-48 rounded-2xl bg-white/10" />
                            </div>
                          ))
                      ) : (
                        displayMessages.map((message) => (
                          <div
                            key={message.id}
                            className={cn("flex w-full", message.route === "INCOMING" ? "justify-start" : "justify-end")}
                          >
                            <div
                              className={cn(
                                "max-w-[70%] rounded-2xl px-4 py-3 text-sm text-white shadow-soft",
                                message.route === "INCOMING" && "border border-white/10 bg-white/5",
                                message.route === "OUTGOING" && "border border-primary/20 bg-primary/10"
                              )}
                            >
                              <p>{message.msgContext?.text?.body}</p>
                              <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                                <span>{formatTime(message.timestamp)}</span>
                                {message.route === "OUTGOING" && <StatusIcon status={message.status} />}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input de Mensagem */}
                  <div className="border-t border-white/5 bg-[#0c0f16] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <CircleCheck className="h-3.5 w-3.5 text-primary" />
                      Conectado via {activeChat.origin === "meta" ? "Meta Cloud API" : "QR Code (Baileys)"}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-white">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-white">
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-white">
                          <Mic className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                        disabled={isSendingMessage}
                        className="flex-1 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-muted-foreground"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isSendingMessage || !messageText.trim()}
                        className="rounded-xl bg-cta text-white shadow-glow hover:opacity-90"
                      >
                        {isSendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <SendHorizonal className="mr-2 h-4 w-4" />
                            Enviar
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <Badge className="cursor-pointer bg-primary/20 text-primary hover:bg-primary/30">Template Meta</Badge>
                      <Badge className="cursor-pointer bg-primary/10 text-white hover:bg-primary/20">Anexar mídia</Badge>
                      <Badge className="cursor-pointer bg-white/5 text-muted-foreground hover:bg-white/10">Inserir variável</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex min-h-[520px] flex-col items-center justify-center">
              <MessageCircle className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <p className="text-lg font-medium text-white">Selecione uma conversa</p>
              <p className="text-sm text-muted-foreground">Escolha um chat na lista para começar</p>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Omnichannel Status */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">Omnichannel</CardTitle>
            <p className="text-sm text-muted-foreground">Controle de canais e handover automático</p>
          </div>
          <Badge className={connected ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}>
            {connected ? "Socket.IO Conectado" : "Socket.IO Desconectado"}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Escuta de novos eventos", detail: "socket.on('new_message')", icon: <MessageCircle className="h-4 w-4" /> },
            { label: "Toque e alerta sonoro", detail: "socket.on('ring')", icon: <Sparkles className="h-4 w-4" /> },
            { label: "Handover e status", detail: "socket.on('message_status')", icon: <PhoneCall className="h-4 w-4" /> },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/10 bg-[#0c0f16] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  {item.icon}
                </span>
                {item.label}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppLayout>
  );
};

const StatusPill = ({ status }: { status: "online" | "handover" | "bot" }) => {
  const label = status === "online" ? "Online" : status === "handover" ? "Handover" : "Bot ativo";
  const tone =
    status === "online"
      ? "bg-success/20 text-success"
      : status === "handover"
        ? "bg-primary/20 text-primary"
        : "bg-white/10 text-white";
  return <span className={cn("rounded-full px-3 py-1 text-xs", tone)}>{label}</span>;
};

export default Inbox;
