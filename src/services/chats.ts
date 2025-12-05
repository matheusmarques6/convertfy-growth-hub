import api from './api';
import { ApiResponse, Chat, Message, ChatTag } from '@/types/api';

export const chatService = {
  // Listar todos os chats do usuário
  async getChats(): Promise<ApiResponse<Chat[]>> {
    const response = await api.get<ApiResponse<Chat[]>>('/inbox/get-chats');
    return response.data;
  },

  // Obter chat específico por ID
  async getChat(chatId: string): Promise<ApiResponse<Chat>> {
    const response = await api.get<ApiResponse<Chat>>(`/inbox/get-chat/${chatId}`);
    return response.data;
  },

  // Obter mensagens de um chat
  async getMessages(chatId: string, page: number = 1, limit: number = 50): Promise<ApiResponse<Message[]>> {
    const response = await api.get<ApiResponse<Message[]>>(
      `/inbox/get-messages/${chatId}`,
      { params: { page, limit } }
    );
    return response.data;
  },

  // Enviar mensagem de texto
  async sendTextMessage(
    chatId: string,
    text: string,
    origin: 'meta' | 'qr' = 'meta'
  ): Promise<ApiResponse<{ messageId: string }>> {
    const response = await api.post<ApiResponse<{ messageId: string }>>('/inbox/send-message', {
      chat_id: chatId,
      type: 'text',
      message: { text: { body: text } },
      origin,
    });
    return response.data;
  },

  // Enviar mídia (imagem, vídeo, documento, áudio)
  async sendMediaMessage(
    chatId: string,
    type: 'image' | 'video' | 'document' | 'audio',
    file: File,
    caption?: string,
    origin: 'meta' | 'qr' = 'meta'
  ): Promise<ApiResponse<{ messageId: string }>> {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('type', type);
    formData.append('media', file);
    formData.append('origin', origin);
    if (caption) {
      formData.append('caption', caption);
    }

    const response = await api.post<ApiResponse<{ messageId: string }>>(
      '/inbox/send-media',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Enviar template Meta
  async sendTemplate(
    chatId: string,
    templateName: string,
    templateData: Record<string, unknown>
  ): Promise<ApiResponse<{ messageId: string }>> {
    const response = await api.post<ApiResponse<{ messageId: string }>>('/inbox/send-template', {
      chat_id: chatId,
      template_name: templateName,
      template_data: templateData,
    });
    return response.data;
  },

  // Enviar mensagem interativa (botões ou lista)
  async sendInteractiveMessage(
    chatId: string,
    interactiveType: 'button' | 'list',
    interactiveData: Record<string, unknown>,
    origin: 'meta' | 'qr' = 'meta'
  ): Promise<ApiResponse<{ messageId: string }>> {
    const response = await api.post<ApiResponse<{ messageId: string }>>('/inbox/send-interactive', {
      chat_id: chatId,
      type: interactiveType,
      interactive: interactiveData,
      origin,
    });
    return response.data;
  },

  // Marcar chat como lido
  async markAsRead(chatId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/mark-as-read', { chat_id: chatId });
    return response.data;
  },

  // Excluir chat
  async deleteChat(chatId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/delete-chat', { chat_id: chatId });
    return response.data;
  },

  // Buscar chats
  async searchChats(query: string): Promise<ApiResponse<Chat[]>> {
    const response = await api.post<ApiResponse<Chat[]>>('/inbox/search-chats', { query });
    return response.data;
  },

  // Adicionar nota ao chat
  async addNote(chatId: string, note: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/add-note', {
      chat_id: chatId,
      note,
    });
    return response.data;
  },

  // Obter nota do chat
  async getNote(chatId: string): Promise<ApiResponse<{ note: string }>> {
    const response = await api.get<ApiResponse<{ note: string }>>(`/inbox/get-note/${chatId}`);
    return response.data;
  },

  // Adicionar tag ao chat
  async addTag(chatId: string, tag: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/add-tag', {
      chat_id: chatId,
      tag,
    });
    return response.data;
  },

  // Remover tag do chat
  async removeTag(chatId: string, tag: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/remove-tag', {
      chat_id: chatId,
      tag,
    });
    return response.data;
  },

  // Listar todas as tags
  async getTags(): Promise<ApiResponse<ChatTag[]>> {
    const response = await api.get<ApiResponse<ChatTag[]>>('/inbox/get-tags');
    return response.data;
  },

  // Criar nova tag
  async createTag(name: string, color?: string): Promise<ApiResponse<ChatTag>> {
    const response = await api.post<ApiResponse<ChatTag>>('/inbox/create-tag', {
      name,
      color,
    });
    return response.data;
  },

  // Excluir tag
  async deleteTag(tagId: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/delete-tag', { tag_id: tagId });
    return response.data;
  },

  // Atribuir chat a um agente
  async assignAgent(chatId: string, agentUid: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/assign-agent', {
      chat_id: chatId,
      agent_uid: agentUid,
    });
    return response.data;
  },

  // Remover atribuição de agente
  async unassignAgent(chatId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/unassign-agent', {
      chat_id: chatId,
    });
    return response.data;
  },

  // Transferir chat para outro agente
  async transferChat(chatId: string, toAgentUid: string, note?: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/transfer-chat', {
      chat_id: chatId,
      to_agent: toAgentUid,
      note,
    });
    return response.data;
  },

  // Arquivar chat
  async archiveChat(chatId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/archive-chat', {
      chat_id: chatId,
    });
    return response.data;
  },

  // Desarquivar chat
  async unarchiveChat(chatId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/unarchive-chat', {
      chat_id: chatId,
    });
    return response.data;
  },

  // Obter chats arquivados
  async getArchivedChats(): Promise<ApiResponse<Chat[]>> {
    const response = await api.get<ApiResponse<Chat[]>>('/inbox/get-archived');
    return response.data;
  },

  // Bloquear contato
  async blockContact(chatId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/block-contact', {
      chat_id: chatId,
    });
    return response.data;
  },

  // Desbloquear contato
  async unblockContact(chatId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/inbox/unblock-contact', {
      chat_id: chatId,
    });
    return response.data;
  },
};
