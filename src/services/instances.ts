import api from './api';
import { ApiResponse } from '@/types/api';

// Interface para instância do backend real
export interface QRInstance {
  id: number;
  uid: string;
  title: string;
  uniqueId: string;
  number?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'GENERATING';
  other?: string;
  createdAt: string;
}

export const instanceService = {
  // ==================== INSTÂNCIAS QR ====================

  // Listar todas as instâncias
  async getInstances(): Promise<ApiResponse<QRInstance[]>> {
    const response = await api.get<ApiResponse<QRInstance[]>>('/qr/get_all');
    return response.data;
  },

  // Criar nova instância e gerar QR
  async createInstance(data: {
    title: string;
    uniqueId: string;
  }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/qr/gen_qr', data);
    return response.data;
  },

  // Excluir instância
  async deleteInstance(uniqueId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/qr/del_instance', { uniqueId });
    return response.data;
  },

  // Mudar status da instância (available/unavailable)
  async changeStatus(insId: string, status: 'available' | 'unavailable'): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/qr/change_instance_status', {
      insId,
      status,
    });
    return response.data;
  },

  // ==================== ENVIO DE MENSAGENS ====================

  // Enviar mensagem de texto via QR
  async sendText(instanceId: string, phone: string, text: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/qr/send-text', {
      instance_id: instanceId,
      phone,
      text,
    });
    return response.data;
  },

  // Enviar mídia via QR
  async sendMedia(
    instanceId: string,
    phone: string,
    type: 'image' | 'video' | 'document' | 'audio',
    mediaUrl: string,
    caption?: string
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/qr/send-media', {
      instance_id: instanceId,
      phone,
      type,
      media_url: mediaUrl,
      caption,
    });
    return response.data;
  },

  // Enviar localização via QR
  async sendLocation(
    instanceId: string,
    phone: string,
    latitude: number,
    longitude: number,
    title?: string
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/qr/send-location', {
      instance_id: instanceId,
      phone,
      latitude,
      longitude,
      title,
    });
    return response.data;
  },

  // Enviar botões via QR
  async sendButtons(
    instanceId: string,
    phone: string,
    text: string,
    buttons: Array<{ id: string; text: string }>
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/qr/send-buttons', {
      instance_id: instanceId,
      phone,
      text,
      buttons,
    });
    return response.data;
  },

  // Enviar lista via QR
  async sendList(
    instanceId: string,
    phone: string,
    text: string,
    buttonText: string,
    sections: Array<{
      title: string;
      rows: Array<{ id: string; title: string; description?: string }>;
    }>
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/qr/send-list', {
      instance_id: instanceId,
      phone,
      text,
      button_text: buttonText,
      sections,
    });
    return response.data;
  },

  // ==================== CONFIGURAÇÕES ====================

  // Configurar webhook
  async setWebhook(instanceId: string, webhookUrl: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/qr/set-webhook', {
      instance_id: instanceId,
      webhook_url: webhookUrl,
    });
    return response.data;
  },

  // Obter informações do perfil WhatsApp
  async getProfileInfo(instanceId: string): Promise<
    ApiResponse<{
      name: string;
      phone: string;
      profile_picture?: string;
      status?: string;
    }>
  > {
    const response = await api.get<
      ApiResponse<{
        name: string;
        phone: string;
        profile_picture?: string;
        status?: string;
      }>
    >(`/qr/profile/${instanceId}`);
    return response.data;
  },

  // ==================== WARMER (Aquecimento) ====================

  // Iniciar aquecimento
  async startWarmer(instanceId: string, phone: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/qr/start-warmer', {
      instance_id: instanceId,
      phone,
    });
    return response.data;
  },

  // Pausar aquecimento
  async pauseWarmer(warmerId: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/qr/pause-warmer', { id: warmerId });
    return response.data;
  },

  // Obter status do aquecimento
  async getWarmerStatus(instanceId: string): Promise<
    ApiResponse<{
      status: 'active' | 'paused' | 'completed';
      messages_sent: number;
      messages_received: number;
    }>
  > {
    const response = await api.get<
      ApiResponse<{
        status: 'active' | 'paused' | 'completed';
        messages_sent: number;
        messages_received: number;
      }>
    >(`/qr/warmer-status/${instanceId}`);
    return response.data;
  },
};
