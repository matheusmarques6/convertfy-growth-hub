import { Node } from '@xyflow/react';
import { X, Settings } from 'lucide-react';
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

interface PropertiesPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

const nodeTypeLabels: Record<string, string> = {
  INITIAL: 'Start Node',
  SEND_MESSAGE: 'Send Message',
  CONDITION: 'Condition',
  RESPONSE_SAVER: 'Save Response',
  DELAY: 'Delay',
  DISABLE_AUTOREPLY: 'Disable Auto-Reply',
  AGENT_TRANSFER: 'Transfer to Agent',
  ASSIGN_AGENT: 'Assign Agent',
  AI_TRANSFER: 'AI Assistant',
  MAKE_REQUEST: 'HTTP Request',
  SPREADSHEET: 'Google Sheets',
  DATABASE_QUERY: 'Database Query',
};

const nodeTypeColors: Record<string, string> = {
  INITIAL: 'text-green-400',
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
      case 'INITIAL':
        return (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-300">
              This is the starting point of your flow. All conversations begin here.
            </p>
            <p className="text-xs text-green-400/80 mt-2">
              Connect this node to your first action to start building your flow.
            </p>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400">
              No configuration available for this node type.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Node Type: {node.type}
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
