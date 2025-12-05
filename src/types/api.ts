// Resposta padrão da API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  msg?: string;
  logout?: boolean;
}

// Usuário
export interface User {
  id: number;
  uid: string;
  name: string;
  email: string;
  mobile?: string;
  profile?: string;
  role: 'user' | 'admin' | 'agent';
  plan?: string;
  plan_expire?: string;
  timezone?: string;
  createdAt: string;
}

// Chat
export interface Chat {
  id: number;
  uid: string;
  chat_id: string;
  sender_name: string;
  sender_mobile: string;
  last_message?: {
    text?: string;
    type?: string;
    timestamp?: number;
  };
  unread_count: number;
  origin: 'meta' | 'qr';
  assigned_agent?: string;
  chat_label?: string;
  chat_note?: string;
  createdAt: string;
}

// Mensagem
export interface Message {
  id: number;
  chat_id: string;
  uid: string;
  type: 'text' | 'image' | 'video' | 'document' | 'audio' | 'location' | 'interactive';
  metaChatId?: string;
  msgContext: {
    text?: { body: string };
    image?: { link: string; caption?: string };
    video?: { link: string; caption?: string };
    document?: { link: string; filename?: string };
    audio?: { link: string };
  };
  reaction?: string;
  timestamp: number;
  senderName: string;
  senderMobile: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  route: 'INCOMING' | 'OUTGOING';
  origin: 'meta' | 'qr';
  createdAt: string;
}

// Chatbot
export interface Chatbot {
  id: number;
  uid: string;
  name: string;
  flow_id?: string;
  active: 0 | 1;
  for_all: 0 | 1;
  chats?: string;
  createdAt: string;
}

// Flow
export interface Flow {
  id: number;
  flow_id: string;
  uid: string;
  name: string;
  active: 0 | 1;
  trigger_on?: string;
  trigger_value?: string;
  for_meta: 0 | 1;
  for_qr: 0 | 1;
  qr_id?: string;
  createdAt: string;
}

// Flow Data (nós do fluxo)
export interface FlowNode {
  id: string;
  type: 'SEND_MESSAGE' | 'CONDITION' | 'RESPONSE_SAVER' | 'MAKE_REQUEST' | 'SEND_EMAIL' |
        'ADD_TO_PHONEBOOK' | 'ADD_TAGS' | 'ADD_NOTE' | 'ASSIGN_AGENT' | 'PAUSE' | 'JUMP';
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface FlowData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

// Campaign
export interface Campaign {
  id: number;
  uid: string;
  name: string;
  template_name?: string;
  template_data?: string;
  phonebook_id?: number;
  status: 'draft' | 'pending' | 'running' | 'paused' | 'completed' | 'cancelled';
  scheduled_at?: string;
  timezone?: string;
  total_contacts: number;
  sent_count: number;
  delivered_count: number;
  read_count: number;
  failed_count: number;
  createdAt: string;
}

// Contact
export interface Contact {
  id: number;
  uid: string;
  name: string;
  mobile: string;
  email?: string;
  var1?: string;
  var2?: string;
  var3?: string;
  var4?: string;
  var5?: string;
  createdAt: string;
}

// Phonebook (Lista de Contatos)
export interface Phonebook {
  id: number;
  uid: string;
  name: string;
  contact_count?: number;
  createdAt: string;
}

// Agent
export interface Agent {
  id: number;
  uid: string;
  owner_uid: string;
  name: string;
  email: string;
  mobile?: string;
  role: 'agent';
  logged_in_today?: number;
  last_login?: string;
  time_spent_today?: number;
  createdAt: string;
}

// Instance (QR WhatsApp)
export interface Instance {
  id: number;
  uid: string;
  instance_id: string;
  name: string;
  phone_number?: string;
  status: 'connected' | 'disconnected' | 'connecting';
  qr_code?: string;
  webhook_url?: string;
  createdAt: string;
}

// Meta API (WhatsApp Business API)
export interface MetaApi {
  id: number;
  uid: string;
  waba_id: string;
  phone_id: string;
  bussiness_id: string;
  access_token: string;
  webhook_token: string;
  app_id?: string;
  active: 0 | 1;
  createdAt: string;
}

// Template (Meta Templates)
export interface Template {
  id: string;
  name: string;
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  components: TemplateComponent[];
}

export interface TemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  buttons?: TemplateButton[];
}

export interface TemplateButton {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
  text: string;
  url?: string;
  phone_number?: string;
}

// Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  mobile?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  msg?: string;
}

// Plan
export interface Plan {
  id: number;
  name: string;
  price: number;
  validity_days: number;
  contacts: number;
  chatbots: number;
  flows: number;
  broadcast: number;
  meta_api: 0 | 1;
  qr_instances: number;
  agents: number;
  ai_integration: 0 | 1;
  features?: string;
  createdAt: string;
}

// Order (Pedido/Pagamento)
export interface Order {
  id: number;
  uid: string;
  plan_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  transaction_id?: string;
  createdAt: string;
}

// Chat Tag
export interface ChatTag {
  id: number;
  uid: string;
  name: string;
  color?: string;
  createdAt: string;
}

// Agent Task
export interface AgentTask {
  id: number;
  uid: string;
  agent_uid: string;
  chat_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
  createdAt: string;
}

// Warmer (Aquecimento de Número)
export interface Warmer {
  id: number;
  uid: string;
  instance_id: string;
  phone_number: string;
  status: 'active' | 'paused' | 'completed';
  messages_sent: number;
  messages_received: number;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  total_contacts: number;
  total_chats: number;
  total_messages: number;
  active_chatbots: number;
  active_campaigns: number;
  connected_instances: number;
  messages_today: number;
  new_contacts_today: number;
}

// Socket Events Types
export interface SocketNewMessage {
  chat_id: string;
  message: Message;
  chat: Partial<Chat>;
}

export interface SocketMessageStatus {
  messageId: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface SocketQRCode {
  qrCode: string;
  instanceId: string;
}

export interface SocketQRConnected {
  instanceId: string;
  phoneNumber?: string;
}

export interface SocketQRDisconnected {
  instanceId: string;
  reason?: string;
}
