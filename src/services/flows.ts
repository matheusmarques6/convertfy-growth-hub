import api from './api';
import { ApiResponse, FlowNode, FlowEdge } from '@/types/api';

// Interface para BetaFlow (estrutura real do WhatsCRM)
export interface BetaFlow {
  id: number;
  uid: string;
  flow_id: string;
  source: 'wa_chatbot' | 'webhook_flow';
  name: string;
  data: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  is_active: number;
  createdAt: string;
}

// Interface para Flow legado
export interface LegacyFlow {
  id: number;
  uid: string;
  flow_id: string;
  title: string;
  prevent_list?: string;
  ai_list?: string;
  createdAt: string;
}

// Interface para sessão de flow
export interface FlowSession {
  id: number;
  uid: string;
  origin: 'qr' | 'meta' | 'webhook';
  origin_id: string;
  flow_id: string;
  sender_mobile: string;
  data: string; // JSON stringified session state
  createdAt: string;
}

export const flowService = {
  // ===== BETA FLOWS (Sistema novo) =====

  // Listar flows beta por tipo
  async getBetaFlows(type: 'wa_chatbot' | 'webhook_flow' = 'wa_chatbot'): Promise<ApiResponse<BetaFlow[]>> {
    const response = await api.get<ApiResponse<BetaFlow[]>>('/chat_flow/get_flows_beta', {
      params: { type }
    });
    return response.data;
  },

  // Criar ou atualizar flow beta
  async saveBetaFlow(data: {
    name: string;
    flow_id: string;
    source: 'wa_chatbot' | 'webhook_flow';
    data: {
      nodes: FlowNode[];
      edges: FlowEdge[];
    };
  }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/insert_flow_beta', {
      name: data.name,
      flow_id: data.flow_id,
      source: data.source,
      data: data.data,
    });
    return response.data;
  },

  // Deletar flow beta
  async deleteBetaFlow(id: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/del_flow_beta', { id });
    return response.data;
  },

  // ===== LEGACY FLOWS (Sistema antigo) =====

  // Listar flows do usuário (legado)
  async getMyFlows(): Promise<ApiResponse<LegacyFlow[]>> {
    const response = await api.get<ApiResponse<LegacyFlow[]>>('/chat_flow/get_mine');
    return response.data;
  },

  // Buscar nodes e edges de um flow específico (legado)
  async getFlowById(flowId: string): Promise<ApiResponse<{ nodes: FlowNode[]; edges: FlowEdge[] }>> {
    const response = await api.post<ApiResponse<{ nodes: FlowNode[]; edges: FlowEdge[] }>>(
      '/chat_flow/get_by_flow_id',
      { flowId }
    );
    return response.data;
  },

  // Salvar flow legado (nodes + edges em arquivos JSON)
  async saveLegacyFlow(data: {
    title: string;
    flowId: string;
    nodes: FlowNode[];
    edges: FlowEdge[];
  }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/add_new', {
      title: data.title,
      flowId: data.flowId,
      nodes: data.nodes,
      edges: data.edges,
    });
    return response.data;
  },

  // Deletar flow legado
  async deleteLegacyFlow(id: number, flowId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/del_flow', { id, flowId });
    return response.data;
  },

  // ===== FLOW SESSIONS =====

  // Buscar sessões de um flow
  async getFlowSessions(flow_id: string): Promise<ApiResponse<FlowSession[]>> {
    const response = await api.post<ApiResponse<FlowSession[]>>(
      '/chat_flow/get_beta_flow_sessions',
      { flow_id }
    );
    return response.data;
  },

  // Deletar sessão
  async deleteFlowSession(id: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/del_flow_sess', { id });
    return response.data;
  },

  // Deletar múltiplas sessões
  async deleteMultipleFlowSessions(ids: number[]): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/del_multiple_flow_sess', { ids });
    return response.data;
  },

  // Resetar chat desabilitado
  async resetDisabledChat(id: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/reset_dc_sess', { id });
    return response.data;
  },

  // ===== FLOW ACTIVITY =====

  // Buscar atividade do flow (prevent_list e ai_list)
  async getFlowActivity(flowId: string): Promise<ApiResponse<{
    prevent: Array<{ senderNumber: string; id: string }>;
    ai: Array<{ senderNumber: string; id: string }>;
  }>> {
    const response = await api.post<ApiResponse<{
      prevent: Array<{ senderNumber: string; id: string }>;
      ai: Array<{ senderNumber: string; id: string }>;
    }>>('/chat_flow/get_activity', { flowId });
    return response.data;
  },

  // Remover número da atividade
  async removeNumberFromActivity(
    flowId: string,
    number: string,
    type: 'AI' | 'DISABLED'
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/remove_number_from_activity', {
      flowId,
      number,
      type,
    });
    return response.data;
  },

  // ===== TESTING =====

  // Testar requisição HTTP (para nó MAKE_REQUEST)
  async testHttpRequest(data: {
    method: string;
    url: string;
    headers?: Array<{ key: string; value: string }>;
    body?: unknown;
  }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/chat_flow/make_request_try_beta', { data });
    return response.data;
  },

  // Testar conexão MySQL (para nó DATABASE_QUERY)
  async testDatabaseConnection(data: {
    connection: {
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      ssl?: boolean;
    };
    query: string;
  }): Promise<ApiResponse<{ data: unknown[] }>> {
    const response = await api.post<ApiResponse<{ data: unknown[] }>>('/chat_flow/try_con', { data });
    return response.data;
  },

  // ===== HELPERS =====

  // Gerar ID único para flow
  generateFlowId(): string {
    return `flow_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  },

  // Gerar ID único para nó
  generateNodeId(): string {
    return `${Date.now()}`;
  },

  // Criar nó inicial padrão
  createInitialNode(): FlowNode {
    return {
      id: 'initialNode',
      type: 'INITIAL',
      position: { x: 100, y: 300 },
      data: {},
    };
  },
};
