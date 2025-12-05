import { create } from 'zustand';
import { Chat, Message, ChatTag } from '@/types/api';
import { chatService } from '@/services/chats';

interface ChatState {
  // Estado
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  tags: ChatTag[];
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;
  searchQuery: string;
  filter: 'all' | 'unread' | 'archived';

  // Actions - Chats
  fetchChats: () => Promise<void>;
  setActiveChat: (chat: Chat | null) => void;
  updateChat: (chatId: string, data: Partial<Chat>) => void;
  removeChat: (chatId: string) => void;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: 'all' | 'unread' | 'archived') => void;

  // Actions - Messages
  fetchMessages: (chatId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
  sendTextMessage: (text: string) => Promise<boolean>;
  sendMediaMessage: (type: 'image' | 'video' | 'document' | 'audio', file: File, caption?: string) => Promise<boolean>;

  // Actions - Unread
  incrementUnread: (chatId: string) => void;
  clearUnread: (chatId: string) => void;

  // Actions - Tags
  fetchTags: () => Promise<void>;
  addTagToChat: (chatId: string, tag: string) => Promise<boolean>;
  removeTagFromChat: (chatId: string, tag: string) => Promise<boolean>;

  // Actions - Notes
  addNoteToChat: (chatId: string, note: string) => Promise<boolean>;

  // Actions - Agent
  assignAgentToChat: (chatId: string, agentUid: string) => Promise<boolean>;

  // Computed
  filteredChats: () => Chat[];
  unreadCount: () => number;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Estado inicial
  chats: [],
  activeChat: null,
  messages: [],
  tags: [],
  isLoadingChats: false,
  isLoadingMessages: false,
  isSendingMessage: false,
  searchQuery: '',
  filter: 'all',

  // Buscar todos os chats
  fetchChats: async () => {
    set({ isLoadingChats: true });
    try {
      const response = await chatService.getChats();
      if (response.success && response.data) {
        set({ chats: response.data });
      }
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
    } finally {
      set({ isLoadingChats: false });
    }
  },

  // Definir chat ativo
  setActiveChat: (chat) => {
    set({ activeChat: chat, messages: [] });
    if (chat) {
      get().fetchMessages(chat.chat_id);
      // Marcar como lido e limpar contador
      chatService.markAsRead(chat.chat_id);
      get().clearUnread(chat.chat_id);
    }
  },

  // Atualizar dados de um chat
  updateChat: (chatId, data) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.chat_id === chatId ? { ...chat, ...data } : chat
      ),
      activeChat:
        state.activeChat?.chat_id === chatId
          ? { ...state.activeChat, ...data }
          : state.activeChat,
    }));
  },

  // Remover chat da lista
  removeChat: (chatId) => {
    set((state) => ({
      chats: state.chats.filter((chat) => chat.chat_id !== chatId),
      activeChat: state.activeChat?.chat_id === chatId ? null : state.activeChat,
    }));
  },

  // Definir busca
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Definir filtro
  setFilter: (filter) => set({ filter }),

  // Buscar mensagens de um chat
  fetchMessages: async (chatId: string) => {
    set({ isLoadingMessages: true });
    try {
      const response = await chatService.getMessages(chatId);
      if (response.success && response.data) {
        set({ messages: response.data });
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  // Adicionar nova mensagem (via socket ou após envio)
  addMessage: (message) => {
    set((state) => {
      // Verificar se a mensagem já existe
      const exists = state.messages.some(
        (m) => m.metaChatId === message.metaChatId || m.id === message.id
      );
      if (exists) return state;

      // Adicionar mensagem e atualizar último chat
      const newMessages = [...state.messages, message];
      const updatedChats = state.chats.map((chat) =>
        chat.chat_id === message.chat_id
          ? {
              ...chat,
              last_message: {
                text: message.msgContext?.text?.body,
                type: message.type,
                timestamp: message.timestamp,
              },
            }
          : chat
      );

      // Reordenar chats para colocar o mais recente no topo
      updatedChats.sort((a, b) => {
        const timeA = a.last_message?.timestamp || 0;
        const timeB = b.last_message?.timestamp || 0;
        return timeB - timeA;
      });

      return {
        messages: newMessages,
        chats: updatedChats,
      };
    });
  },

  // Atualizar status de uma mensagem
  updateMessageStatus: (messageId, status) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.metaChatId === messageId ? { ...msg, status } : msg
      ),
    }));
  },

  // Enviar mensagem de texto
  sendTextMessage: async (text: string) => {
    const { activeChat } = get();
    if (!activeChat || !text.trim()) return false;

    set({ isSendingMessage: true });
    try {
      const response = await chatService.sendTextMessage(
        activeChat.chat_id,
        text,
        activeChat.origin
      );
      return response.success;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return false;
    } finally {
      set({ isSendingMessage: false });
    }
  },

  // Enviar mídia
  sendMediaMessage: async (type, file, caption) => {
    const { activeChat } = get();
    if (!activeChat) return false;

    set({ isSendingMessage: true });
    try {
      const response = await chatService.sendMediaMessage(
        activeChat.chat_id,
        type,
        file,
        caption,
        activeChat.origin
      );
      return response.success;
    } catch (error) {
      console.error('Erro ao enviar mídia:', error);
      return false;
    } finally {
      set({ isSendingMessage: false });
    }
  },

  // Incrementar contador de não lidos
  incrementUnread: (chatId) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.chat_id === chatId
          ? { ...chat, unread_count: chat.unread_count + 1 }
          : chat
      ),
    }));
  },

  // Limpar contador de não lidos
  clearUnread: (chatId) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.chat_id === chatId ? { ...chat, unread_count: 0 } : chat
      ),
    }));
  },

  // Buscar tags
  fetchTags: async () => {
    try {
      const response = await chatService.getTags();
      if (response.success && response.data) {
        set({ tags: response.data });
      }
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
    }
  },

  // Adicionar tag ao chat
  addTagToChat: async (chatId, tag) => {
    try {
      const response = await chatService.addTag(chatId, tag);
      return response.success;
    } catch (error) {
      console.error('Erro ao adicionar tag:', error);
      return false;
    }
  },

  // Remover tag do chat
  removeTagFromChat: async (chatId, tag) => {
    try {
      const response = await chatService.removeTag(chatId, tag);
      return response.success;
    } catch (error) {
      console.error('Erro ao remover tag:', error);
      return false;
    }
  },

  // Adicionar nota ao chat
  addNoteToChat: async (chatId, note) => {
    try {
      const response = await chatService.addNote(chatId, note);
      if (response.success) {
        get().updateChat(chatId, { chat_note: note });
      }
      return response.success;
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      return false;
    }
  },

  // Atribuir agente ao chat
  assignAgentToChat: async (chatId, agentUid) => {
    try {
      const response = await chatService.assignAgent(chatId, agentUid);
      if (response.success) {
        get().updateChat(chatId, { assigned_agent: agentUid });
      }
      return response.success;
    } catch (error) {
      console.error('Erro ao atribuir agente:', error);
      return false;
    }
  },

  // Computed: chats filtrados
  filteredChats: () => {
    const { chats, searchQuery, filter } = get();

    let filtered = chats;

    // Aplicar filtro de status
    if (filter === 'unread') {
      filtered = filtered.filter((chat) => chat.unread_count > 0);
    }
    // Nota: 'archived' requer lógica adicional se implementado

    // Aplicar busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (chat) =>
          chat.sender_name.toLowerCase().includes(query) ||
          chat.sender_mobile.includes(query) ||
          chat.last_message?.text?.toLowerCase().includes(query)
      );
    }

    return filtered;
  },

  // Computed: total de não lidos
  unreadCount: () => {
    return get().chats.reduce((total, chat) => total + chat.unread_count, 0);
  },
}));

// Selector hooks para uso otimizado
export const useActiveChat = () => useChatStore((state) => state.activeChat);
export const useMessages = () => useChatStore((state) => state.messages);
export const useChatLoading = () => useChatStore((state) => state.isLoadingChats);
export const useUnreadCount = () => useChatStore((state) => state.unreadCount());
