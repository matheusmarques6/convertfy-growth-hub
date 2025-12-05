import api from './api';
import { ApiResponse, Agent, AgentTask, Chat } from '@/types/api';

export const agentService = {
  // ==================== AGENTES ====================

  // Listar todos os agentes
  async getAgents(): Promise<ApiResponse<Agent[]>> {
    const response = await api.get<ApiResponse<Agent[]>>('/agent/get-agents');
    return response.data;
  },

  // Obter agente específico
  async getAgent(uid: string): Promise<ApiResponse<Agent>> {
    const response = await api.get<ApiResponse<Agent>>(`/agent/get/${uid}`);
    return response.data;
  },

  // Criar novo agente
  async createAgent(data: {
    name: string;
    email: string;
    password: string;
    mobile?: string;
  }): Promise<ApiResponse<Agent>> {
    const response = await api.post<ApiResponse<Agent>>('/agent/add', data);
    return response.data;
  },

  // Atualizar agente
  async updateAgent(
    uid: string,
    data: Partial<{
      name: string;
      email: string;
      mobile: string;
    }>
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/agent/update', {
      uid,
      ...data,
    });
    return response.data;
  },

  // Excluir agente
  async deleteAgent(uid: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/agent/delete', { uid });
    return response.data;
  },

  // Redefinir senha do agente
  async resetAgentPassword(uid: string, newPassword: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/agent/reset-password', {
      uid,
      password: newPassword,
    });
    return response.data;
  },

  // Obter estatísticas do agente
  async getAgentStats(uid: string): Promise<
    ApiResponse<{
      chats_assigned: number;
      chats_resolved: number;
      avg_response_time: number;
      messages_sent: number;
      time_spent_today: number;
      last_active: string;
    }>
  > {
    const response = await api.get<
      ApiResponse<{
        chats_assigned: number;
        chats_resolved: number;
        avg_response_time: number;
        messages_sent: number;
        time_spent_today: number;
        last_active: string;
      }>
    >(`/agent/stats/${uid}`);
    return response.data;
  },

  // Listar agentes online
  async getOnlineAgents(): Promise<ApiResponse<Agent[]>> {
    const response = await api.get<ApiResponse<Agent[]>>('/agent/online');
    return response.data;
  },

  // ==================== TAREFAS DE AGENTE ====================

  // Listar tarefas do agente
  async getAgentTasks(agentUid: string): Promise<ApiResponse<AgentTask[]>> {
    const response = await api.get<ApiResponse<AgentTask[]>>(`/agent/tasks/${agentUid}`);
    return response.data;
  },

  // Criar tarefa para agente
  async createTask(data: {
    agent_uid: string;
    chat_id: string;
    notes?: string;
  }): Promise<ApiResponse<AgentTask>> {
    const response = await api.post<ApiResponse<AgentTask>>('/agent/create-task', data);
    return response.data;
  },

  // Atualizar status da tarefa
  async updateTaskStatus(
    taskId: number,
    status: 'pending' | 'in_progress' | 'completed'
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/agent/update-task', {
      id: taskId,
      status,
    });
    return response.data;
  },

  // Excluir tarefa
  async deleteTask(taskId: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/agent/delete-task', { id: taskId });
    return response.data;
  },

  // ==================== CHATS ATRIBUÍDOS ====================

  // Listar chats atribuídos ao agente
  async getAssignedChats(agentUid: string): Promise<ApiResponse<Chat[]>> {
    const response = await api.get<ApiResponse<Chat[]>>(`/agent/chats/${agentUid}`);
    return response.data;
  },

  // Atribuir chat ao agente
  async assignChat(chatId: string, agentUid: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/agent/assign-chat', {
      chat_id: chatId,
      agent_uid: agentUid,
    });
    return response.data;
  },

  // Desatribuir chat do agente
  async unassignChat(chatId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/agent/unassign-chat', {
      chat_id: chatId,
    });
    return response.data;
  },

  // Transferir chat para outro agente
  async transferChat(chatId: string, toAgentUid: string, note?: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/agent/transfer-chat', {
      chat_id: chatId,
      to_agent: toAgentUid,
      note,
    });
    return response.data;
  },

  // ==================== LOGIN DE AGENTE ====================

  // Login do agente (endpoint separado)
  async agentLogin(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    const response = await api.post<ApiResponse<{ token: string }>>('/agent/login', {
      email,
      password,
    });
    return response.data;
  },

  // Obter perfil do agente logado
  async getAgentProfile(): Promise<ApiResponse<Agent>> {
    const response = await api.get<ApiResponse<Agent>>('/agent/profile');
    return response.data;
  },

  // Atualizar perfil do agente
  async updateAgentProfile(data: Partial<{ name: string; mobile: string }>): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/agent/update-profile', data);
    return response.data;
  },

  // Alterar senha do agente (próprio)
  async changeAgentPassword(oldPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/agent/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};
