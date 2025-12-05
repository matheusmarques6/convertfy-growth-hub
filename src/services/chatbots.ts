import api from './api';
import { ApiResponse } from '@/types/api';

// Interface para chatbot do backend
export interface ChatbotData {
  id: number;
  uid: string;
  title: string;
  flow_id: string;
  origin: string; // JSON string
  origin_id: string;
  active: 0 | 1;
  source?: string;
  createdAt: string;
}

// Interface para flow do backend
export interface FlowData {
  id: number;
  uid: string;
  flow_id: string;
  title: string;
  data?: string; // JSON string com nodes e edges
  active: 0 | 1;
  createdAt: string;
}

export const chatbotService = {
  // Listar todos os chatbots (beta)
  async getChatbots(type: string = 'chatbot'): Promise<ApiResponse<ChatbotData[]>> {
    const response = await api.get<ApiResponse<ChatbotData[]>>('/chatbot/get_beta_chatbots', {
      params: { type }
    });
    return response.data;
  },

  // Criar novo chatbot (beta)
  async createChatbot(data: {
    title: string;
    origin: {
      code: 'META' | 'QR';
      title: string;
      data?: { uniqueId?: string };
    };
    flow: {
      id: string;
      flow_id: string;
    };
  }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chatbot/add_beta_chatbot', data);
    return response.data;
  },

  // Excluir chatbot (beta)
  async deleteChatbot(id: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chatbot/del_beta_chatbot', { id });
    return response.data;
  },

  // Ativar/Desativar chatbot (beta)
  async toggleChatbot(id: number, status: boolean): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chatbot/change_beta_bot_status', {
      id,
      status,
    });
    return response.data;
  },

  // Listar fluxos disponíveis
  async getFlows(): Promise<ApiResponse<FlowData[]>> {
    const response = await api.get<ApiResponse<FlowData[]>>('/chat_flow/get_all');
    return response.data;
  },
};
