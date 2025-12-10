import axios from 'axios';
import {
  NodeExecutor,
  INodeExecutionResult,
  replaceVariables,
} from './types';

export const sendMessageExecutor: NodeExecutor = async (nodeData, context) => {
  const { content, credentialId } = nodeData as {
    content: {
      type: string;
      text?: { body: string; preview_url?: boolean };
      image?: { link: string; caption?: string };
      video?: { link: string; caption?: string };
      document?: { link: string; caption?: string; filename?: string };
      audio?: { link: string };
      interactive?: {
        type: string;
        body?: { text: string };
        action?: {
          buttons?: Array<{ type: string; reply: { id: string; title: string } }>;
          button?: string;
          sections?: Array<{
            title: string;
            rows: Array<{ id: string; title: string; description?: string }>;
          }>;
        };
      };
    };
    credentialId: string | null;
  };

  const logs: string[] = [];

  try {
    // Verificar credential do WhatsApp
    if (!credentialId) {
      return {
        success: false,
        error: 'Credencial do WhatsApp não configurada',
        logs: ['Erro: Credencial não configurada'],
      };
    }

    const credential = context.getCredential(credentialId);
    if (!credential) {
      return {
        success: false,
        error: 'Credencial do WhatsApp não encontrada',
        logs: ['Erro: Credencial não encontrada'],
      };
    }

    const { apiUrl, accessToken, phoneNumberId } = credential;
    const recipientPhone = context.input.contact?.phone;

    if (!recipientPhone) {
      return {
        success: false,
        error: 'Número do destinatário não disponível',
        logs: ['Erro: Sem número de telefone do contato'],
      };
    }

    logs.push(`Enviando para: ${recipientPhone}`);
    logs.push(`Tipo: ${content.type}`);

    // Construir payload da mensagem
    const messagePayload: Record<string, unknown> = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipientPhone,
    };

    // Processar conteúdo baseado no tipo
    if (content.type === 'text' && content.text) {
      const body = replaceVariables(content.text.body, context.input.variables);
      messagePayload.type = 'text';
      messagePayload.text = {
        body,
        preview_url: content.text.preview_url || false,
      };
      logs.push(`Texto: ${body.substring(0, 50)}...`);
    } else if (content.type === 'image' && content.image) {
      messagePayload.type = 'image';
      messagePayload.image = {
        link: replaceVariables(content.image.link, context.input.variables),
        caption: content.image.caption
          ? replaceVariables(content.image.caption, context.input.variables)
          : undefined,
      };
      logs.push(`Imagem: ${content.image.link}`);
    } else if (content.type === 'video' && content.video) {
      messagePayload.type = 'video';
      messagePayload.video = {
        link: replaceVariables(content.video.link, context.input.variables),
        caption: content.video.caption
          ? replaceVariables(content.video.caption, context.input.variables)
          : undefined,
      };
      logs.push(`Vídeo: ${content.video.link}`);
    } else if (content.type === 'document' && content.document) {
      messagePayload.type = 'document';
      messagePayload.document = {
        link: replaceVariables(content.document.link, context.input.variables),
        caption: content.document.caption
          ? replaceVariables(content.document.caption, context.input.variables)
          : undefined,
      };
      logs.push(`Documento: ${content.document.link}`);
    } else if (content.type === 'audio' && content.audio) {
      messagePayload.type = 'audio';
      messagePayload.audio = {
        link: replaceVariables(content.audio.link, context.input.variables),
      };
      logs.push(`Áudio: ${content.audio.link}`);
    } else if (content.type === 'interactive' && content.interactive) {
      messagePayload.type = 'interactive';

      const interactive: Record<string, unknown> = {
        type: content.interactive.type,
      };

      if (content.interactive.body) {
        interactive.body = {
          text: replaceVariables(
            content.interactive.body.text,
            context.input.variables
          ),
        };
      }

      if (content.interactive.action) {
        interactive.action = content.interactive.action;
      }

      messagePayload.interactive = interactive;
      logs.push(`Interactive: ${content.interactive.type}`);
    }

    context.log(`Enviando mensagem para ${recipientPhone}`);

    // Enviar via WhatsApp API
    const response = await axios.post(
      `${apiUrl}/${phoneNumberId}/messages`,
      messagePayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const messageId = response.data?.messages?.[0]?.id;
    logs.push(`Mensagem enviada! ID: ${messageId}`);
    context.log(`Mensagem enviada: ${messageId}`);

    // Salvar ID da mensagem como variável
    context.setVariable('lastMessageId', messageId);

    return {
      success: true,
      output: {
        messageId,
        response: response.data,
      },
      logs,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    context.log(`Erro ao enviar mensagem: ${errorMessage}`, 'error');
    logs.push(`Erro: ${errorMessage}`);

    // Extrair erro da API do WhatsApp se disponível
    if (axios.isAxiosError(error) && error.response?.data) {
      const apiError = error.response.data;
      logs.push(`API Error: ${JSON.stringify(apiError)}`);
    }

    return {
      success: false,
      error: errorMessage,
      logs,
    };
  }
};
