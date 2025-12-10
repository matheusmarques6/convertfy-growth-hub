import { credentialsService } from '../credentials/credentialsService';
import {
  nodeExecutors,
  INodeExecutionContext,
  IExecutionLog,
  IFlowExecutionResult,
  FlowExecutionStatus,
  IContact,
} from './nodeExecutors';

// Tipos para nodes e edges do React Flow
interface FlowNode {
  id: string;
  type?: string;
  data?: Record<string, unknown>;
  position: { x: number; y: number };
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

// Opções de execução
interface ExecutionOptions {
  maxNodes?: number;        // Máximo de nodes a executar (evita loops infinitos)
  timeout?: number;         // Timeout total em ms
  onNodeStart?: (nodeId: string, nodeType: string) => void;
  onNodeComplete?: (nodeId: string, success: boolean) => void;
  onLog?: (log: IExecutionLog) => void;
}

export class FlowEngine {
  private nodes: FlowNode[];
  private edges: FlowEdge[];
  private variables: Record<string, unknown> = {};
  private logs: IExecutionLog[] = [];
  private executedNodes: string[] = [];
  private status: FlowExecutionStatus = 'idle';
  private options: ExecutionOptions;

  constructor(
    nodes: FlowNode[],
    edges: FlowEdge[],
    options: ExecutionOptions = {}
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.options = {
      maxNodes: options.maxNodes || 100,
      timeout: options.timeout || 5 * 60 * 1000, // 5 minutos default
      ...options,
    };
  }

  /**
   * Executa o flow a partir do trigger
   */
  async execute(input: {
    message?: string;
    contact?: IContact;
    variables?: Record<string, unknown>;
  }): Promise<IFlowExecutionResult> {
    const startedAt = new Date().toISOString();
    this.status = 'running';
    this.variables = { ...input.variables };
    this.logs = [];
    this.executedNodes = [];

    try {
      // Encontrar node inicial (trigger)
      const startNode = this.findStartNode();
      if (!startNode) {
        throw new Error('Nenhum node de início encontrado no flow');
      }

      this.log(startNode.id, startNode.type || 'unknown', 'Iniciando execução do flow', 'info');

      // Configurar timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout de execução excedido'));
        }, this.options.timeout);
      });

      // Executar flow
      await Promise.race([
        this.executeNode(startNode.id, input),
        timeoutPromise,
      ]);

      this.status = 'completed';
      this.log('flow', 'FLOW', 'Execução concluída com sucesso', 'info');

      return {
        status: this.status,
        startedAt,
        completedAt: new Date().toISOString(),
        executedNodes: this.executedNodes,
        variables: this.variables,
        logs: this.logs,
      };
    } catch (error) {
      this.status = 'error';
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      this.log('flow', 'FLOW', `Erro: ${errorMessage}`, 'error');

      return {
        status: this.status,
        startedAt,
        completedAt: new Date().toISOString(),
        executedNodes: this.executedNodes,
        variables: this.variables,
        logs: this.logs,
        error: errorMessage,
      };
    }
  }

  /**
   * Executa um node específico e seus subsequentes
   */
  private async executeNode(
    nodeId: string,
    input: { message?: string; contact?: IContact }
  ): Promise<void> {
    // Verificar limite de nodes
    if (this.executedNodes.length >= (this.options.maxNodes || 100)) {
      throw new Error('Limite máximo de nodes executados atingido');
    }

    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) {
      this.log(nodeId, 'unknown', 'Node não encontrado', 'warn');
      return;
    }

    const nodeType = node.type || 'unknown';
    this.executedNodes.push(nodeId);

    // Callback de início
    this.options.onNodeStart?.(nodeId, nodeType);

    this.log(nodeId, nodeType, `Executando node: ${nodeType}`, 'info');

    // Obter executor
    const executor = nodeExecutors[nodeType];
    if (!executor) {
      this.log(nodeId, nodeType, `Executor não encontrado para tipo: ${nodeType}`, 'warn');
      // Continuar para o próximo node mesmo sem executor
      const nextNodeId = this.findNextNode(nodeId);
      if (nextNodeId) {
        await this.executeNode(nextNodeId, input);
      }
      return;
    }

    // Criar contexto de execução
    const context: INodeExecutionContext = {
      input: {
        message: input.message,
        contact: input.contact,
        variables: this.variables,
      },
      getCredential: (id) => credentialsService.decrypt(id),
      setVariable: (key, value) => {
        this.variables[key] = value;
        this.log(nodeId, nodeType, `Variável definida: ${key}`, 'info');
      },
      log: (message, level = 'info') => {
        this.log(nodeId, nodeType, message, level);
      },
    };

    // Executar
    const result = await executor(node.data || {}, context);

    // Callback de conclusão
    this.options.onNodeComplete?.(nodeId, result.success);

    // Adicionar logs do executor
    if (result.logs) {
      for (const logMsg of result.logs) {
        this.log(nodeId, nodeType, logMsg, 'info');
      }
    }

    if (!result.success) {
      this.log(nodeId, nodeType, `Erro: ${result.error}`, 'error');
      // Decidir se continua ou para (por enquanto, para)
      throw new Error(`Falha no node ${nodeType}: ${result.error}`);
    }

    // Verificar se deve continuar
    if (result.skipNext) {
      this.log(nodeId, nodeType, 'Execução interrompida pelo node', 'info');
      return;
    }

    // Determinar próximo node
    let nextNodeId: string | undefined;

    if (result.nextNodeId) {
      // Condição especificou próximo node
      nextNodeId = result.nextNodeId;
    } else {
      // Verificar se deve mover para próximo node (config do node)
      const moveToNext = node.data?.moveToNextNode !== false;
      if (moveToNext) {
        nextNodeId = this.findNextNode(nodeId);
      }
    }

    if (nextNodeId) {
      await this.executeNode(nextNodeId, input);
    }
  }

  /**
   * Encontra o node inicial do flow
   */
  private findStartNode(): FlowNode | undefined {
    // Procurar por triggers ou node inicial
    const triggerTypes = [
      'TRIGGER_MESSAGE',
      'TRIGGER_WEBHOOK',
      'TRIGGER_SCHEDULE',
      'TRIGGER_EVENT',
      'INITIAL',
    ];

    return this.nodes.find((n) => triggerTypes.includes(n.type || ''));
  }

  /**
   * Encontra o próximo node baseado nas edges
   */
  private findNextNode(currentNodeId: string): string | undefined {
    const edge = this.edges.find((e) => e.source === currentNodeId);
    return edge?.target;
  }

  /**
   * Encontra próximo node para uma saída específica (true/false para condições)
   */
  private findNextNodeByHandle(
    currentNodeId: string,
    handle: string
  ): string | undefined {
    const edge = this.edges.find(
      (e) => e.source === currentNodeId && e.sourceHandle === handle
    );
    return edge?.target;
  }

  /**
   * Adiciona um log
   */
  private log(
    nodeId: string,
    nodeType: string,
    message: string,
    level: 'info' | 'warn' | 'error'
  ): void {
    const log: IExecutionLog = {
      timestamp: new Date().toISOString(),
      nodeId,
      nodeType,
      message,
      level,
    };

    this.logs.push(log);
    this.options.onLog?.(log);

    // Console log para debug
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✓';
    console.log(`[FlowEngine] ${prefix} [${nodeType}] ${message}`);
  }

  /**
   * Obtém as variáveis atuais
   */
  getVariables(): Record<string, unknown> {
    return { ...this.variables };
  }

  /**
   * Obtém os logs
   */
  getLogs(): IExecutionLog[] {
    return [...this.logs];
  }

  /**
   * Obtém o status atual
   */
  getStatus(): FlowExecutionStatus {
    return this.status;
  }

  /**
   * Para a execução (para uso futuro com async/await)
   */
  stop(): void {
    this.status = 'paused';
  }
}

// Função helper para executar um flow de forma simples
export async function executeFlow(
  nodes: FlowNode[],
  edges: FlowEdge[],
  input: {
    message?: string;
    contact?: IContact;
    variables?: Record<string, unknown>;
  },
  options?: ExecutionOptions
): Promise<IFlowExecutionResult> {
  const engine = new FlowEngine(nodes, edges, options);
  return engine.execute(input);
}
