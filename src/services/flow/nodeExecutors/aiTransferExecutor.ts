import axios from 'axios';
import { NodeExecutor, INodeExecutionResult, replaceVariables } from './types';

export const aiTransferExecutor: NodeExecutor = async (nodeData, context) => {
  const {
    assignedToAi = true,
    messageReferenceCount = 10,
    credentialId,
    systemPrompt,
  } = nodeData as {
    assignedToAi: boolean;
    messageReferenceCount: number;
    credentialId: string | null;
    systemPrompt?: string;
  };

  const logs: string[] = [];

  try {
    if (!assignedToAi) {
      logs.push('IA desativada para este node');
      return {
        success: true,
        output: { skipped: true, reason: 'AI disabled' },
        logs,
      };
    }

    if (!credentialId) {
      return {
        success: false,
        error: 'Credencial da OpenAI não configurada',
        logs: ['Erro: Credencial não configurada'],
      };
    }

    const credential = context.getCredential(credentialId);
    if (!credential) {
      return {
        success: false,
        error: 'Credencial da OpenAI não encontrada',
        logs: ['Erro: Credencial não encontrada'],
      };
    }

    const { apiKey, baseUrl = 'https://api.openai.com/v1', defaultModel = 'gpt-4o', organization } = credential;

    // Mensagem atual do usuário
    const userMessage = context.input.message;
    if (!userMessage) {
      logs.push('Nenhuma mensagem do usuário para processar');
      return {
        success: true,
        output: { skipped: true, reason: 'No user message' },
        logs,
      };
    }

    logs.push(`Processando mensagem: ${userMessage.substring(0, 50)}...`);
    logs.push(`Modelo: ${defaultModel}`);
    logs.push(`Contexto: ${messageReferenceCount} mensagens`);

    context.log(`Enviando para OpenAI (${defaultModel})`);

    // Construir mensagens
    const messages: Array<{ role: string; content: string }> = [];

    // System prompt
    if (systemPrompt) {
      const processedPrompt = replaceVariables(systemPrompt, context.input.variables);
      messages.push({
        role: 'system',
        content: processedPrompt,
      });
    } else {
      messages.push({
        role: 'system',
        content: 'Você é um assistente útil e prestativo. Responda de forma clara e concisa.',
      });
    }

    // Adicionar histórico de conversas se disponível
    // (isso seria expandido com integração real de histórico)

    // Mensagem atual do usuário
    messages.push({
      role: 'user',
      content: userMessage,
    });

    // Preparar headers
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    if (organization) {
      headers['OpenAI-Organization'] = organization as string;
    }

    // Fazer requisição
    const response = await axios.post(
      `${baseUrl}/chat/completions`,
      {
        model: defaultModel,
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers,
        timeout: 60000, // 60 segundos timeout
      }
    );

    const aiResponse = response.data?.choices?.[0]?.message?.content;
    const usage = response.data?.usage;

    logs.push(`Resposta recebida (${usage?.total_tokens || 0} tokens)`);
    context.log(`Resposta da IA recebida`);

    // Salvar resposta como variável
    context.setVariable('aiResponse', aiResponse);
    context.setVariable('aiTokensUsed', usage?.total_tokens || 0);

    return {
      success: true,
      output: {
        response: aiResponse,
        model: defaultModel,
        usage,
      },
      logs,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    context.log(`Erro na IA: ${errorMessage}`, 'error');
    logs.push(`Erro: ${errorMessage}`);

    // Extrair erro da API da OpenAI se disponível
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const apiError = error.response.data.error;
      logs.push(`OpenAI Error: ${apiError.message || JSON.stringify(apiError)}`);
    }

    return {
      success: false,
      error: errorMessage,
      logs,
    };
  }
};
