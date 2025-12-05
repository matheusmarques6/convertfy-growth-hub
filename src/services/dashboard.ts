import api from './api';
import { ApiResponse, DashboardStats} from '@/types/api';

export interface DashboardMetrics {
  messagesDelivered: number;
  messagesDeliveredDelta: number;
  responsesReceived: number;
  responsesReceivedDelta: number;
  activeChatbots: number;
  activeChatbotsDelta: number;
  csatAverage: number;
  csatDelta: number;
}

export interface PipelineInfo {
  id: number;
  name: string;
  progress: number;
  status: 'online' | 'paused' | 'error';
  type: string;
}

export interface PerformanceMetrics {
  openRate: number;
  openRateDelta: number;
  avgResponseTime: string;
  avgResponseTimeDelta: number;
  deliveryRate: number;
  deliveryRateDelta: number;
  weeklyData: number[];
}

export interface AlertInfo {
  id: number;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  createdAt: string;
}

export const dashboardService = {
  // Obter estatísticas gerais do dashboard
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await api.get<ApiResponse<DashboardStats>>('/user/dashboard-stats');
    return response.data;
  },

  // Obter métricas do dashboard
  async getMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    const response = await api.get<ApiResponse<DashboardMetrics>>('/user/dashboard-metrics');
    return response.data;
  },

  // Obter pipelines ativos
  async getPipelines(): Promise<ApiResponse<PipelineInfo[]>> {
    const response = await api.get<ApiResponse<PipelineInfo[]>>('/user/dashboard-pipelines');
    return response.data;
  },

  // Obter métricas de performance (últimos 7 dias)
  async getPerformance(): Promise<ApiResponse<PerformanceMetrics>> {
    const response = await api.get<ApiResponse<PerformanceMetrics>>('/user/dashboard-performance');
    return response.data;
  },

  // Obter alertas ativos
  async getAlerts(): Promise<ApiResponse<AlertInfo[]>> {
    const response = await api.get<ApiResponse<AlertInfo[]>>('/user/dashboard-alerts');
    return response.data;
  },

  // Obter resumo de atividades recentes
  async getRecentActivity(): Promise<
    ApiResponse<
      Array<{
        id: number;
        type: 'message' | 'campaign' | 'chatbot' | 'flow';
        description: string;
        timestamp: string;
      }>
    >
  > {
    const response = await api.get<
      ApiResponse<
        Array<{
          id: number;
          type: 'message' | 'campaign' | 'chatbot' | 'flow';
          description: string;
          timestamp: string;
        }>
      >
    >('/user/recent-activity');
    return response.data;
  },
};
