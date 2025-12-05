import { io, Socket } from 'socket.io-client';
import { config } from '@/config/env';
import { getAuthToken } from './api';
import {
  SocketNewMessage,
  SocketMessageStatus,
  SocketQRCode,
  SocketQRConnected,
  SocketQRDisconnected,
} from '@/types/api';

let socket: Socket | null = null;

// Tipos de eventos do socket
export interface SocketEvents {
  connection_ack: (data: { status: string; socketId: string; userData: Record<string, unknown> }) => void;
  new_message: (data: SocketNewMessage) => void;
  message_status: (data: SocketMessageStatus) => void;
  ring: (data: { chatId: string }) => void;
  qr_code: (data: SocketQRCode) => void;
  qr_connected: (data: SocketQRConnected) => void;
  qr_disconnected: (data: SocketQRDisconnected) => void;
  request_update_chat_list: () => void;
  campaign_update: (data: { campaignId: number; status: string }) => void;
  agent_assigned: (data: { chatId: string; agentUid: string }) => void;
}

// Conectar ao servidor Socket.IO
export const connectSocket = (): Socket | null => {
  const token = getAuthToken();

  if (!token) {
    console.warn('Socket: Token não encontrado');
    return null;
  }

  if (socket?.connected) {
    console.log('Socket: Já conectado');
    return socket;
  }

  // Desconectar socket anterior se existir
  if (socket) {
    socket.disconnect();
  }

  socket = io(config.socketUrl, {
    query: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socket.on('connect', () => {
    console.log('Socket: Conectado', socket?.id);
  });

  socket.on('connection_ack', (data) => {
    if (data.status === 'success') {
      console.log('Socket: Conexão confirmada', data.socketId);
    } else {
      console.error('Socket: Erro na conexão', data);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket: Desconectado', reason);
    if (reason === 'io server disconnect') {
      // Servidor desconectou, tentar reconectar
      socket?.connect();
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Socket: Erro de conexão', error.message);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Socket: Reconectado após', attemptNumber, 'tentativas');
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('Socket: Tentativa de reconexão', attemptNumber);
  });

  socket.on('reconnect_failed', () => {
    console.error('Socket: Falha ao reconectar após todas as tentativas');
  });

  return socket;
};

// Desconectar do servidor
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket: Desconectado manualmente');
  }
};

// Obter instância do socket
export const getSocket = (): Socket | null => {
  return socket;
};

// Verificar se está conectado
export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false;
};

// Registrar listener para um evento
export const onSocketEvent = <K extends keyof SocketEvents>(
  event: K,
  callback: SocketEvents[K]
): void => {
  if (socket) {
    socket.on(event as string, callback as (...args: unknown[]) => void);
  } else {
    console.warn('Socket: Não conectado, não foi possível registrar evento', event);
  }
};

// Remover listener de um evento
export const offSocketEvent = <K extends keyof SocketEvents>(
  event: K,
  callback?: SocketEvents[K]
): void => {
  if (socket) {
    if (callback) {
      socket.off(event as string, callback as (...args: unknown[]) => void);
    } else {
      socket.off(event as string);
    }
  }
};

// Emitir evento para o servidor
export const emitSocketEvent = (event: string, data?: unknown): boolean => {
  if (socket?.connected) {
    socket.emit(event, data);
    return true;
  } else {
    console.warn('Socket: Não conectado, não foi possível emitir evento', event);
    return false;
  }
};

// Emitir evento e aguardar resposta (com timeout)
export const emitWithAck = <T>(
  event: string,
  data?: unknown,
  timeout: number = 5000
): Promise<T> => {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error('Socket não conectado'));
      return;
    }

    const timeoutId = setTimeout(() => {
      reject(new Error('Timeout ao aguardar resposta do socket'));
    }, timeout);

    socket.emit(event, data, (response: T) => {
      clearTimeout(timeoutId);
      resolve(response);
    });
  });
};
