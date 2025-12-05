import api from './api';
import { ApiResponse, Flow, FlowData } from '@/types/api';

export const flowService = {
  // Listar todos os fluxos
  async getFlows(): Promise<ApiResponse<Flow[]>> {
    const response = await api.get<ApiResponse<Flow[]>>('/chat_flow/get');
    return response.data;
  },

  // Obter fluxo específico
  async getFlow(flowId: string): Promise<ApiResponse<Flow & { flow_data: FlowData }>> {
    const response = await api.get<ApiResponse<Flow & { flow_data: FlowData }>>(
      `/chat_flow/get/${flowId}`
    );
    return response.data;
  },

  // Criar novo fluxo
  async createFlow(data: {
    name: string;
    trigger_on?: 'keyword' | 'all' | 'none';
    trigger_value?: string;
    for_meta?: boolean;
    for_qr?: boolean;
    qr_id?: string;
  }): Promise<ApiResponse<{ flow_id: string }>> {
    const response = await api.post<ApiResponse<{ flow_id: string }>>('/chat_flow/add', {
      name: data.name,
      trigger_on: data.trigger_on,
      trigger_value: data.trigger_value,
      for_meta: data.for_meta ? 1 : 0,
      for_qr: data.for_qr ? 1 : 0,
      qr_id: data.qr_id,
    });
    return response.data;
  },

  // Atualizar fluxo (metadados)
  async updateFlow(
    flowId: string,
    data: Partial<{
      name: string;
      active: boolean;
      trigger_on: 'keyword' | 'all' | 'none';
      trigger_value: string;
      for_meta: boolean;
      for_qr: boolean;
      qr_id: string;
    }>
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/update', {
      flow_id: flowId,
      name: data.name,
      active: data.active !== undefined ? (data.active ? 1 : 0) : undefined,
      trigger_on: data.trigger_on,
      trigger_value: data.trigger_value,
      for_meta: data.for_meta !== undefined ? (data.for_meta ? 1 : 0) : undefined,
      for_qr: data.for_qr !== undefined ? (data.for_qr ? 1 : 0) : undefined,
      qr_id: data.qr_id,
    });
    return response.data;
  },

  // Salvar dados do fluxo (nós e conexões)
  async saveFlowData(flowId: string, flowData: FlowData): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/save-data', {
      flow_id: flowId,
      flow_data: JSON.stringify(flowData),
    });
    return response.data;
  },

  // Excluir fluxo
  async deleteFlow(flowId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/delete', { flow_id: flowId });
    return response.data;
  },

  // Duplicar fluxo
  async duplicateFlow(flowId: string, newName: string): Promise<ApiResponse<{ flow_id: string }>> {
    const response = await api.post<ApiResponse<{ flow_id: string }>>('/chat_flow/duplicate', {
      flow_id: flowId,
      name: newName,
    });
    return response.data;
  },

  // Ativar/Desativar fluxo
  async toggleFlow(flowId: string, active: boolean): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/toggle', {
      flow_id: flowId,
      active: active ? 1 : 0,
    });
    return response.data;
  },

  // Obter estatísticas do fluxo
  async getFlowStats(flowId: string): Promise<
    ApiResponse<{
      total_executions: number;
      successful_executions: number;
      failed_executions: number;
      average_duration: number;
    }>
  > {
    const response = await api.get<
      ApiResponse<{
        total_executions: number;
        successful_executions: number;
        failed_executions: number;
        average_duration: number;
      }>
    >(`/chat_flow/stats/${flowId}`);
    return response.data;
  },

  // Testar fluxo (executar em modo de teste)
  async testFlow(
    flowId: string,
    testData: { phone: string; message: string }
  ): Promise<ApiResponse<{ result: unknown }>> {
    const response = await api.post<ApiResponse<{ result: unknown }>>('/chat_flow/test', {
      flow_id: flowId,
      phone: testData.phone,
      message: testData.message,
    });
    return response.data;
  },

  // Obter sessões ativas do fluxo
  async getActiveSessions(flowId: string): Promise<
    ApiResponse<
      Array<{
        session_id: string;
        chat_id: string;
        current_node: string;
        started_at: string;
      }>
    >
  > {
    const response = await api.get<
      ApiResponse<
        Array<{
          session_id: string;
          chat_id: string;
          current_node: string;
          started_at: string;
        }>
      >
    >(`/chat_flow/sessions/${flowId}`);
    return response.data;
  },
};
