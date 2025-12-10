import {
  MessageSquare,
  GitBranch,
  Clock,
  Globe,
  UserCheck,
  Bot,
  Save,
  Image,
  FileText,
  List,
  MousePointer,
  PauseCircle,
  Table,
  Database,
  MessageCircle,
  Webhook,
  Calendar,
  Zap,
} from 'lucide-react';
import { triggerConfigs, TriggerType } from '../nodes/triggers/types';

interface NodeTemplate {
  type: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: 'trigger' | 'message' | 'tool' | 'addon';
  subType?: string;
}

// Trigger templates
const triggerTemplates: NodeTemplate[] = [
  {
    type: 'TRIGGER_MESSAGE',
    label: 'Mensagem WhatsApp',
    description: 'Inicia quando recebe mensagem',
    icon: MessageCircle,
    color: 'green',
    category: 'trigger',
  },
  {
    type: 'TRIGGER_WEBHOOK',
    label: 'Webhook',
    description: 'Inicia por chamada HTTP',
    icon: Webhook,
    color: 'orange',
    category: 'trigger',
  },
  {
    type: 'TRIGGER_SCHEDULE',
    label: 'Agendamento',
    description: 'Inicia em horário programado',
    icon: Calendar,
    color: 'purple',
    category: 'trigger',
  },
  {
    type: 'TRIGGER_EVENT',
    label: 'Evento',
    description: 'Inicia por evento do sistema',
    icon: Zap,
    color: 'blue',
    category: 'trigger',
  },
];

const nodeTemplates: NodeTemplate[] = [
  // Messages
  {
    type: 'SEND_MESSAGE',
    label: 'Texto',
    description: 'Enviar mensagem de texto',
    icon: MessageSquare,
    color: 'blue',
    category: 'message',
    subType: 'text',
  },
  {
    type: 'SEND_MESSAGE',
    label: 'Imagem',
    description: 'Enviar uma imagem',
    icon: Image,
    color: 'blue',
    category: 'message',
    subType: 'image',
  },
  {
    type: 'SEND_MESSAGE',
    label: 'Documento',
    description: 'Enviar um documento',
    icon: FileText,
    color: 'blue',
    category: 'message',
    subType: 'document',
  },
  {
    type: 'SEND_MESSAGE',
    label: 'Botões',
    description: 'Enviar botões interativos',
    icon: MousePointer,
    color: 'blue',
    category: 'message',
    subType: 'buttons',
  },
  {
    type: 'SEND_MESSAGE',
    label: 'Lista',
    description: 'Enviar menu de lista',
    icon: List,
    color: 'blue',
    category: 'message',
    subType: 'list',
  },

  // Tools
  {
    type: 'CONDITION',
    label: 'Condição',
    description: 'Ramificar baseado em condições',
    icon: GitBranch,
    color: 'yellow',
    category: 'tool',
  },
  {
    type: 'DELAY',
    label: 'Delay',
    description: 'Aguardar antes da próxima ação',
    icon: Clock,
    color: 'purple',
    category: 'tool',
  },
  {
    type: 'MAKE_REQUEST',
    label: 'Requisição HTTP',
    description: 'Chamar APIs externas',
    icon: Globe,
    color: 'cyan',
    category: 'tool',
  },
  {
    type: 'RESPONSE_SAVER',
    label: 'Salvar Resposta',
    description: 'Salvar input como variável',
    icon: Save,
    color: 'emerald',
    category: 'tool',
  },
  {
    type: 'AGENT_TRANSFER',
    label: 'Transferir Agente',
    description: 'Atribuir a agente humano',
    icon: UserCheck,
    color: 'orange',
    category: 'tool',
  },
  {
    type: 'DISABLE_AUTOREPLY',
    label: 'Desativar Auto-Resposta',
    description: 'Pausar bot temporariamente',
    icon: PauseCircle,
    color: 'gray',
    category: 'tool',
  },
  {
    type: 'SPREADSHEET',
    label: 'Google Sheets',
    description: 'Salvar dados na planilha',
    icon: Table,
    color: 'green',
    category: 'tool',
  },
  {
    type: 'DATABASE_QUERY',
    label: 'Query MySQL',
    description: 'Executar query SQL',
    icon: Database,
    color: 'indigo',
    category: 'tool',
  },

  // Add-ons
  {
    type: 'AI_TRANSFER',
    label: 'Assistente IA',
    description: 'Transferir para bot IA',
    icon: Bot,
    color: 'pink',
    category: 'addon',
  },
];

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500/20 border-blue-500/50 hover:border-blue-400',
  yellow: 'bg-yellow-500/20 border-yellow-500/50 hover:border-yellow-400',
  purple: 'bg-purple-500/20 border-purple-500/50 hover:border-purple-400',
  cyan: 'bg-cyan-500/20 border-cyan-500/50 hover:border-cyan-400',
  emerald: 'bg-emerald-500/20 border-emerald-500/50 hover:border-emerald-400',
  orange: 'bg-orange-500/20 border-orange-500/50 hover:border-orange-400',
  gray: 'bg-gray-500/20 border-gray-500/50 hover:border-gray-400',
  green: 'bg-green-500/20 border-green-500/50 hover:border-green-400',
  indigo: 'bg-indigo-500/20 border-indigo-500/50 hover:border-indigo-400',
  pink: 'bg-pink-500/20 border-pink-500/50 hover:border-pink-400',
};

const iconColorClasses: Record<string, string> = {
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  cyan: 'bg-cyan-500',
  emerald: 'bg-emerald-500',
  orange: 'bg-orange-500',
  gray: 'bg-gray-500',
  green: 'bg-green-500',
  indigo: 'bg-indigo-500',
  pink: 'bg-pink-500',
};

interface NodePanelProps {
  onDragStart: (event: React.DragEvent, nodeType: string, subType?: string) => void;
}

export function NodePanel({ onDragStart }: NodePanelProps) {
  const messageNodes = nodeTemplates.filter((n) => n.category === 'message');
  const toolNodes = nodeTemplates.filter((n) => n.category === 'tool');
  const addonNodes = nodeTemplates.filter((n) => n.category === 'addon');

  const renderTriggerNode = (node: NodeTemplate) => {
    const Icon = node.icon;
    const config = triggerConfigs[node.type as TriggerType];

    return (
      <div
        key={node.type}
        className="p-3 rounded-xl border-2 cursor-grab transition-all duration-200 hover:scale-[1.02]"
        style={{
          backgroundColor: `${config.color}15`,
          borderColor: `${config.color}60`,
        }}
        draggable
        onDragStart={(e) => onDragStart(e, node.type)}
      >
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: config.color }}
          >
            <Zap className="w-3 h-3 text-white" />
          </div>
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${config.color}30` }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">{node.label}</div>
            <div className="text-[10px] text-gray-400 truncate">{node.description}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderNode = (node: NodeTemplate) => {
    const Icon = node.icon;
    return (
      <div
        key={`${node.type}-${node.label}`}
        className={`
          p-3 rounded-lg border-2 cursor-grab
          ${colorClasses[node.color]}
          transition-all duration-200 hover:scale-[1.02]
        `}
        draggable
        onDragStart={(e) => onDragStart(e, node.type, node.subType || node.label.toLowerCase())}
      >
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${iconColorClasses[node.color]}`}>
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium text-white">{node.label}</div>
            <div className="text-[10px] text-gray-400">{node.description}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-white mb-4">Adicionar Nós</h3>

      {/* Triggers */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <h4 className="text-xs font-medium text-yellow-400 uppercase">Gatilhos</h4>
        </div>
        <div className="space-y-2">
          {triggerTemplates.map(renderTriggerNode)}
        </div>
      </div>

      {/* Messages */}
      <div className="mb-6">
        <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">Mensagens</h4>
        <div className="space-y-2">
          {messageNodes.map(renderNode)}
        </div>
      </div>

      {/* Tools */}
      <div className="mb-6">
        <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">Ferramentas</h4>
        <div className="space-y-2">
          {toolNodes.map(renderNode)}
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">Add-ons</h4>
        <div className="space-y-2">
          {addonNodes.map(renderNode)}
        </div>
      </div>
    </div>
  );
}
