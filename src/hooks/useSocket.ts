import { useEffect, useCallback, useState, useRef } from 'react';
import {
  connectSocket,
  disconnectSocket,
  onSocketEvent,
  offSocketEvent,
  isSocketConnected,
  SocketEvents,
} from '@/services/socket';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { SocketNewMessage, SocketMessageStatus } from '@/types/api';

// Som de notificação
const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Ignorar erro se autoplay não for permitido
    });
  } catch (error) {
    console.log('Erro ao tocar som de notificação:', error);
  }
};

// Solicitar permissão para notificações do navegador
const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
};

// Mostrar notificação do navegador
const showBrowserNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon.png',
      badge: '/badge.png',
    });
  }
};

export const useSocket = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { addMessage, updateMessageStatus, fetchChats, incrementUnread, activeChat } = useChatStore();

  const [connected, setConnected] = useState(false);
  const reconnectAttempts = useRef(0);

  // Verificar conexão periodicamente
  useEffect(() => {
    const checkConnection = setInterval(() => {
      setConnected(isSocketConnected());
    }, 1000);

    return () => clearInterval(checkConnection);
  }, []);

  // Conectar quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const socket = connectSocket();
      if (socket) {
        setConnected(socket.connected);
        requestNotificationPermission();
      }
    }

    return () => {
      // Não desconectar ao desmontar para manter a conexão entre navegação
    };
  }, [isAuthenticated]);

  // Registrar handlers de eventos
  useEffect(() => {
    if (!isAuthenticated) return;

    // Handler para nova mensagem
    const handleNewMessage: SocketEvents['new_message'] = (data: SocketNewMessage) => {
      console.log('Nova mensagem recebida:', data);

      // Adicionar mensagem ao estado
      addMessage(data.message);

      // Se não for o chat ativo, incrementar contador e notificar
      if (data.chat_id !== activeChat?.chat_id) {
        incrementUnread(data.chat_id);
        playNotificationSound();

        // Notificação do navegador
        showBrowserNotification(
          data.chat.sender_name || 'Nova mensagem',
          data.message.msgContext?.text?.body || 'Você recebeu uma nova mensagem'
        );
      }
    };

    // Handler para atualização de status de mensagem
    const handleMessageStatus: SocketEvents['message_status'] = (data: SocketMessageStatus) => {
      console.log('Status de mensagem atualizado:', data);
      updateMessageStatus(data.messageId, data.status);
    };

    // Handler para ring (alerta de nova mensagem)
    const handleRing: SocketEvents['ring'] = () => {
      playNotificationSound();
    };

    // Handler para atualizar lista de chats
    const handleUpdateChatList: SocketEvents['request_update_chat_list'] = () => {
      console.log('Solicitação para atualizar lista de chats');
      fetchChats();
    };

    // Registrar eventos
    onSocketEvent('new_message', handleNewMessage);
    onSocketEvent('message_status', handleMessageStatus);
    onSocketEvent('ring', handleRing);
    onSocketEvent('request_update_chat_list', handleUpdateChatList);

    // Cleanup
    return () => {
      offSocketEvent('new_message', handleNewMessage);
      offSocketEvent('message_status', handleMessageStatus);
      offSocketEvent('ring', handleRing);
      offSocketEvent('request_update_chat_list', handleUpdateChatList);
    };
  }, [isAuthenticated, addMessage, updateMessageStatus, fetchChats, incrementUnread, activeChat?.chat_id]);

  // Função para reconectar manualmente
  const reconnect = useCallback(() => {
    if (isAuthenticated) {
      disconnectSocket();
      const socket = connectSocket();
      if (socket) {
        setConnected(socket.connected);
        reconnectAttempts.current = 0;
      }
    }
  }, [isAuthenticated]);

  return {
    connected,
    reconnect,
    connect: connectSocket,
    disconnect: disconnectSocket,
  };
};

// Hook para eventos específicos de QR Code (usado na página de instâncias)
export const useQRCodeSocket = (onQRCode?: (qrCode: string, instanceId: string) => void) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [instanceConnected, setInstanceConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Handler para QR Code
    const handleQRCode: SocketEvents['qr_code'] = (data) => {
      console.log('QR Code recebido:', data.instanceId);
      setQrCode(data.qrCode);
      setInstanceConnected(false);
      onQRCode?.(data.qrCode, data.instanceId);
    };

    // Handler para instância conectada
    const handleConnected: SocketEvents['qr_connected'] = (data) => {
      console.log('Instância conectada:', data.instanceId);
      setQrCode(null);
      setInstanceConnected(true);
    };

    // Handler para instância desconectada
    const handleDisconnected: SocketEvents['qr_disconnected'] = (data) => {
      console.log('Instância desconectada:', data.instanceId, data.reason);
      setInstanceConnected(false);
    };

    // Registrar eventos
    onSocketEvent('qr_code', handleQRCode);
    onSocketEvent('qr_connected', handleConnected);
    onSocketEvent('qr_disconnected', handleDisconnected);

    // Cleanup
    return () => {
      offSocketEvent('qr_code', handleQRCode);
      offSocketEvent('qr_connected', handleConnected);
      offSocketEvent('qr_disconnected', handleDisconnected);
    };
  }, [isAuthenticated, onQRCode]);

  return {
    qrCode,
    instanceConnected,
    clearQRCode: () => setQrCode(null),
  };
};

// Hook para eventos de campanha
export const useCampaignSocket = (onUpdate?: (campaignId: number, status: string) => void) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleCampaignUpdate: SocketEvents['campaign_update'] = (data) => {
      console.log('Atualização de campanha:', data);
      onUpdate?.(data.campaignId, data.status);
    };

    onSocketEvent('campaign_update', handleCampaignUpdate);

    return () => {
      offSocketEvent('campaign_update', handleCampaignUpdate);
    };
  }, [isAuthenticated, onUpdate]);
};
