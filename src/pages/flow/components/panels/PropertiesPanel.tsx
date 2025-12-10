import { Node } from '@xyflow/react';
import { X, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SendMessageConfig,
  ConditionConfig,
  ResponseSaverConfig,
  DelayConfig,
  DisableAutoReplyConfig,
  AgentTransferConfig,
  AITransferConfig,
  MakeRequestConfig,
  SpreadsheetConfig,
  DatabaseQueryConfig,
} from '../config';
import { MessageTriggerConfig } from '../config/triggers';

interface PropertiesPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

const nodeTypeLabels: Record<string, string> = {
  // Triggers
  TRIGGER_MESSAGE: 'Gatilho WhatsApp',
  TRIGGER_WEBHOOK: 'Gatilho Webhook',
  TRIGGER_SCHEDULE: 'Gatilho Agendado',
  TRIGGER_EVENT: 'Gatilho de Evento',
  // Legacy
  INITIAL: 'Start Node',
  // Actions
  SEND_MESSAGE: 'Enviar Mensagem',
  CONDITION: 'Condição',
  RESPONSE_SAVER: 'Salvar Resposta',
  DELAY: 'Delay',
  DISABLE_AUTOREPLY: 'Desativar Auto-Resposta',
  AGENT_TRANSFER: 'Transferir para Agente',
  ASSIGN_AGENT: 'Atribuir Agente',
  AI_TRANSFER: 'Assistente IA',
  MAKE_REQUEST: 'Requisição HTTP',
  SPREADSHEET: 'Google Sheets',
  DATABASE_QUERY: 'Query MySQL',
};

const nodeTypeColors: Record<string, string> = {
  // Triggers
  TRIGGER_MESSAGE: 'text-green-400',
  TRIGGER_WEBHOOK: 'text-orange-400',
  TRIGGER_SCHEDULE: 'text-purple-400',
  TRIGGER_EVENT: 'text-blue-400',
  // Legacy
  INITIAL: 'text-green-400',
  // Actions
  SEND_MESSAGE: 'text-blue-400',
  CONDITION: 'text-yellow-400',
  RESPONSE_SAVER: 'text-emerald-400',
  DELAY: 'text-purple-400',
  DISABLE_AUTOREPLY: 'text-gray-400',
  AGENT_TRANSFER: 'text-orange-400',
  ASSIGN_AGENT: 'text-orange-400',
  AI_TRANSFER: 'text-pink-400',
  MAKE_REQUEST: 'text-cyan-400',
  SPREADSHEET: 'text-green-400',
  DATABASE_QUERY: 'text-indigo-400',
};

export function PropertiesPanel({ node, onClose, onUpdate }: PropertiesPanelProps) {
  if (!node) return null;

  const renderConfig = () => {
    switch (node.type) {
      // Trigger nodes
      case 'TRIGGER_MESSAGE':
        return <MessageTriggerConfig node={node} onUpdate={onUpdate} />;
      case 'TRIGGER_WEBHOOK':
        return (
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">Webhook Trigger</span>
            </div>
            <p className="text-xs text-orange-300/80">
              Configuração de webhook em desenvolvimento. Salve o flow para gerar a URL.
            </p>
          </div>
        );
      case 'TRIGGER_SCHEDULE':
        return (
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Schedule Trigger</span>
            </div>
            <p className="text-xs text-purple-300/80">
              Configuração de agendamento em desenvolvimento.
            </p>
          </div>
        );
      case 'TRIGGER_EVENT':
        return (
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Event Trigger</span>
            </div>
            <p className="text-xs text-blue-300/80">
              Configuração de eventos em desenvolvimento.
            </p>
          </div>
        );

      // Action nodes
      case 'SEND_MESSAGE':
        return <SendMessageConfig node={node} onUpdate={onUpdate} />;
      case 'CONDITION':
        return <ConditionConfig node={node} onUpdate={onUpdate} />;
      case 'RESPONSE_SAVER':
        return <ResponseSaverConfig node={node} onUpdate={onUpdate} />;
      case 'DELAY':
        return <DelayConfig node={node} onUpdate={onUpdate} />;
      case 'DISABLE_AUTOREPLY':
        return <DisableAutoReplyConfig node={node} onUpdate={onUpdate} />;
      case 'AGENT_TRANSFER':
      case 'ASSIGN_AGENT':
        return <AgentTransferConfig node={node} onUpdate={onUpdate} />;
      case 'AI_TRANSFER':
        return <AITransferConfig node={node} onUpdate={onUpdate} />;
      case 'MAKE_REQUEST':
        return <MakeRequestConfig node={node} onUpdate={onUpdate} />;
      case 'SPREADSHEET':
        return <SpreadsheetConfig node={node} onUpdate={onUpdate} />;
      case 'DATABASE_QUERY':
        return <DatabaseQueryConfig node={node} onUpdate={onUpdate} />;

      // Legacy initial node
      case 'INITIAL':
        return (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-300">
              Este é o ponto inicial do seu flow. Todas as conversas começam aqui.
            </p>
            <p className="text-xs text-green-400/80 mt-2">
              Conecte este nó à sua primeira ação para começar a construir seu flow.
            </p>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400">
              Nenhuma configuração disponível para este tipo de nó.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Tipo: {node.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Settings className={`w-5 h-5 ${nodeTypeColors[node.type as string] || 'text-gray-400'}`} />
          <div>
            <h3 className="text-sm font-semibold text-white">
              {nodeTypeLabels[node.type as string] || node.type}
            </h3>
            <p className="text-[10px] text-gray-500 font-mono">{node.id}</p>
          </div>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="w-4 h-4 text-gray-400" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {renderConfig()}
        </div>
      </ScrollArea>
    </div>
  );
}
