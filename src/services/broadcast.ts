import api from './api';
import { ApiResponse } from '@/types/api';

// Interface para campanha
export interface CampaignData {
  id: number;
  campaign_id: string;
  broadcast_id?: string;
  uid: string;
  title: string;
  template_name?: string;
  template_language?: string;
  templet?: string; // JSON string
  phonebook?: string; // JSON string
  phonebook_id?: number;
  phonebook_name?: string;
  status: 'PENDING' | 'QUEUE' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  total_contacts: number;
  sent_count: number;
  delivered_count: number;
  read_count: number;
  failed_count: number;
  schedule?: string;
  timezone?: string;
  body_variables?: string;
  header_variable?: string;
  button_variables?: string;
  createdAt: string;
}

// Interface para log de campanha
export interface CampaignLog {
  id: number;
  campaign_id?: string;
  broadcast_id?: string;
  uid: string;
  templet_name?: string;
  sender_mobile?: string;
  send_to: string;
  contact_name?: string;
  contact_mobile?: string;
  contact?: string; // JSON string
  example?: string; // JSON string
  status?: string;
  delivery_status: 'PENDING' | 'sent' | 'delivered' | 'read' | 'failed';
  error_message?: string;
  delivery_time?: string;
  createdAt: string;
}

// Interface para stats do dashboard
export interface DashboardStats {
  totalCampaigns: number;
  messageStats: {
    sent: number;
    delivered: number;
    read: number;
    failed: number;
  };
  campaignsByStatus: Array<{ status: string; count: number }>;
  dailyStats: Array<{
    date: string;
    total_messages: number;
    sent: number;
    delivered: number;
    read: number;
  }>;
  recentCampaigns: CampaignData[];
}

// Interface para criar campanha
export interface CreateCampaignData {
  campaign_title: string;
  template_name: string;
  template_language: string;
  phonebook_id: number;
  body_variables?: string[];
  header_variable?: string | null;
  button_variables?: string[];
  schedule?: string | null;
  timezone?: string | null;
}

export const broadcastService = {
  // ==================== CAMPANHAS ====================

  // Listar todas as campanhas (beta API)
  async getCampaigns(): Promise<ApiResponse<CampaignData[]>> {
    const response = await api.get<ApiResponse<CampaignData[]>>('/broadcast/get_campaigns');
    return response.data;
  },

  // Obter campanhas com stats
  async getCampaignsWithStats(): Promise<{ success: boolean; campaigns: CampaignData[] }> {
    const response = await api.get<{ success: boolean; campaigns: CampaignData[] }>('/broadcast/campaigns');
    return response.data;
  },

  // Listar campanhas antigas
  async getBroadcasts(): Promise<ApiResponse<CampaignData[]>> {
    const response = await api.get<ApiResponse<CampaignData[]>>('/broadcast/get_broadcast');
    return response.data;
  },

  // Criar nova campanha (beta API)
  async createCampaign(data: CreateCampaignData): Promise<ApiResponse<{ campaignId: string }>> {
    const response = await api.post<ApiResponse<{ campaignId: string }>>('/broadcast/create_template_campaign', data);
    return response.data;
  },

  // Obter detalhes da campanha
  async getCampaignDetails(campaignId: string): Promise<ApiResponse<{ campaign: CampaignData; logs: CampaignLog[] }>> {
    const response = await api.get<ApiResponse<{ campaign: CampaignData; logs: CampaignLog[] }>>(`/broadcast/get_campaign_details/${campaignId}`);
    return response.data;
  },

  // Obter campanha com stats e logs
  async getCampaignWithStats(campaignId: string): Promise<{
    success: boolean;
    campaign: CampaignData;
    stats: Array<{ status: string; delivery_status: string; count: number; hour: string }>;
    logs: CampaignLog[];
  }> {
    const response = await api.get<{
      success: boolean;
      campaign: CampaignData;
      stats: Array<{ status: string; delivery_status: string; count: number; hour: string }>;
      logs: CampaignLog[];
    }>(`/broadcast/campaign/${campaignId}`);
    return response.data;
  },

  // Alterar status da campanha
  async changeCampaignStatus(broadcastId: string, status: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/broadcast/change_broadcast_status', {
      broadcast_id: broadcastId,
      status,
    });
    return response.data;
  },

  // Excluir campanha (beta)
  async deleteCampaign(campaignId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/broadcast/del_campaign', { id: campaignId });
    return response.data;
  },

  // Excluir broadcast (API antiga)
  async deleteBroadcast(broadcastId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/broadcast/del_broadcast', { broadcast_id: broadcastId });
    return response.data;
  },

  // ==================== DASHBOARD ====================

  // Obter estatisticas do dashboard
  async getDashboardStats(): Promise<{ success: boolean } & DashboardStats> {
    const response = await api.get<{ success: boolean } & DashboardStats>('/broadcast/dashboard');
    return response.data;
  },

  // ==================== LOGS ====================

  // Obter logs da campanha (API antiga)
  async getBroadcastLogs(broadcastId: string): Promise<ApiResponse & {
    data: CampaignLog[];
    totalLogs: number;
    getSent: number;
    totalDelivered: number;
    totalRead: number;
    totalFailed: number;
    totalPending: number;
  }> {
    const response = await api.post<ApiResponse & {
      data: CampaignLog[];
      totalLogs: number;
      getSent: number;
      totalDelivered: number;
      totalRead: number;
      totalFailed: number;
      totalPending: number;
    }>('/broadcast/get_broadcast_logs', { id: broadcastId });
    return response.data;
  },

  // ==================== EXPORTAR ====================

  // Exportar logs para CSV
  async exportCampaignCSV(campaignId: string): Promise<Blob> {
    const response = await api.get(`/broadcast/export/${campaignId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
