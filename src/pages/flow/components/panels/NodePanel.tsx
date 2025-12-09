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
} from 'lucide-react';

interface NodeTemplate {
  type: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: 'message' | 'tool' | 'addon';
}

const nodeTemplates: NodeTemplate[] = [
  // Messages
  {
    type: 'SEND_MESSAGE',
    label: 'Text Message',
    description: 'Send a text message',
    icon: MessageSquare,
    color: 'blue',
    category: 'message',
  },
  {
    type: 'SEND_MESSAGE',
    label: 'Image',
    description: 'Send an image',
    icon: Image,
    color: 'blue',
    category: 'message',
  },
  {
    type: 'SEND_MESSAGE',
    label: 'Document',
    description: 'Send a document',
    icon: FileText,
    color: 'blue',
    category: 'message',
  },
  {
    type: 'SEND_MESSAGE',
    label: 'Buttons',
    description: 'Send interactive buttons',
    icon: MousePointer,
    color: 'blue',
    category: 'message',
  },
  {
    type: 'SEND_MESSAGE',
    label: 'List',
    description: 'Send a list menu',
    icon: List,
    color: 'blue',
    category: 'message',
  },

  // Tools
  {
    type: 'CONDITION',
    label: 'Condition',
    description: 'Branch based on conditions',
    icon: GitBranch,
    color: 'yellow',
    category: 'tool',
  },
  {
    type: 'DELAY',
    label: 'Delay',
    description: 'Wait before next action',
    icon: Clock,
    color: 'purple',
    category: 'tool',
  },
  {
    type: 'MAKE_REQUEST',
    label: 'HTTP Request',
    description: 'Call external APIs',
    icon: Globe,
    color: 'cyan',
    category: 'tool',
  },
  {
    type: 'RESPONSE_SAVER',
    label: 'Save Response',
    description: 'Save user input as variable',
    icon: Save,
    color: 'emerald',
    category: 'tool',
  },
  {
    type: 'AGENT_TRANSFER',
    label: 'Transfer to Agent',
    description: 'Assign to human agent',
    icon: UserCheck,
    color: 'orange',
    category: 'tool',
  },
  {
    type: 'DISABLE_AUTOREPLY',
    label: 'Disable Auto-Reply',
    description: 'Pause bot temporarily',
    icon: PauseCircle,
    color: 'gray',
    category: 'tool',
  },
  {
    type: 'SPREADSHEET',
    label: 'Google Sheets',
    description: 'Save data to spreadsheet',
    icon: Table,
    color: 'green',
    category: 'tool',
  },
  {
    type: 'DATABASE_QUERY',
    label: 'Database Query',
    description: 'Execute SQL query',
    icon: Database,
    color: 'indigo',
    category: 'tool',
  },

  // Add-ons
  {
    type: 'AI_TRANSFER',
    label: 'AI Assistant',
    description: 'Transfer to AI bot',
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
        onDragStart={(e) => onDragStart(e, node.type, node.label.toLowerCase())}
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
      <h3 className="text-sm font-semibold text-white mb-4">Add Nodes</h3>

      {/* Messages */}
      <div className="mb-6">
        <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">Messages</h4>
        <div className="space-y-2">
          {messageNodes.map(renderNode)}
        </div>
      </div>

      {/* Tools */}
      <div className="mb-6">
        <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">Tools</h4>
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
