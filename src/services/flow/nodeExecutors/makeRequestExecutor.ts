import axios from 'axios';
import {
  NodeExecutor,
  INodeExecutionResult,
  getNestedValue,
  replaceVariables,
} from './types';

export const makeRequestExecutor: NodeExecutor = async (nodeData, context) => {
  const {
    method = 'GET',
    url,
    headers = [],
    bodyData,
    bodyInputMode,
    contentType = 'application/json',
    variables = [],
    authType = 'none',
    credentialId,
  } = nodeData as {
    method: string;
    url: string;
    headers: Array<{ key: string; value: string; enabled?: boolean }>;
    bodyData: { json?: Array<{ key: string; value: string }>; raw?: string };
    bodyInputMode: 'visual' | 'raw';
    contentType: string;
    variables: Array<{ key: string; value: string }>;
    authType: 'none' | 'basic' | 'bearer' | 'api_key';
    credentialId: string | null;
  };

  const logs: string[] = [];

  try {
    // Substituir variáveis na URL
    let finalUrl = replaceVariables(url as string, context.input.variables);
    logs.push(`URL: ${finalUrl}`);

    // Preparar headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': contentType,
    };

    // Adicionar auth se configurado
    if (authType !== 'none' && credentialId) {
      const credential = context.getCredential(credentialId);
      if (credential) {
        if (authType === 'bearer') {
          const token = credential.token || credential.apiKey;
          const headerName = credential.headerName || 'Authorization';
          const prefix = credential.tokenPrefix || 'Bearer';
          requestHeaders[headerName as string] = `${prefix} ${token}`;
          logs.push(`Auth: Bearer Token aplicado`);
        } else if (authType === 'basic') {
          const auth = btoa(`${credential.username}:${credential.password}`);
          requestHeaders['Authorization'] = `Basic ${auth}`;
          logs.push(`Auth: Basic Auth aplicado`);
        } else if (authType === 'api_key') {
          const sendAs = credential.sendAs || 'header';
          const paramName = credential.parameterName || 'X-API-Key';
          const apiKey = credential.apiKey;

          if (sendAs === 'header') {
            requestHeaders[paramName as string] = apiKey as string;
          } else {
            // Query parameter
            const separator = finalUrl.includes('?') ? '&' : '?';
            finalUrl = `${finalUrl}${separator}${paramName}=${apiKey}`;
          }
          logs.push(`Auth: API Key aplicada (${sendAs})`);
        }
      } else {
        logs.push(`Aviso: Credential não encontrada`);
      }
    }

    // Headers customizados
    for (const header of headers || []) {
      if (header.key && header.enabled !== false) {
        requestHeaders[header.key] = replaceVariables(
          header.value,
          context.input.variables
        );
      }
    }

    // Preparar body
    let requestBody: unknown = undefined;
    if (method !== 'GET' && bodyData) {
      if (bodyInputMode === 'visual' && bodyData.json) {
        const bodyObj: Record<string, string> = {};
        for (const field of bodyData.json) {
          if (field.key) {
            bodyObj[field.key] = replaceVariables(
              field.value,
              context.input.variables
            );
          }
        }
        requestBody = bodyObj;
      } else if (bodyData.raw) {
        const rawBody = replaceVariables(bodyData.raw, context.input.variables);
        // Tentar parsear como JSON se o content type for JSON
        if (contentType === 'application/json') {
          try {
            requestBody = JSON.parse(rawBody);
          } catch {
            requestBody = rawBody;
          }
        } else {
          requestBody = rawBody;
        }
      }
    }

    logs.push(`Method: ${method}`);
    context.log(`Executando request ${method} ${finalUrl}`);

    // Fazer request
    const response = await axios({
      method: method as string,
      url: finalUrl,
      headers: requestHeaders,
      data: requestBody,
      timeout: 30000, // 30 segundos timeout
      validateStatus: () => true, // Não lançar erro para status codes de erro
    });

    logs.push(`Status: ${response.status}`);
    context.log(`Response status: ${response.status}`);

    // Salvar variáveis da resposta
    for (const variable of variables || []) {
      if (variable.key && variable.value) {
        const value = getNestedValue(response.data, variable.value);
        context.setVariable(variable.key, value);
        logs.push(`Variável ${variable.key} = ${JSON.stringify(value)}`);
      }
    }

    // Verificar se foi sucesso (2xx)
    const isSuccess = response.status >= 200 && response.status < 300;

    return {
      success: isSuccess,
      output: {
        statusCode: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: response.data,
      },
      error: !isSuccess
        ? `HTTP ${response.status}: ${response.statusText}`
        : undefined,
      logs,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    context.log(`Erro na request: ${errorMessage}`, 'error');
    logs.push(`Erro: ${errorMessage}`);

    return {
      success: false,
      error: errorMessage,
      logs,
    };
  }
};
