import api from './api';
import { ApiResponse } from '@/types/api';

// Interface para chatbot legado
export interface LegacyChatbot {
  id: number;
  uid: string;
  title: string;
  for_all: 0 | 1;
  chats: string; // JSON stringified array
  flow: string; // JSON stringified flow object
  flow_id: string;
  active: 0 | 1;
  origin: string; // JSON stringified origin object
  createdAt: string;
}

// Interface para chatbot beta (novo sistema)
export interface BetaChatbot {
  id: number;
  uid: string;
  title: string;
  flow_id: string;
  origin: string; // JSON stringified: { code: 'META' | 'QR', title: string, data?: { uniqueId?: string } }
  origin_id: string;
  source?: string;
  active: 0 | 1;
  createdAt: string;
}

// Interface para origem do chatbot
export interface ChatbotOrigin {
  code: 'META' | 'QR';
  title: string;
  data?: {
    uniqueId?: string;
  };
}

// Interface para flow reference
export interface ChatbotFlowRef {
  id: number;
  flow_id: string;
}

export const chatbotService = {
  // ===== BETA CHATBOTS (Sistema novo) =====

  // Listar chatbots beta
  async getBetaChatbots(type: string = 'chatbot'): Promise<ApiResponse<BetaChatbot[]>> {
    const response = await api.get<ApiResponse<BetaChatbot[]>>('/chatbot/get_beta_chatbots', {
      params: { type }
    });
    return response.data;
  },

  // Criar chatbot beta
  async createBetaChatbot(data: {
    title: string;
    origin: ChatbotOrigin;
    flow: ChatbotFlowRef;
  }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chatbot/add_beta_chatbot', data);
    return response.data;
  },

  // Alterar status do chatbot beta
  async toggleBetaChatbot(id: number, status: boolean): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chatbot/change_beta_bot_status', {
      id,
      status,
    });
    return response.data;
  },

  // Deletar chatbot beta
  async deleteBetaChatbot(id: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chatbot/del_beta_chatbot', { id });
    return response.data;
  },

  // ===== LEGACY CHATBOTS (Sistema antigo) =====

  // Listar chatbots legados
  async getLegacyChatbots(): Promise<ApiResponse<LegacyChatbot[]>> {
    const response = await api.get<ApiResponse<LegacyChatbot[]>>('/chatbot/get_chatbot');
    return response.data;
  },

  // Criar chatbot legado
  async createLegacyChatbot(data: {
    title: string;
    chats: string[]; // Array de chat_ids
    flow: { id: number; flow_id: string; title: string };
    for_all: boolean;
    origin?: ChatbotOrigin;
  }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chatbot/add_chatbot', {
      title: data.title,
      chats: data.chats,
      flow: data.flow,
      for_all: data.for_all,
      origin: data.origin || { code: 'META', title: 'Meta' },
    });
    return response.data;
  },

  // Atualizar chatbot legado
  async updateLegacyChatbot(data: {
    id: number;
    title: string;
    chats: string[];
    flow: { id: number; flow_id: string; title: string };
    for_all: boolean;
    origin?: ChatbotOrigin;
  }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chatbot/update_chatbot', {
      id: data.id,
      title: data.title,
      chats: data.chats,
      flow: data.flow,
      for_all: data.for_all,
      origin: data.origin || { code: 'META', title: 'Meta' },
    });
    return response.data;
  },

  // Alterar status do chatbot legado
  async toggleLegacyChatbot(id: number, status: boolean): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chatbot/change_bot_status', {
      id,
      status,
    });
    return response.data;
  },

  // Deletar chatbot legado
  async deleteLegacyChatbot(id: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chatbot/del_chatbot', { id });
    return response.data;
  },

  // ===== UTILITIES =====

  // Testar requisição HTTP (para nós MAKE_REQUEST)
  async testHttpRequest(data: {
    url: string;
    type: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
  }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chatbot/make_request_api', data);
    return response.data;
  },

  // ===== HELPERS =====

  // Parse origin string to object
  parseOrigin(originStr: string): ChatbotOrigin {
    try {
      return JSON.parse(originStr);
    } catch {
      return { code: 'META', title: 'Meta' };
    }
  },

  // Parse chats string to array
  parseChats(chatsStr: string): string[] {
    try {
      return JSON.parse(chatsStr);
    } catch {
      return [];
    }
  },

  // Parse flow string to object
  parseFlow(flowStr: string): { id: number; flow_id: string; title: string } | null {
    try {
      return JSON.parse(flowStr);
    } catch {
      return null;
    }
  },
};
