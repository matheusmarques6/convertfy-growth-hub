import { ICredentialData } from '@/types/credentials';

// Contexto de execução do node
export interface INodeExecutionContext {
  // Dados de entrada
  input: {
    message?: string;           // Mensagem recebida (para triggers)
    contact?: IContact;         // Contato atual
    variables: Record<string, unknown>;  // Variáveis do flow
    previousOutput?: unknown;   // Output do node anterior
  };

  // Funções auxiliares
  getCredential: (id: string) => ICredentialData | null;
  setVariable: (key: string, value: unknown) => void;
  log: (message: string, level?: 'info' | 'warn' | 'error') => void;
}

// Contato do WhatsApp
export interface IContact {
  phone: string;
  name?: string;
  profilePic?: string;
  pushName?: string;
}

// Resultado da execução de um node
export interface INodeExecutionResult {
  success: boolean;
  output?: Record<string, unknown>;
  error?: string;
  nextNodeId?: string;  // Para condições que direcionam para um node específico
  skipNext?: boolean;   // Pular o próximo node
  logs?: string[];      // Logs da execução
}

// Tipo de função executor
export type NodeExecutor = (
  nodeData: Record<string, unknown>,
  context: INodeExecutionContext
) => Promise<INodeExecutionResult>;

// Registro de executors por tipo de node
export type NodeExecutorRegistry = Record<string, NodeExecutor>;

// Status de execução do flow
export type FlowExecutionStatus = 'idle' | 'running' | 'completed' | 'error' | 'paused';

// Log de execução
export interface IExecutionLog {
  timestamp: string;
  nodeId: string;
  nodeType: string;
  message: string;
  level: 'info' | 'warn' | 'error';
  data?: unknown;
}

// Resultado da execução do flow
export interface IFlowExecutionResult {
  status: FlowExecutionStatus;
  startedAt: string;
  completedAt?: string;
  executedNodes: string[];
  variables: Record<string, unknown>;
  logs: IExecutionLog[];
  error?: string;
}

// Helper para acessar valores aninhados em objetos
export function getNestedValue(obj: unknown, path: string): unknown {
  if (!path) return obj;

  return path.split('.').reduce((current, key) => {
    if (current === null || current === undefined) return undefined;

    // Handle array access like "items[0]"
    const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, arrayKey, indexStr] = arrayMatch;
      const arr = (current as Record<string, unknown>)[arrayKey];
      if (Array.isArray(arr)) {
        return arr[parseInt(indexStr, 10)];
      }
      return undefined;
    }

    if (typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// Helper para substituir variáveis em strings
export function replaceVariables(
  text: string,
  variables: Record<string, unknown>
): string {
  return text.replace(/\{\{\{(\w+)\}\}\}/g, (_, key) => {
    const value = variables[key];
    return value !== undefined && value !== null ? String(value) : '';
  });
}

// Helper para substituir variáveis em objetos recursivamente
export function replaceVariablesInObject<T>(
  obj: T,
  variables: Record<string, unknown>
): T {
  if (typeof obj === 'string') {
    return replaceVariables(obj, variables) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceVariablesInObject(item, variables)) as T;
  }

  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceVariablesInObject(value, variables);
    }
    return result as T;
  }

  return obj;
}
